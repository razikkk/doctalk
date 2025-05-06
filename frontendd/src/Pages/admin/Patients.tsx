import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { blockUser, getAllUser, unblockUser } from "../../utils/adminAuth";
import { setUsers, updateUserStatus } from "../../Redux/adminSlice/adminAuthSlice";
import userImage from '../../assets/testimonial.jpeg'
import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RootState } from "../../Redux/store";
import CustomConfirmAlert from "../../Components/ConfirmAlert";
import debounce from 'lodash.debounce'


const Patients = () => {
  interface User {
    _id: string;
    name: string;
    email: string;
    age?: number;
    gender?: string;
    isBlocked: boolean;
  }

  const dispatch = useDispatch();
  const users = useSelector((state:RootState) => state.adminAuth.users || []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentlyBlocked, setIsCurrentlyBlocked] = useState<boolean>(false);
  const [totalPages,setTotalPages] = useState(1)

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Number of users per page
  

  // Fetch users on component mount
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     setLoading(true);
  //     try {
  //       const userData = await getAllUser();
  //       if (userData) {
  //         dispatch(setUsers(userData));
  //         setLocalUsers(userData); 
  //       }
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUsers();
  // }, [dispatch]);

  
  // useEffect(() => {
  //   if (users && users.length > 0) {
  //     setLocalUsers(users);
  //   }
  // }, [users]);

 
  // const filteredUsers = localUsers.filter((user) =>
  //   user && user.name && user.name.toLowerCase().includes(search.toLowerCase())
  // );

  // const indexOfLastUser = currentPage * usersPerPage;
  // const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // const handlePageChange = (_:React.ChangeEvent<unknown>, value:number) => {
  //   setCurrentPage(value);
  // };

  const fetchUsers = useCallback(
    debounce(async(searchValue:string,page:number)=>{
      setLoading(true)
      try {
        const response = await getAllUser(searchValue,page,usersPerPage)
        console.log(response,'use')
        if(response){
          dispatch(setUsers(response.users))
          setLocalUsers(response.users)
          setTotalPages(response.totalPages)
        }
      } catch (error:any) {
        console.log(error.message)
      }finally{
        setLoading(false)
      }
    },500),
    []
  )

  useEffect(()=>{
    fetchUsers(search,currentPage)
  },[search,currentPage,fetchUsers])

  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (_:React.ChangeEvent<unknown>,value:number)=>{
    setCurrentPage(value)
  }


  const handleBlockAndUnblock = async (userId:string, isCurrentlyBlocked:boolean) => {
    setCurrentUserId(userId);
    setIsCurrentlyBlocked(isCurrentlyBlocked);
    setShowAlert(true); 
  };

  const handleConfirm = async () => {
    if(!currentUserId) return 
    setLoadingUsers(prev => ({ ...prev, [currentUserId]: true }));
    try {
      let result;
      if (isCurrentlyBlocked) {
        result = await unblockUser(currentUserId);
      } else {
        result = await blockUser(currentUserId);
      }

      if (result && result.success) {
        dispatch(updateUserStatus({ userId: currentUserId, isBlocked: !isCurrentlyBlocked }));

        setLocalUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === currentUserId
              ? { ...user, isBlocked: !isCurrentlyBlocked }
              : user
          )
        );
      } else {
        console.error("Operation failed:", result?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error in block/unblock:", error);
    } finally {
      setLoadingUsers(prev => ({ ...prev, [currentUserId]: false }));
      setShowAlert(false); // Close the modal
    }
  };

  useEffect(()=>{
    setCurrentPage(1)
  },[search])
  
  const handleCancel = () => {
    setShowAlert(false); // Close the modal
  };

  return (
    <div className="w-full px-6 mt-6">
      {/* Search Bar */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder="Search Users..."
          value={search}
          onChange={handleSearchChange}
          className="p-3 border  rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-[#157B7B]"
        />
        <button className="bg-[#157B7B] text-white px-6 py-3 rounded hover:bg-[#0f5e5e]" disabled={loading}>
          Search
        </button>
      </div>

      {/* Heading Row */}
      <div className="flex justify-between items-center p-4 bg-[#157B7B] text-white font-semibold rounded-lg shadow-md">
        <div className="w-1/5">Profile</div>
        <div className="w-1/5">Name</div>
        <div className="w-1/5">Email</div>
        <div className="w-1/10">Age</div>
        <div className="w-1/10">Gender</div>
        <div className="w-1/10">Action</div>
      </div>

      {/* User List */}
      <div className="space-y-4 mt-4">
        {localUsers.length > 0 ? (
          localUsers.map((user:any) => (
            <div
              key={user._id}
              className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <div className="w-1/5 flex justify-start">
                <img
                  src={userImage}
                  alt="profile"
                  className="w-12 h-12 rounded-full "
                />
              </div>
              <div className="w-1/5 text-gray-800">{user.name}</div>
              <div className="w-1/5 text-gray-500">{user.email}</div>
              
              <div className="w-1/10 text-gray-600">{user.age} yrs</div>
              <div className="w-1/10 text-gray-600">{user.gender}</div>
              <div className="w-1/10">
                <button className="bg-[#157B7B] text-white px-4 py-2 rounded hover:bg-[#0f5e5e]"
                onClick={()=>handleBlockAndUnblock(user._id,user.isBlocked)}
                disabled={loadingUsers[user._id]}
                >
                  {
                    loadingUsers[user._id] ? "loading": user.isBlocked ? "unblock" : "block"
                  }
                </button>
                {showAlert && (
        <CustomConfirmAlert
          isCurrentlyBlocked={isCurrentlyBlocked}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No users found</p>
        )}
      </div>
      <Pagination
          count={totalPages} // Total pages
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />   </div>
  );
};

export default Patients;
