import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster,toast } from 'sonner'
import { getDoctorStatus, verificationSectionTwo } from '../../utils/doctorAuth'
import InputField from '../../Components/InputField'
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import doctor from '../../assets/doctor.jpeg'
import {  getActiveSpecialites } from '../../utils/adminAuth'
import { Alert } from '@mui/material'
import { InfoIcon } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { updateFormData } from '../../Redux/doctorSlice/doctorFormSectionTwoSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'

type Speciality = {
  _id:string,
  name:string
}


const SectionTwo = () => {
    const navigate = useNavigate()
    const [speciality,setSpeciality] = useState<Speciality[]>([])
    const [showMessage,setShowMessage] = useState(false)
    const [loading,setLoading] = useState(false)
    const formData = useSelector((state:RootState)=>state.doctorFormSectionTwo)
    const dispatch = useDispatch()

    //file handling with state
    const [imageFile,setImageFile] = useState<File | null>(null)
    const [identityProofFile,setIdentityProofFile] = useState<File | null>(null)
    const [medicalCertificatFile,setMedicalCertificateFile] = useState<File | null>(null)
    interface PreviewState {
        imageUrl: string;
        identityProofUrl: string;
        medicalCertificateUrl: string;
        [key: string]: string; 
      }
    const [preview,setPreview] = useState<PreviewState>({
        imageUrl:'',
        identityProofUrl:'',
        medicalCertificateUrl:''
    })
    // const [formData,setFormData] = useState({
    //     specialization:"",
    //     about:"",
    //     university:"",
    //     imageUrl:null,
    //     identityProofUrl:null,
    //     medicalCertificateUrl:null
    // })

    useEffect(() => {
        const fetchSpecialities = async() => {
            try {
                const data = await getActiveSpecialites();
                console.log('All specializations data:', data);
                if (data && data.data && Array.isArray(data.data)) {
                    setSpeciality(data.data);
                } else if (data && Array.isArray(data)) {
                    setSpeciality(data);
                }
            } catch (error) {
                console.log("Error fetching specialities:", error);
            }
        };
        fetchSpecialities();
    }, []);

    useEffect(()=>{
        return ()=>{
            Object.values(preview).forEach(url=>{
                if(url) URL.revokeObjectURL(url)
            })
        }
    },[preview])

    useEffect(()=>{
        const checkOnLoad = async()=>{
            const storedDoctor = JSON.parse(localStorage.getItem('doctor') || '{}')
            const isGoogleLogin = localStorage.getItem("isGoogleLogin") === "true"
            if(!storedDoctor || !storedDoctor.email){
                toast.error("Doctor details missing please signUp again")
                return
            }
            try {
                const response = await getDoctorStatus(storedDoctor.email)
                if(response.success){
                    const status = response.status
                    if(status === "approved"){
                        toast.success("Your request has been approved")
                        setTimeout(()=>{
                          if(isGoogleLogin){
                            navigate('/doctor/dashboard')
                          }else{
                            navigate('/doctor/login')
                          }
                        },1000)
                    }else if(status === "rejected"){
                        toast.error("Your request has been rejected")
                        setTimeout(()=>{
                            navigate('/doctor/register')
                        },1000)
                        
                    }else if(status === "pending"){
                        setShowMessage(true)
                        toast.info("Your application is still under review. please wait")
                    }
                }
            } catch (error:any) {
                console.log(error.message)
            }
        }
        checkOnLoad()
    },[navigate])
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name,value} = e.target
        console.log(`chnging ${name} to ${value}`)
        dispatch(updateFormData({[name]:value}))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0]; 
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setPreview((prev)=>({
                ...prev,
                [fieldName]:previewUrl
            }))
          switch (fieldName){
            case "imageUrl":
                setImageFile(file)
                break
            case "identityProofUrl":
                setIdentityProofFile(file)
                break
            case "medicalCertificateUrl":
                setMedicalCertificateFile(file)
                break
            default:
            break
          } 
          
        }
    };

    const removePreview = (fieldName:string)=>{
        setPreview((prev)=>{
            if(prev[fieldName]){
                URL.revokeObjectURL(prev[fieldName])
            }
            return {
                ...prev,
                [fieldName] : ''
            }
        })

        switch (fieldName) {
            case "imageUrl":
                setImageFile(null)
                break
            case "identityProofUrl":
                setIdentityProofFile(null)
                break
            case "medicalCertificateUrl":
                setMedicalCertificateFile(null)
                break
        }
        const input = document.getElementById(fieldName) as HTMLInputElement
        if(input) input.value = ''
    }
    
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); 
        
        try {
            console.log("form", formData);
            if (!imageFile || !identityProofFile || !medicalCertificatFile) {
                toast.error("Please upload all required files.");
                setLoading(false);
                return;
            }
    
            const storedDoctor = JSON.parse(localStorage.getItem('doctor') || '{}');
    
            if (!storedDoctor || !storedDoctor.email) {
                toast.error("Doctor details missing. Please SignUp again");
                setLoading(false);
                return;
            }
    
            const specializationId = formData.specialization;
            if (!/^[0-9a-fA-F]{24}$/.test(specializationId)) {
                toast.error("Invalid specialization selected. Please select a valid specialization.");
                setLoading(false);
                return;
            }
    
            const formDataToSend = new FormData();
            formDataToSend.append("email", storedDoctor.email);
            formDataToSend.append("specialization", formData.specialization);
            formDataToSend.append("about", formData.about);
            formDataToSend.append("university", formData.university);
            
            if (imageFile) formDataToSend.append("imageUrl", imageFile);
            if (identityProofFile) formDataToSend.append("identityProofUrl", identityProofFile);
            if (medicalCertificatFile) formDataToSend.append("medicalCertificateUrl", medicalCertificatFile);
    
            const response = await verificationSectionTwo(formDataToSend);
    
            if (response.success && response.doctor.isActive === 'pending') {
                console.log(response.doctor.isActive, 'active');
                toast.success(response.message);
                setShowMessage(true);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An error occurred during submission");
        } finally {
            setLoading(false); // Stop loading in all cases
        }
    };

    const checkStatus = async()=>{
        try {
            const storedDoctor = JSON.parse(localStorage.getItem('doctor') || '{}')

            if(!storedDoctor || !storedDoctor.email){
                toast.error("Doctor details missing please signUp again")
                return
            }
            const response = await getDoctorStatus(storedDoctor.email)
            const isGoogleLogin = localStorage.getItem("isGoogleLogin")
            console.log(response,'res')
            if(response.success){
                const status = response.status
                if(status === "approved"){
                    toast.success("Your request has been approved")
                    setTimeout(()=>{
                      if(isGoogleLogin){
                        navigate('/doctor/dashboard')
                      }else{
                        navigate('/doctor/login')
                      }
                    },1000)
                }else if(status === "rejected"){
                    localStorage.removeItem('doctor')
                    localStorage.removeItem('doctorAccessToken')
                    toast.error("Your request has been rejected")
                    setTimeout(()=>{
                        navigate('/doctor/register')
                    },1000)
                }else if(status === "pending"){
                    toast.info("Your application is still under review. please wait")
                }else{
                    toast.error(response.message)
                }
            }
        } catch (error:any) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        if(showMessage){
            checkStatus()

            const interValid = setInterval(checkStatus , 30000)

            return ()=> clearInterval(interValid)

        }
    },[showMessage])

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
  <Toaster />
  
  <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-[900px] max-w-4xl h-auto md:h-[650px]">
    <div className="w-1/2 flex items-center justify-center p-6">
      <img
        src={doctor}
        alt="Doctor Verification Step 2"
        className="w-full h-auto rounded-lg shadow-md"
      />
    </div>

    <div className="w-1/2 p-8 flex flex-col justify-center">
      {showMessage && (
        <Alert icon={<InfoIcon fontSize="inherit" />} severity="error" sx={{mt:-8}}>
          Your account is awaiting approval.
        </Alert>
      )}
      <h6 className="text-2xl font-medium text-gray-700 text-center mb-4">
        Doctor Verification - Step 2
      </h6>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#157B7B] focus:border-[#157B7B]"
        >
          <option value="">Select Specialization</option>
          {speciality.length > 0 ? (
            speciality.map((spec:any) => (
              <option key={spec._id} value={spec._id}>{spec.name}</option>
            ))
          ) : (
            <option value="" disabled>Loading specializations...</option>
          )}
        </select>      
        
        <textarea
          name="about"
          placeholder="About"
          onChange={handleChange}
          required
          value={formData.about}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#157B7B] focus:border-[#157B7B]"
        ></textarea>
        
        <InputField type='text' name="university" placeholder="University" onChange={handleChange} value={formData.university} />
    
        <div className="space-y-4">
          {[
            { name: "imageUrl", label: "Upload Profile Image" },
            { name: "identityProofUrl", label: "Upload Identity Proof" },
            { name: "medicalCertificateUrl", label: "Upload Medical Certificate" },
          ].map(({ name, label }) => {
            const currentFile = 
              name === "imageUrl" ? imageFile :
              name === "identityProofUrl" ? identityProofFile :
              medicalCertificatFile;

            return (
              <div key={name}>
                <div 
                  className="flex items-center space-x-3 cursor-pointer" 
                  onClick={() => document.getElementById(name)?.click()}
                >
                  <input 
                    type="file" 
                    name={name} 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    id={name} 
                    onChange={(e) => handleFileChange(e, name)}  
                  />
                  <FaCloudUploadAlt className="text-[#157B7B] text-3xl" />
                  <span className="text-gray-700 font-medium">{label}</span>
                </div>
                
                {preview[name] && currentFile && (
                  <div className="flex items-center space-x-3 mt-2">
                    {currentFile.type.includes('image') ? (
                      <div className="relative">
                        <img 
                          src={preview[name]} 
                          alt={`${label} preview`} 
                          className="h-16 w-16 rounded-full object-cover border-2 border-[#157B7B]"
                        />
                        <button
                          type="button"
                          onClick={() => removePreview(name)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative bg-gray-100 p-2 rounded-full">
                        <div className="h-16 w-16 flex items-center justify-center">
                          <span className="text-xs text-center">PDF File</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePreview(name)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          className="w-full bg-[#157B7B] text-white font-semibold py-3 rounded-md shadow-md transition hover:bg-[#126666] mt-6"
        >
          Verify
          {loading && (
            <>
            <span className='ml-2 animate-pulse text-lg'>.</span>
            <span className='ml-2 animate-pulse text-lg'>.</span>
            <span className='ml-2 animate-pulse text-lg'>.</span>
            </>
          )}
        </button>
      </form>
    </div>
  </div>
</div>
  )
}

export default SectionTwo