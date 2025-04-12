import React, { useEffect, useState } from 'react'
import { verificationSectionOne } from '../../utils/doctorAuth'
import { Toaster,toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import InputField from '../../Components/InputField'
import doctor from '../../assets/doctor.jpeg'
import { SelectField } from '../../Components/SelectField'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { updateFormData } from '../../Redux/doctorFormSlice'
import { RootState } from '../../Redux/store'

const SectionOne = () => {
    const navigate = useNavigate()
    const formData = useSelector((state:RootState)=>state.doctorForm)
    const [errors,setErrors] = useState({
      registrationId:'',
      registrationYear:'',
      age:'',
      hospital:'',
      experience:''
    })

    const validateRegistrationId = (value:string)=>{
      const regex = /^[A-Za-z0-9]+$/
      if(!value) return 'Registration Id is required'
      if(!regex.test(value)) return 'Only numbers and alphabets are allowed'
      return ''
    }

    const validateRegistrationYear = (value:string)=>{
      const currentYear  = new Date().getFullYear()
      if(!value) return "Registration Year is required"
      if(!/^\d{4}$/.test(value)) return "Year must be 4 digits"
      if(parseInt(value)<1900) return "Year must be after 1900"
      if(parseInt(value)>currentYear) return "Year cannot be in the future"
      return ''
    }

    const validateAge = (value:string)=>{
      if(!value) return "Age is required"
      if(!/^\d+$/.test(value)) return "Age must be a number"
      const ageNum = parseInt(value)
      if(ageNum<23) return "Age should be atleast 23"
      if(ageNum>80) return "Maximum age si 80"
      return ''
    }

    const validateHospital = (value:string)=>{
      if(!value) return "Hospital name is required"
      if(value.length<3) return "Hospital name is too short"
      return ''
    }

    const validateExperience = (value:string,age?:string)=>{
      if(!value) return "Experience is required"
      if(!/^\d+$/.test(value)) return "Experience must be a number"
      const expNum = parseInt(value)
      if(expNum<0) return "Experience cannot be negative"
      if(expNum>50) return "Maximum experience is 50"
      
      if(age){
        const ageNum = parseInt(age)
        if(expNum>=ageNum) return "Experience cannot be equal or greater than age"
        if(ageNum-expNum<23) return "Doctor must be atleast 23 years old when starting practice"
      }
      return ''
     }
    const dispatch = useDispatch()

    const handleFormChange = async(e:any)=>{
        const {name,value} = e.target
        dispatch(updateFormData({[name]:value}))

        let error:string | undefined = ''
        switch(name){
          case 'registrationId':
            error = validateRegistrationId(value)
            break
          case 'registrationYear':
            error = validateRegistrationYear(value)
            break
          case 'age':
            error = validateAge(value)
            if (formData.experience) {
              setErrors(prev => ({
                  ...prev,
                  experience: validateExperience(formData.experience, value)
              }))
          }
          break
          case 'hospital':
            error = validateHospital(value)
            break
          case 'experience':
            error = validateExperience(value,formData.age)
            break
        }
        setErrors((prev)=>({
          ...prev,
          [name]:error
        }))

    }

    const validateForm = ()=>{
      const newErrors = {
        registrationId: validateRegistrationId(formData.registrationId || ''),
        registrationYear: validateRegistrationYear(formData.registrationYear || ''),
        age: validateAge(formData.age || ''),
        hospital: validateHospital(formData.hospital || ''),
        experience: validateExperience(formData.experience || '')

      }
      setErrors(newErrors)
      return !Object.values(newErrors).some(error=>error!=='')
    }
  

    const handleSubmit = async (e:any)=>{
        e.preventDefault()
        if(!validateForm()){
          toast.error("please fix the errors in the form")
          return
        }
        const storedDoctor = JSON.parse(localStorage.getItem('doctor') || '{}')
        
        if(!storedDoctor || !storedDoctor.email){
            toast.error("doctor details missing. Please signup again")
            console.log('stored',storedDoctor)
            return
        }

        const doctorData = {
            email:storedDoctor.email,
            name: storedDoctor.name,
            password: storedDoctor.password,
            ...formData
        }

        const response = await verificationSectionOne(doctorData)
console.log(response)
        if(response.success){
            toast.success("Step One Completed")  
            setTimeout(() => navigate('/doctor/verification/step2'), 1000);  
        }else{
            toast.error(response.message)
        }
    }

  return(
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
    <Toaster />
  
    <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-[900px] max-w-4xl h-auto md:h-[650px]">
      
      <div className="w-1/2 flex items-center justify-center p-6">
        <img
          src={doctor}
          alt="Doctor Verification"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
  
      
      <div className="w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Doctor Verification
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField name="registrationId" placeholder="Registration ID" onChange={handleFormChange} value={formData.registrationId || ""} error={errors.registrationId} />
          <InputField name="registrationYear" placeholder="Registration Year" onChange={handleFormChange} value={formData.registrationYear || ""}  error={errors.registrationYear} />
          <SelectField name="language" onChange={handleFormChange} options={["English", "Malayalam"]} value={formData.language || "english"}   />
          <InputField name="age" placeholder="Age" type="number" onChange={handleFormChange} value={formData.age || ""}  error={errors.age} />
          <SelectField name="gender" onChange={handleFormChange} options={["Male", "Female"]} value={formData.gender || "male"}   />
          <InputField name="hospital" placeholder="Hospital Name" onChange={handleFormChange} value={formData.hospital || ""}  error={errors.hospital} />
          <InputField name="experience" placeholder="Experience (years)" type="number" onChange={handleFormChange} value={formData.experience || ""}  error={errors.experience} />
  
          <button
            type="submit"
            className="w-full bg-[#157B7B] text-white font-semibold py-3 rounded-md shadow-md transition hover:bg-[#126666]"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  </div>
  
);
}



  


export default SectionOne