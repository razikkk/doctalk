import { Request, Response, NextFunction } from "express";
import { IDoctorService } from "../../Services/Interface/IDoctorService";
import { IDoctorController } from "../Interface/IDoctorController";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { IDoctorRepository } from "../../Repositories/interface/IDoctorRepository";
import { Types } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv'
import { googleDoctorInput, googleUserInput } from "../../type/type";
import { generateAccessToken } from "../../utils/jwtUtil";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ISlot, Slot } from "../../Models/slotModel";
dotenv.config()

const client = new OAuth2Client(process.env.CLIENT_ID)

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN || ""
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN || ""

export class DoctorController implements IDoctorController{
    private doctorService : IDoctorService
    private doctorRepository : IDoctorRepository
    constructor(doctorService:IDoctorService,doctorRepository:IDoctorRepository){
        this.doctorService = doctorService
        this.doctorRepository = doctorRepository
    }
   async register(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const {name,email,password} = req.body
            
            const result = await this.doctorService.register(name,email,password)

            console.log(result,'res')
            await this.doctorService.generateOtp(email,'doctor')
            res.status(201).json({success:true,message:"doctor registered",result})
         } catch (error:any) {
            console.log(error.message)
            res.status(500).json({success:false,message:error.message})
        }
    }

   async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const {email,otp}  = req.body
            if(!otp){
                await res.status(400).json({success:false,message:"otp is required"})
                return
            }
            const isVerified = await this.doctorService.validateOtp(email,otp)
            if(isVerified){
                 res.status(201).json({success:true,message:"otp verified"})
                 return
            }else{
                 res.status(400).json({message:"invalid otp"})
                 return
            }
        } catch (error) {
            next(error)
        }
    }

    async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const {email} = req.body
            if(!email){
                res.status(400).json({success:false,message:"email is required"})
                return
            }
            await this.doctorService.generateOtp(email,'doctor')
            res.status(200).json({success:true,message:"otp resented"})
        } catch (error:any) {
            res.status(500).json({success:false,message:error.message})
        }
    }

    async verificationSectionOne(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            console.log(req.body,'bodydd')
            const {email,registrationId,registrationYear,language,age,gender,hospital,experience} = req.body
           const Doctor = await this.doctorRepository.findDoctorByEmail(email)
           if(!Doctor){
            return res.status(404).json({message:"Doctor not found "})
           }
            const doctor = await this.doctorService.verificationSectionOne(
               email,registrationId,registrationYear,language,age,gender,hospital,experience
            )
            return res.status(201).json({success:true,message:"Step 1 Completed",doctor})
        } catch (error:any) {
            res.status(500).json({message:error.message})
        }
    }

    async verificationSectionTwo(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            console.log(req.files,'fdilee')
            const {email,specialization,about,university} = req.body

            if(!email || !specialization || !about || !university){
                res.status(400).json({message:"all fields are required"})
            }
            
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if(!files){
                return res.status(400).json({message:"No files uploaded"})
            }
            const imageUrl = files?.imageUrl?.[0]?.path || ""
            const identityProofUrl = files?.identityProofUrl?.[0]?.path || ""
            const medicalCertificateUrl = files?.medicalCertificateUrl?.[0]?.path || "";

            // console.log("Received Data:", { email, specialization, about, university });
            if(!imageUrl || !identityProofUrl || !medicalCertificateUrl){
                return res.status(400).json({message:"All images are required"})
            }
            console.log("Received Files:", { imageUrl, identityProofUrl, medicalCertificateUrl });

            const specializationId = new Types.ObjectId(specialization)
           
            const doctor = await this.doctorService.verificationSectionTwo(
            email,
            specializationId,
            imageUrl,
            about,
            identityProofUrl,
            medicalCertificateUrl,
            university
            )
           
            return res.status(201).json({success:true,message:"Step 2 Completed",doctor})
        } catch (error:any) {
            console.log(error.message)
            res.status(500).json({message:error.message})
        }
    }

    async getDoctorStatus(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const {email} = req.params
            if(!email){
                res.status(400).json({success:false,message:"email is required"})
            }
            
            const status = await this.doctorService.getDoctorStatus(email)
            if(!status){
                res.status(404).json({success:false,message:"Doctor status not found",status:status})
            }
            return res.status(200).json({success:true,message:"Doctor status retrieved successfully",status:status})
        } catch (error:any) {
            res.status(500).json({success:false,message:error.message})
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const {email,password} = req.body
            if(!email){
               return res.status(400).json({success:false,message:"email is required"})
            }
            if(!password){
               return res.status(400).json({success:false,message:"password is required"})
            }
            const {doctorData,doctorAccessToken,doctorRefreshToken} = await this.doctorService.login(email,password)
            res.cookie("doctorRefreshToken",doctorRefreshToken,{
                httpOnly:true,
                secure:false,
                sameSite:'lax',
                maxAge:7 * 24 * 60 * 60 * 1000
            })
            return res.status(201).json({success:true,message:"doctor logined successfully",doctor:doctorData,doctorAccessToken,doctorRefreshToken})
        } catch (error:any) {
           return res.status(500).json({success:false,message:error.message})
        }
    }

    async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const {idToken,actionType} = req.body
            if(!idToken){
                res.status(400).json({error:"google token is required"})
                return
            }
            const ticket = await client.verifyIdToken({
                idToken,
                audience:process.env.CLIENT_ID
            })
            const payload = ticket.getPayload()
            if(!payload){
                res.status(400).json({error:"Invalid google token"})
                return
            }
            const {email,name} = payload
            if(!email){
                res.status(400).json({error:"email is required"})
                return
            }
            let doctor = await this.doctorService.findDoctorByEmail(email)
            
            if (doctor?.isActive === 'rejected') {
                res.status(400).json({success:false,message:"'Your application has been rejected. Please contact support.'"})
                return
            }

            // Check if doctor is pending
            if (doctor?.isActive === 'pending') {
                res.status(400).json({success:false,message:'Your application is still under review.'})
                return
            }
        
            if(doctor && doctor.isBlocked === true){
                res.status(400).json({success:false,message:"Your accound is blocked. Please contact support"})
                return
            }
            if(!doctor){
                let doctorData:googleUserInput
                if(actionType === 'login'){
                    res.status(404).json({success:false,message:"Doctor not found"})
                return
                }else if(actionType === 'register'){

                
                 doctorData={
                    name:name || "unknow user",
                    email:email || "no email",
                    role:'doctor',
                    isBlocked:false
                }
                doctor = await this.doctorService.createDoctor(doctorData)
            }
            }
            if (!doctor || !doctor._id) {
                throw new Error("Doctor creation failed or invalid _id");
              }
            const token =  generateAccessToken(doctor?._id.toString(),doctor.role)
            console.log(token,'google')
            res.status(200).json({success:true,message:"doctor created",token,doctor})

        } catch (error) {
            next(error)
        }
    }
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const refreshToken = req.cookies.doctorRefreshToken
            console.log("refresh",refreshToken)
            if(!refreshToken){
                res.status(404).json({success:false,message:"Token not found"})
            }
            const decoded = jwt.verify(refreshToken,REFRESH_TOKEN_SECRET) as JwtPayload
            const {userId,role} = decoded

            const newDoctorAccessToken = jwt.sign({userId,role},ACCESS_TOKEN_SECRET,{expiresIn:'5d'})

            console.log("kaznj")
            return res.status(200).json({success:true,doctorAccessToken:newDoctorAccessToken})
             
        } catch (error:any) {
            console.log(error.message)
        }
    }
    async getDoctorProfile(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const {doctorId} = req.params
            console.log('ddsggsd',doctorId)
            if(!doctorId){
                res.status(400).json({success:false,message:"Doctor id is required"})
                return
            }
            const doctor = await this.doctorService.getDoctorProfile(doctorId)
            if(!doctor){
                res.status(404).json({success:false,message:"Doctor not found"})
                return
            }
            
            res.status(200).json({success:true,message:"Doctor profile fetchedd",doctor})
            return
        } catch (error:any) {
            console.log(error.message)
            res.status(500).json({success:false,message:error.message})
            return
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            res.clearCookie("doctorAccessToken")
            res.clearCookie("doctorRefreshToken",{
                httpOnly:true,
                secure:false,
                sameSite:'lax',
                path:'/'
            })
            res.status(200).json({success:true,message:"logout successfully"})
            return
        } catch (error) {
            
        }
    }

    async addSlot(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const data = req.body
            console.log(req.body,'body')
            const slot = await this.doctorService.addSlots(data)
            return res.status(201).json({success:true,message:"Slot created",slot})
        } catch (error:any) {
            console.log(error.message)
            return res.status(500).json({success:false,message:error.message})
        }
    }

    async editDoctorProfile(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const {doctorId} = req.params
            const doctorData:any = {
                name:req.body.name,
                language:req.body.language,
                hospital: req.body.hospital,
                experience: req.body.experience,
                about: req.body.about,
                specialization: req.body.specialization,
                gender: req.body.gender,
            }
            const files = req.files as {
                [fieldname:string]:Express.Multer.File[]
            }
            console.log(files,'files')
            if(files?.imageUrl?.[0]){
                doctorData.imageUrl = files.imageUrl[0].path
            }
            if (files?.identityProofUrl?.[0]) {
                doctorData.identityProofUrl = files.identityProofUrl[0].path;
              }
              if (files?.medicalCertificateUrl?.[0]) {
                doctorData.medicalCertificateUrl = files.medicalCertificateUrl[0].path;
              }
            // console.log(req.body,'boo')
            // console.log(doctorId,'ddddd')
            if(!doctorId){
                res.status(401).json({success:false,message:"doctorId is required"})
                return 
            }
            
            if(!doctorData){
                res.status(401).json({success:false,message:"doctor Data is required"})
                return
            }
            const updatedProfile = await this.doctorService.editDoctorProfile(doctorId,doctorData)
            console.log(updatedProfile,'update')
            res.status(200).json({success:true,message:"Doctor profile updated successfully",updatedProfile})
            return 
        } catch (error:any) {
            console.log(error.message)
            res.status(500).json({success:false,message:error.message})
        }
    }
    async getAllSpecialities(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const getAllSpecialities = await this.doctorService.getAllSpecialities()
            return res.status(200).json({success:true,message:"fetched specialities",getAllSpecialities})
        } catch (error:any) {
            console.log(error.message)
            return res.status(500).json({success:false,message:error.message})
        }
    }

    async fetchDoctorAppointment(req:Request,res:Response,next:NextFunction): Promise<void | Response> {
        try {
            const {doctorId} = req.query
            const slotData = await this.doctorService.fetchDoctorAppointment(doctorId as string)
            if(!doctorId){
                return res.status(400).json({success:false,message:"doctorId is required"})
            }
            if(!slotData){
                return res.status(400).json({success:false,message:"slot data is required"})
            }
            return res.status(200).json({success:true,message:"slot data fetched successfullu",slotData})
        } catch (error:any) {
            console.log(error.message)
            res.status(500).json({success:false,message:error.message})
        }
    }
    
}