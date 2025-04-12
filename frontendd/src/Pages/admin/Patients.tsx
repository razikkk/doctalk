import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { blockUser, getAllUser, unblockUser } from "../../utils/adminAuth";
import { setUsers, updateUserStatus } from "../../Redux/adminAuthSlice";
import userImage from '../../assets/testimonial.jpeg'
import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RootState } from "../../Redux/store";


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

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 1; // Number of users per page
  

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userData = await getAllUser();
        if (userData) {
          dispatch(setUsers(userData));
          setLocalUsers(userData); 
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [dispatch]);

  
  useEffect(() => {
    if (users && users.length > 0) {
      setLocalUsers(users);
    }
  }, [users]);

 
  const filteredUsers = localUsers.filter((user) =>
    user && user.name && user.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (_:React.ChangeEvent<unknown>, value:number) => {
    setCurrentPage(value);
  };

  
  const handleBlockAndUnblock = async (userId:string, isCurrentlyBlocked:boolean) => {
    const response = confirm(`Are you sure you want to ${isCurrentlyBlocked ? 'unblock' : 'block'} this user?`)
    
    if(!response) return 
    setLoadingUsers(prev => ({ ...prev, [userId]: true }));

    try {
      let result;
      if (isCurrentlyBlocked) {
        result = await unblockUser(userId);
      } else {
        result = await blockUser(userId);
      }

      if (result && result.success) {
       
        dispatch(updateUserStatus({ userId, isBlocked: !isCurrentlyBlocked }));

       
        setLocalUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId
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
      // Clear loading state for this user
      setLoadingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  useEffect(()=>{
    setCurrentPage(1)
  },[search])

  return (
    <div className="w-full px-6 mt-6">
      {/* Search Bar */}
      <div className="mb-6 flex justify-between">
        <input
          type="text"
          placeholder="Search Users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user:any) => (
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
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No users found</p>
        )}
      </div>
      <Pagination
          count={Math.ceil(filteredUsers.length / usersPerPage)} // Total pages
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
