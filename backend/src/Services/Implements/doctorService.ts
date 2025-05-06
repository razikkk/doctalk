import { JWTAccess } from "google-auth-library";
import { Doctor, IDoctor } from "../../Models/doctorModel";
import { IAdmin } from "../../Repositories/interface/IAdminRepository";
import { IDoctorRepository } from "../../Repositories/interface/IDoctorRepository";
import { IUserRepository } from "../../Repositories/interface/IUserRepository";
import { IDoctorLoginType, IDoctorRegisterType, IRegisterType, googleUserInput } from "../../type/type";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtUtil";
import { sendMail } from "../../utils/nodemailer";
import { IDoctorService } from "../Interface/IDoctorService";
import bcrypt from 'bcryptjs'
import { Types } from "mongoose";
import jwt from 'jsonwebtoken'
import { ISlot, Slot } from "../../Models/slotModel";
import { ISpeciality } from "../../Models/specialisationModel";

export class DoctorService implements IDoctorService{
    private doctorRepository:IDoctorRepository
    private userRepository: IUserRepository
    private adminRepository: IAdmin
    constructor(doctorRepository:IDoctorRepository,userRepository:IUserRepository,adminRepository:IAdmin){
        this.doctorRepository = doctorRepository
        this.userRepository = userRepository
        this.adminRepository = adminRepository
    }

    async register(name: string, email: string, password: string): Promise<IDoctorRegisterType> {
       
            const existingDoctor = await this.doctorRepository.findDoctorByEmail(email)
            const existingUser = await this.userRepository.findUserByEmail(email)
            if(existingDoctor || existingUser){
                    throw new Error("email already exists")
            }
            
            const hashPassword = await bcrypt.hash(password,10)
            console.log("passhashed",hashPassword)
            const newDoctor : IDoctor = await this.doctorRepository.createDoctor({
                name,
                email,
                password:hashPassword,
                role:'doctor'
            })
            return {message:"doctor registered",doctor:newDoctor}
    }

    async generateOtp(email: string): Promise<void> {
        const otp = Math.floor(100000 * Math.random() + 900000).toString()
        await this.userRepository.saveOtp(email,otp)
        await sendMail(email,otp,'doctor')
    }

    async validateOtp(email: string, otp: string): Promise<boolean> {
        const storedOtp = await this.userRepository.getOtp(email)
        if(storedOtp == otp){
            await this.userRepository.deleteOtp(email)
            return true
        }
        return false
    }

    async verificationSectionOne(email:string,registrationId: string, registrationYear: number, language: "english" | "malayalam", age: number, gender: "male" | "female", hospital: string, experience: number): Promise<IDoctor | null> {
       const doctor = await this.doctorRepository.findDoctorByEmail(email)
       if(!doctor){
        throw new Error("Doctor not found")
       }

       doctor.registrationId = registrationId
       doctor.registrationYear = registrationYear
       doctor.language = language
       doctor.age  = age
       doctor.gender = gender
       doctor.hospital = hospital
       doctor.experience = experience
       doctor.step = 1

       return await doctor.save()
    }

    async verificationSectionTwo(email: string, specializationId: Types.ObjectId, imageUrl: string, about: string, identityProofUrl: string, medicalCertificateUrl: string, university: string): Promise<IDoctor | null> {
    
        const doctor  = await this.doctorRepository.findDoctorByEmail(email)
        const speciality = await this.adminRepository.getSpecialisationById(specializationId)

        if(!doctor){
            throw new Error("Doctor not found")
        }

        if(!speciality){
            throw new Error("speciality not found")
        }
        doctor.specialization = speciality._id,
        doctor.imageUrl = imageUrl,
        doctor.about = about,
        doctor.identityProofUrl = identityProofUrl,
        doctor.medicalCertificateUrl = medicalCertificateUrl,
        doctor.university = university
        doctor.step = 2
        return await doctor.save()
}

async getDoctorStatus(email: string): Promise<"pending" | "approved" | "rejected" | undefined> {
    try {
        if(!email){
            throw new Error("email is required")
        }
        const doctor = await this.doctorRepository.findDoctorByEmail(email)
        if(!doctor){
            throw new Error("Doctor not found")
        }
        return doctor.isActive as "pending" | "approved" | "rejected" | undefined
    } catch (error:any) {
        console.log(error.message)
    }
    
}

async login(email: string, password: string): Promise<IDoctorLoginType> {
    const doctor = await this.doctorRepository.findDoctorByEmail(email)
    if(!doctor){
        throw new Error("Invalid credentials")
    }
    
    if (doctor.isActive === 'rejected') {
        throw new Error('Your application has been rejected. Please contact support.' )
    }

    if (doctor.isActive === 'pending') {
       throw new Error('Your application is still under review.')
    }

    if(doctor.isBlocked){
        throw new Error("You are blocked..")
    }

    if(!doctor.password){
        throw new Error("No password for this doctor")
    }
    if(doctor.role !== 'doctor'){
        throw new Error("Access denied..")
    }
    const isMatch = await bcrypt.compare(password,doctor.password)
    if(!isMatch){
        throw new Error("Invalid Credentials")
    }

    const doctorAccessToken = generateAccessToken(doctor._id.toString(),doctor.role)
    console.log(jwt.decode(doctorAccessToken))
    const doctorRefreshToken = generateRefreshToken(doctor._id.toString(),doctor.role)
    return {doctorData:doctor,doctorAccessToken,doctorRefreshToken}
}

async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    return await this.doctorRepository.findDoctorByEmail(email)
}

async createDoctor(doctorData: googleUserInput): Promise<IDoctor> {
    const existingDoctor = await this.userRepository.findUserByEmail(doctorData.email)
    if(existingDoctor){
        throw new Error("email already exists")
    }
    const newDoctor = new Doctor({
        ...doctorData
    })
    return await newDoctor.save()

}

async getDoctorProfile(doctorId: string): Promise<IDoctor | null> {
    const doctor = await this.doctorRepository.getDoctorProfile(doctorId)
    if(!doctor){
        throw new Error("Doctor not found")
    }
    return doctor
}
    async addSlots(slotData: ISlot): Promise<ISlot> {
        return await this.doctorRepository.addSlots(slotData)
    }

    async editDoctorProfile(doctorId: string, doctorData: Partial<IDoctor>): Promise<IDoctor | null> {
        return await this.doctorRepository.editDoctorProfile(doctorId,doctorData)
    }
    async getAllSpecialities(): Promise<ISpeciality[]> {
        return await this.doctorRepository.getAllSpecialities()
    }
    async fetchDoctorAppointment(doctorId:string): Promise<ISlot[]> {
        return this.doctorRepository.fetchDoctorAppointment(doctorId)
    }

    
}