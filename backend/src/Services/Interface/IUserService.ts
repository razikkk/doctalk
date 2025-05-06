import { IDoctor } from "../../Models/doctorModel";
import { ISpeciality } from "../../Models/specialisationModel";
import { IUser } from "../../Models/userModel";
import {
  ILoginType,
  IRegisterType,
  IUserInput,
  googleUserInput,
} from "../../type/type";

export interface IUserService {
  login(email: string, password: string, isAdmin: boolean): Promise<ILoginType>;
  register(
    name: string,
    email: string,
    password: string
  ): Promise<IRegisterType>;
  generateOtp(email: string, userType: "doctor" | "user"): Promise<void>;
  validateOtp(email: string, otp: string): Promise<boolean>;
  verifyToken(
    token: string
  ): Promise<{
    valid: boolean;
    userId?: string;
    isBlocked?: boolean;
    role?: string;
    message?: string;
  }>;
  getAllUsers(search:string,page:number,limit:number): Promise<{users:IUser[];totalPages:number;currentPage:number}>;
  findByEmail(email: string): Promise<IUser | null>;
  createUser(userData: googleUserInput): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  // refreshToken():Promise<string>
  findDoctor(): Promise<IDoctor[]>;
  fetchSpecialization():Promise<ISpeciality[]>
}
