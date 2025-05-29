import { IReviewRating } from "../../Models/RevieRating";
import { IAppointment } from "../../Models/appointmentModel";
import { IDoctor } from "../../Models/doctorModel";
import { IPayment } from "../../Models/paymentModel";
import { ISlot } from "../../Models/slotModel";
import { ISpeciality } from "../../Models/specialisationModel";
import { IUser } from "../../Models/userModel";
import {
  ILoginTypeDTO,
  IRegisterType,
  IReviewRatingInput,
  IUserInput,
  googleUserInput,
} from "../../type/type";

export interface IUserService {
  login(
    email: string,
    password: string,
    isAdmin: boolean
  ): Promise<ILoginTypeDTO>;
  register(
    name: string,
    email: string,
    password: string
  ): Promise<IRegisterType>;
  generateOtp(email: string, userType: "doctor" | "user"): Promise<void>;
  validateOtp(email: string, otp: string): Promise<boolean>;
  verifyToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    isBlocked?: boolean;
    role?: string;
    message?: string;
  }>;
  getAllUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ users: IUser[]; totalPages: number; currentPage: number }>;
  findByEmail(email: string): Promise<IUser | null>;
  createUser(userData: googleUserInput): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  // refreshToken():Promise<string>
  findDoctor(): Promise<IDoctor[]>;
  fetchSpecialization(): Promise<ISpeciality[]>;
  fetchDoctorAppointment(): Promise<ISlot[]>;
  createAppointment(
    appointmentData: Partial<IAppointment>
  ): Promise<IAppointment>;
  getAppointmentById(appointmentId: string): Promise<IAppointment | null>;
  createPayment(paymentData: Partial<IPayment>): Promise<IPayment>;
  updatePaymentWithAppointment(
    paymentId: string,
    appointmentId: string
  ): Promise<IPayment | null>;
  decreaseAvailableSlot(slotId: string): Promise<boolean>;

  //paypal
  createPaypalOrder(amount: string): Promise<string>;
  capturePaypalOrder(orderID: string): Promise<any>;
  getAllAppointment(userId: string): Promise<IAppointment[]>;
  findDoctorById(doctorId: string): Promise<IDoctor | null>;
  findDoctorBySpecialization(specializationId:string):Promise<IDoctor[]>
  postReviewAndRating(data:IReviewRatingInput):Promise<IReviewRating | null>
  fetchDoctorReview(doctorId:string):Promise<IReviewRating[]>

}
