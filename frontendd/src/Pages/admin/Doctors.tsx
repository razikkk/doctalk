import  { useEffect, useState } from 'react'
import { getAllDoctors } from '../../utils/adminAuth'
import { GrLinkNext } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import { Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const Doctors = () => {

    interface Doctor{
     _id: string;
    name: string;
    email: string;
    age: number;
    specialisation: string;
    status:string
    imageUrl?: string;
    }
    const [doctor,setDoctor] = useState<Doctor[]>([])
    const [search,setSearch] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const [currentPage,setCurrentPage] = useState(1)
    const doctorsPerPage = 1

    useEffect(()=>{
        const fetchAllDoctors = async()=>{
            try {
                
                const response = await getAllDoctors()
                console.log(response)
                if(response.success){
                    setDoctor(response.doctor)
                }
            } catch (error) {
                console.log("error fetching doctors",doctor)
            }finally{
                setLoading(false)
            }
        }
        fetchAllDoctors()
    },[])



    const filteredDoctors = doctor.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase())
    )

    const indexOfLastDoctor  = currentPage * doctorsPerPage
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
    const paginatedDoctors = filteredDoctors.slice(indexOfFirstDoctor,indexOfLastDoctor)

    const handlePageChange  = (_:React.ChangeEvent<unknown>,value:number)=>{
        setCurrentPage(value)
    }
   
    useEffect(()=>{
        setCurrentPage(1)
    },[search])
    


  return (
    <div className="w-full px-6 mt-6">
    {/* Search Bar */}
    <div className="mb-6 flex justify-between">
        <input
            type="text"
            placeholder="Search Doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-[#157B7B]"
        />
        <button className="bg-[#157B7B] text-white px-6 py-3 rounded hover:bg-[#0f5e5e]">
            Search
        </button>
    </div>

    {/* Heading Row */}
    <div className="grid grid-cols-7 gap-4 p-4 bg-[#157B7B] text-white font-semibold rounded-lg shadow-md">
        <div className="text-center">Profile</div>
        <div className="text-center">Name</div>
        <div className="text-center">Email</div>
        <div className="text-center">Age</div>
        <div className="text-center">Specialisation</div>
        <div className="text-center">Status</div>
        {/* <div className="text-center">More</div> */}
    </div>

    {/* Loading State */}
    {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading...</p>
    ) : paginatedDoctors.length > 0 ? (
        <div className="mt-4 space-y-2">
            {paginatedDoctors.map((doctor: any) => (
                <div
                    key={doctor._id}
                    className="grid grid-cols-7 gap-4 p-4 bg-white shadow-md rounded-lg border border-gray-200 items-center"
                >
                    <div className="flex justify-center">
                        <img
                            src={doctor.imageUrl || "/default-avatar.png"}
                            alt="profile"
                            className="w-12 h-12 rounded-full"
                        />
                    </div>
                    <div className="text-center text-gray-800">{doctor.name}</div>
                    <div className="text-center text-gray-500">{doctor.email}</div>
                    <div className="text-center text-gray-600">{doctor.age} yrs</div>
                    <div className="text-center text-gray-600">{doctor.specialization?.name}</div>
                    <div
                        className={`text-center font-medium px-3 py-1 rounded-lg ${
                            doctor.isActive === "pending"
                                ? " text-yellow-500"
                                : doctor.isActive === "approved"
                                ? "text-green-700"
                                : doctor.isActive === "rejected"
                                ? "text-red-700"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        {doctor.isActive}
                    </div>
                    <div className="text-center relative">
    
    {doctor.isActive === "pending" && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
    )}

<div className="flex justify-center">
    <button className=" text-white px-3 py-2 rounded flex items-center justify-center relative ml-[-10px]" onClick={()=>navigate(`/admin/doctors/${doctor._id}`)}>
        <GrLinkNext className=" text-[#157B7B] text-xl mr-2" /> 
    </button>
</div>

</div>
                </div>
            ))}
        </div>
    ) : (
        <p className="text-center text-gray-500 mt-4">No doctors found</p>
    )}

    <Pagination
    count={Math.ceil(filteredDoctors.length/doctorsPerPage)}
    page={currentPage}
    onChange={handlePageChange}
    variant='outlined'
    shape='rounded'
    renderItem={(item)=>(
        <PaginationItem
        slots={{previous:ArrowBackIcon,next:ArrowForwardIcon}}
        {...item}
        />
  )}
    />

    
</div>
)
}

export default Doctors