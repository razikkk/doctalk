import { IDoctor } from "../../Models/doctorModel";
import { ISlot } from "../../Models/slotModel";
import { ISpeciality } from "../../Models/specialisationModel";
import { IUser } from "../../Models/userModel";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  findById(userId: string): Promise<IUser | null>;

  //otp
  saveOtp(email: string, otp: string): Promise<void>;
  getOtp(email: string): Promise<string | null>;
  deleteOtp(email: string): Promise<void>;

  //user
  getAllUser(
    search: string,
    page: number,
    limit: number
  ): Promise<{ users: IUser[]; totalPages: number; currentPage: number }>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;

  //fetch doctor
  findDoctors(): Promise<IDoctor[]>;
  fetchSpecialization(): Promise<ISpeciality[]>;
  fetchDoctorAppointment(): Promise<ISlot[]>;
  findDoctorById(doctorId: string): Promise<IDoctor | null>;
  findDoctorBySpecialization(specializationId:string):Promise<IDoctor[]>
}
