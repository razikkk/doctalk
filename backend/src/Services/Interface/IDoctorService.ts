import { ObjectId, Types } from "mongoose";
import { IDoctor } from "../../Models/doctorModel";
import {
  IDoctorLoginType,
  IDoctorRegisterType,
  IRegisterType,
  googleUserInput,
} from "../../type/type";
import { ISlot } from "../../Models/slotModel";
import { ISpeciality } from "../../Models/specialisationModel";

export interface IDoctorService {
  register(
    name: string,
    email: string,
    password: string
  ): Promise<IDoctorRegisterType>;
  generateOtp(email: string, userType: "doctor" | "user"): Promise<void>;
  validateOtp(email: string, otp: string): Promise<boolean>;
  verificationSectionOne(
    email: string,
    registrationId: string,
    registrationYear: number,
    language: "english" | "malayalam",
    age: number,
    gender: "male" | "female",
    hospital: string,
    experience: number
  ): Promise<IDoctor | null>;
  verificationSectionTwo(
    email: string,
    specialization: Types.ObjectId,
    imageUrl: string,
    about: string,
    identityProofUrl: string,
    medicalCertificateUrl: string,
    university: string
  ): Promise<IDoctor | null>;
  getDoctorStatus(
    email: string
  ): Promise<"approved" | "rejected" | "pending" | undefined>;
  login(email: string, password: string): Promise<IDoctorLoginType>;
  findDoctorByEmail(email:string):Promise<IDoctor | null>
  createDoctor(doctorData:googleUserInput):Promise<IDoctor>
  getDoctorProfile(doctorId:string):Promise<IDoctor | null>
  addSlots(slotData:ISlot):Promise<ISlot>
  editDoctorProfile(doctorId:string,doctorData:Partial<IDoctor>):Promise<IDoctor | null>
  getAllSpecialities(): Promise<ISpeciality[]>;
  fetchDoctorAppointment(doctorId:string):Promise<ISlot[]>
}
