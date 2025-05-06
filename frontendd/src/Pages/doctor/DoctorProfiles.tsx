import React, { useEffect, useState } from 'react'
import { FaFileMedical, FaIdBadge } from 'react-icons/fa';
import { GrPrevious } from 'react-icons/gr';
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { editDoctorProfile, getAllSpecialities, getDoctorProfile } from '../../utils/doctorAuth';
import { Edit } from 'lucide-react';

const DoctorProfiles = () => {
    interface ISpecialization {
        _id: string,
        name: string
    }
    interface IDoctor {
        _id: string,
        imageUrl?: string | File,
        name: string,
        specialization: ISpecialization,
        language: string,
        hospital: string,
        experience: number,
        about: string,
        medicalCertificateUrl: string | File,
        identityProofUrl: string | File,
    }

    const [showMedicalProof, setShowMedicalProof] = useState(false);
    const [showIdentityProof, setShowIdentityProof] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [doctor, setDoctor] = useState<IDoctor | null>();
    const [editForm, setEditForm] = useState<IDoctor | null>();
    const doctorId = useSelector((state: RootState) => state.doctorAuth.doctorId);
    const [specialisation,setSpecialisation] = useState([])
    const [errors,setErrors] = useState({
      name:'',
      language:'',
      hospital:'',
      experience:'',
      about:'',
      imageUrl:'',
      identityProofUrl:'',
      medicalCertificateUrl:''
    })
    const navigate = useNavigate();

    const validateName = (value:string)=>{
      if(!value) return 'Name should not be empty'
      if(!/^[A-Za-z0-9]+$/.test(value)) return 'Name should only contain alphabets and numbers'
      return ''
    }
    const validateHospital = (value:string)=>{
      if(!value) return 'Hospital name should not be empty'
      if(value.length<3) return 'Hospital name is too short'
      return ''
    }
    const validateAbout = (value:string)=>{
    if(!value) return 'About cannot be empty'
    return ''
    }
    const validateExperience = (value:number)=>{
      if(!value) return 'Please add your experience'
      if(isNaN(value)) return "Experience must be a number"
      if(value<0) return "Experience cannot be negative"
      if(value>50) return "Maximum experience is 50"
      return ''
    }

  

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            if (!doctorId) return;
            try {
                const response = await getDoctorProfile(doctorId);
                if (response && response.doctor) {
                    setDoctor(response.doctor);
                    setEditForm(response.doctor);
                }
            } catch (error: any) {
                if (error?.response.status === 403) {
                    navigate('/doctor/login');
                }
            }
        };
        fetchDoctorProfile();
    }, [doctorId]);


    useEffect(()=>{
      const fetchSpecialities = async()=>{
        try {
          const response = await getAllSpecialities()
          setSpecialisation(response.getAllSpecialities)
        } catch (error:any) {
          console.log(error.message)
        }
      }
      if(showEditModal){
        fetchSpecialities()
      }
    },[showEditModal])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      
      if (!editForm) return;
      
      if (name === 'specialization') {
        // Handle nested specialization object
        setEditForm({
          ...editForm,
          specialization: {
            ...editForm.specialization,
            name: value
          }
        });
      } else {
        // Handle regular fields
        setEditForm({
          ...editForm,
          [name]: name === 'experience' ? (parseInt(value) || 0) : value
        });
      }
    };
    

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        if(!editForm) return
        const newErrors = {
          name:validateName(editForm?.name),
          language: editForm?.language ? '' : "Please select a language",
          hospital:validateHospital(editForm?.hospital),
          experience:validateExperience(editForm?.experience),
          about:validateAbout(editForm?.about),
          imageUrl: editForm.imageUrl? '' : "Please select a profile",
          identityProofUrl:editForm.identityProofUrl ? '' : 'Please add your identityProof',
          medicalCertificateUrl:editForm.medicalCertificateUrl ? '' : "Please add your certificate"
        }
        setErrors(newErrors)
        const hasError = Object.values(newErrors).some((err)=>err!=='')
        if(hasError) return
        if(!doctorId) return 
        const formData = new FormData()
        formData.append('name',editForm.name)
        formData.append('language',editForm.language)
        formData.append('hospital',editForm.hospital)
        formData.append('experience',editForm.experience.toString())
        formData.append('about',editForm.about)
        formData.append('specialization',editForm.specialization._id)

        if(editForm.imageUrl instanceof File){
          formData.append('imageUrl',editForm.imageUrl)
        }
        if(editForm.identityProofUrl instanceof File){
          formData.append('identityProofUrl',editForm.identityProofUrl)
        }
        if(editForm.medicalCertificateUrl instanceof File){
          formData.append('medicalCertificateUrl',editForm.medicalCertificateUrl)
        }

        try {
          const response = await editDoctorProfile(doctorId ,formData)
          console.log(response,'res')
            if(response.success){
              alert("added")
              setShowEditModal(false)
            }
        } catch (error:any) {
          console.log(error.message)
        }

    };

   

    if (!doctor) return null;

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md bg-gray-20 relative">
          
            <GrPrevious onClick={() => navigate('/doctor/dashboard')} className='absolute right-[40px] text-[#157B7B] font-extrabold text-3xl cursor-pointer' />
            
            <div className="p-6 rounded-lg">
                <div className="flex items-center gap-6">
                    <img
                        src={doctor.imageUrl as string}
                        alt="Doctor"
                        className="w-28 h-28 rounded-full border-2 border-gray-300"
                    />
                    <div className="relative w-full">
                        <div className="mb-4">
                            <h1 className="text-xl font-semibold">Dr {doctor.name}</h1>
                            <p className="text-l font-semibold text-[#157B7B]">{doctor.specialization?.name}</p>
                            <p className="text-sm text-gray-500">Language : {doctor.language}</p>
                            <p className="text-sm text-gray-500">Hospital : {doctor.hospital}</p>
                            <p className="text-sm text-gray-500">Experience : {doctor.experience} years</p>
                        </div>
                        <Edit size={20} 
                            onClick={() => setShowEditModal(true)}
                            className="absolute top-5 right-14 text-[#157B7B] text-xl cursor-pointer" 
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-3">
    <button className="px-4 py-2 bg-[#157B7B] text-white rounded hover:bg-[#106565] transition" onClick={()=>navigate('/doctor/appointments')}>
      See Timings
    </button>
  </div>
            </div>
            <hr className='text-gray-200' />

            <div className="relative p-6 rounded-lg mt-6">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="text-gray-500">{doctor.about}</p>
                
            </div>
            <hr className='text-gray-200' />

            <div className="relative p-6 rounded-lg mt-6">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">No reviews</p>
                   
                </div>
            </div>
            <hr className='text-gray-200' />

            <div className="p-6 rounded-lg mt-6">
                <h2 className="text-xl font-semibold">Achievements</h2>
                <div className="mt-6 flex gap-4">
                    <button onClick={() => setShowMedicalProof(true)} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg">
                        <FaFileMedical size={20} /> Medical Proof
                    </button>
                    <button onClick={() => setShowIdentityProof(true)} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg">
                        <FaIdBadge size={20} /> Identity Proof
                    </button>
                </div>
            </div>

            {/* editMOdal */}
            {showEditModal && editForm && (
  <div className="fixed inset-0 flex backdrop-brightness-30 items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6  w-full  max-w-3xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <div className="mt-1 flex items-center">
            <div className="relative">
              {typeof editForm.imageUrl === 'string' ? (
                <img 
                  src={editForm.imageUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <span>Preview</span>
                </div>
              )}
              <input
                type="file"
                id="imageUrl"
                name="imageUrl"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEditForm({
                      ...editForm,
                      imageUrl: e.target.files[0]
                    });
                  }
                }}
                className="hidden"
              />
              {errors.imageUrl && <p className='text-red-500 text-sm'>{errors.imageUrl}</p>}
              <label 
                htmlFor="imageUrl" 
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={editForm.name}
            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
          />
          {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <select
  value={editForm.specialization._id}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      specialization: {
        ...editForm.specialization,
        _id: e.target.value,
      },
    })
  }
  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
>
  <option value="">Select Specialization</option>
  {specialisation.map((spec: any) => (
    <option key={spec._id} value={spec._id}>
      {spec.name}
    </option>
  ))}
</select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            value={editForm.language}
            onChange={(e) => setEditForm({...editForm, language: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
            >
              <option value="english">English</option>
              <option value="malayalam">Malayalam</option>
            </select>
            {errors.language && <p className='text-red-500 text-sm'>{errors.language}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hospital</label>
          <input
            type="text"
            name="hospital"
            value={editForm.hospital}
            onChange={(e) => setEditForm({...editForm, hospital: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
          />
          {errors.hospital && <p className='text-red-500 text-sm'>{errors.hospital}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={editForm.experience}
            onChange={(e) => setEditForm({...editForm, experience: parseInt(e.target.value) || 0})}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
          />
          {errors.experience && <p className='text-red-500 text-sm'>{errors.experience}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">About</label>
          <textarea
            name="about"
            value={editForm.about}
            onChange={(e) => setEditForm({...editForm, about: e.target.value})}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#157B7B] focus:outline-none focus:ring-1 focus:ring-[#157B7B]"
          />
          {errors.about && <p className='text-red-500 text-sm'>{errors.about}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical Certificate</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="medicalCertificateUrl"
              name="medicalCertificateUrl"
              accept="image/*,.pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEditForm({
                    ...editForm,
                    medicalCertificateUrl: e.target.files[0]
                  });
                }
              }}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-[#e7f3f3] file:text-[#157B7B]
                hover:file:bg-[#d5ebeb]"
            />
            {errors.medicalCertificateUrl && <p className='text-red-500 text-sm'>{errors.medicalCertificateUrl}</p>}
          </div>
          {typeof editForm.medicalCertificateUrl === 'string' && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowMedicalProof(true)}
                className="text-sm text-[#157B7B] hover:underline"
              >
                View Current Certificate
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Identity Proof</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="identityProofUrl"
              name="identityProofUrl"
              accept="image/*,.pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEditForm({
                    ...editForm,
                    identityProofUrl: e.target.files[0]
                  });
                }
              }}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-[#e7f3f3] file:text-[#157B7B]
                hover:file:bg-[#d5ebeb]"
            />
            {errors.identityProofUrl && <p className='text-red-500 text-sm'>{errors.identityProofUrl}</p>}
          </div>
          {typeof editForm.identityProofUrl === 'string' && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowIdentityProof(true)}
                className="text-sm text-[#157B7B] hover:underline"
              >
                View Current Identity Proof
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-[#157B7B] rounded-md hover:bg-[#0d5656] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}
            {/* Proof Modals */}
            {showMedicalProof && (
                <div className="fixed inset-0 flex backdrop-brightness-50 items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={doctor.medicalCertificateUrl as string} alt="Medical Proof" className="max-w-sm rounded-lg" />
                        <button onClick={() => setShowMedicalProof(false)} className="mt-2 bg-red-500 px-4 py-2 text-white rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showIdentityProof && (
                <div className="fixed inset-0 flex backdrop-brightness-50 items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={doctor.identityProofUrl as string} alt="Identity Proof" className="max-w-sm rounded-lg" />
                        <button onClick={() => setShowIdentityProof(false)} className="mt-2 bg-red-500 px-4 py-2 text-white rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfiles;