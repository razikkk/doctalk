import { IDoctor } from "../Models/doctorModel";
import { IUser } from "../Models/userModel"
import {  ObjectId } from "mongoose";



export type UserType = {
    _id?: ObjectId;
    name: string;
    email: string;
    password?: string;
    role: "admin" | "user";
    imageUrl?: string;
    age?: number;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
    gender?: "male" | "female";
    phoneNumber?: string;
    addressId?: string;
    walletId?: string;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };

export type ILoginTypeDTO={
    accessToken:string,
    refreshToken:string,
    userData: IUser,
    isBlocked:boolean
}

export type IDoctorLoginType={
    doctorAccessToken:string,
    doctorRefreshToken:string,
    doctorData : IDoctor,
    
}

export type IRegisterType={
    message:string,
    user:UserType
}

export type IUserInput = {
    name:string,
    email:string,
    password:string,
    role:"admin" | "user"
    otp:string,
    isBlocked:boolean
}

export type googleUserInput = {
    name:string,
    email:string,
    role:"admin" | "user" | "doctor"
    isBlocked:boolean
}

export type googleDoctorInput = {
    name:string,
    email:string,
    role:'doctor',
    isBlocked:false,
    isActive:'pending' | 'approved' | 'rejected',
    registrationId:string,
    registrationYear:number,
    language:'english' | 'malayalam',
    hospital:string,
    age:number,
    gender:'male' | 'female',
    experience:number,
    specialization?:ObjectId,
    about:string,
    identityProofUrl:string,
    medicalCertificateUrl:string,
    imageUrl:string
    university:string,
    reviewId?:ObjectId[],
    walletId?:ObjectId,
    createdAt:Date,
    updatedAt:Date,
}

export type IDoctorType = {
    _id:ObjectId,
    name:string,
    email:string,
    password?:string,
    registrationId:string,
    registrationYear:number,
    language:'english' | 'malayalam',
    hospital:string,
    age:number,
    gender:'male' | 'female',
    experience:number,
    specialization?:ObjectId,
    about:string,
    identityProofUrl:string,
    medicalCertificateUrl:string,
    university:string,
    reviewId?:ObjectId[],
    walletId?:ObjectId
    role:'doctor',
    otp:string,
    otpExpires:Date
    isActive:'pending' | 'approved' | 'rejected',
    isBlocked:boolean,
    createdAt:Date,
    updatedAt:Date,
}

export type IDoctorRegisterType = {
    message:string,
    doctor:IDoctorType
}