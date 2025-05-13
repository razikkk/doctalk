import bcrypt from "bcryptjs";
import { userRepository } from "../../Repositories/implements/userRepositories";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtUtil";
import { IUser, User } from "../../Models/userModel";
import { IUserService } from "../Interface/IUserService";
import {
  ILoginTypeDTO,
  IRegisterType,
  IUserInput,
  googleUserInput,
} from "../../type/type";
import { IUserRepository } from "../../Repositories/interface/IUserRepository";
import { sendMail } from "../../utils/nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redisClient from "../../config/redisClient";
import { IDoctor } from "../../Models/doctorModel";
import { ISpeciality } from "../../Models/specialisationModel";
import { ISlot } from "../../Models/slotModel";
import { IAppointmentRepository } from "../../Repositories/interface/IAppointment";
import { IAppointment } from "../../Models/appointmentModel";
import { IPayment } from "../../Models/paymentModel";
import { IPaymentRepository } from "../../Repositories/interface/IPayment";
import payPalClient from '../../utils/paypalClient'
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN || "razik3407";

export class userService implements IUserService {
  private userRepository: IUserRepository;
  private appointmentRepository:IAppointmentRepository
  private payementRepository:IPaymentRepository
  constructor(userRepository: IUserRepository,appointmentRepository:IAppointmentRepository,payementRepository:IPaymentRepository) {
    this.userRepository = userRepository;
    this.appointmentRepository = appointmentRepository
    this.payementRepository = payementRepository
  }
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<IRegisterType> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10); // ppo hash cheythitt llyengil db kerumbo ath user adicha same pass aayittan kera so ath secure alla
    //athukond nmll bcrypt vech password hash cheyya
    //*hashing vechal nmlk kittya number or stringine vere oru fixed length ulla oru valuek matta
    //* bcrypt oru hashing cryptographic algorithm aan
    //* bcrypt combines hashing and also with salting

    const newUser: IUser = await this.userRepository.createUser({
      name,
      email,
      password: hashPassword,
      role: "user",
    }); // ppo ith db kerii adyathe value key aayittum next value aayittum keri
    return {
      message: "user registered successfully",
      user: { name, email, role: "user" },
    }; // ee message nmml controllerk ayakkum
  }

  async login(
    email: string,
    password: string,
    isAdmin: boolean = false
  ): Promise<ILoginTypeDTO> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    if (!user.password) {
      throw new Error("Please login with google");
    }

    if (isAdmin && user.role !== "admin") {
      throw new Error("Access denied. Adminss only");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }

    if (user.isBlocked) {
      await redisClient.set(`blocked:${user._id}`, "true"); // Ensure Redis is updated
      return {
        userData: user,
        accessToken: "",
        refreshToken: "",
        isBlocked: true,
      };
    } else {
      await redisClient.del(`blocked:${user._id}`); // Remove block status if unblocked
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    return { userData: user, accessToken, refreshToken, isBlocked: false };
  }

  async generateOtp(email: string, userType: "doctor" | "user"): Promise<void> {
    const otp = Math.floor(100000 * Math.random() + 900000).toString(); // 6digit
    await this.userRepository.saveOtp(email, otp);
    await sendMail(email, otp, userType);
  }
  async validateOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.userRepository.getOtp(email);
    if (storedOtp === otp) {
      await this.userRepository.deleteOtp(email);
      return true;
    }
    return false;
  }

  async verifyToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    isBlocked?: boolean;
    role?: string;
    message?: string;
  }> {
    try {
      const decoded: any = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const userId = decoded.userId;
      // console.log("tokennss",token)

      const user = await this.userRepository.findById(decoded.userId);

      if (!user) {
        return { valid: false, message: "User no longer exists" };
      }

      if (user.isBlocked) {
        await redisClient.set(`blocked:${userId}`, "true"); // Ensure Redis is updated
        return { valid: false, isBlocked: true, message: "User is blocked" };
      } else {
        await redisClient.del(`blocked:${userId}`); // Remove block status from Redis
      }

      return { valid: true, userId, role: decoded.role };
    } catch (error) {
      console.log(error, "error");
      return { valid: false, message: "Invalid Token or Expired" };
    }
  }

  async getAllUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ users: IUser[]; totalPages: number; currentPage: number }> {
    try {
      return await this.userRepository.getAllUser(search, page, limit);
    } catch (error: any) {
      console.log(error.message);
      throw new Error("failed to get users");
    }
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findUserByEmail(email);
  }
  async createUser(userData: googleUserInput): Promise<IUser> {
    const existingUser = await this.userRepository.findUserByEmail(
      userData.email
    );
    if (existingUser) {
      throw new Error("email already exists");
    }

    const newUser = new User({
      ...userData,
    });
    return await newUser.save();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await this.userRepository.getUserById(userId);
  }

  async blockUser(userId: string): Promise<void> {
    const user = await this.userRepository.updateUser(userId, {
      isBlocked: true,
    });
    await redisClient.set(`blocked:${userId}`, "true");
    if (!user) {
      throw new Error("user not found");
    }
  }

  async unblockUser(userId: string): Promise<void> {
    const user = await this.userRepository.updateUser(userId, {
      isBlocked: false,
    });
    // await redisClient.del(`unblocked:${userId}`)
    if (!user) {
      throw new Error("user not found");
    }
  }

  async findDoctor(): Promise<IDoctor[]> {
    return await this.userRepository.findDoctors();
  }

  async fetchSpecialization(): Promise<ISpeciality[]> {
    return this.userRepository.fetchSpecialization();
  }

  async fetchDoctorAppointment(): Promise<ISlot[]> {
    return this.userRepository.fetchDoctorAppointment();
  }

   async createAppointment(appointmentData: Partial<IAppointment>): Promise<IAppointment> {
       return await this.appointmentRepository.createAppointment(appointmentData)
   } 

   async getAppointmentById(appointmentId: string): Promise<IAppointment | null> {
       return await this.appointmentRepository.getAppointmentById(appointmentId)
   }
   
   async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
       return await this.payementRepository.createPayment(paymentData)
   }

   async updatePaymentWithAppointment(paymentId: string, appointmentId: string): Promise<IPayment | null> {
       return await this.payementRepository.updatePaymentWithAppointment(paymentId,appointmentId)
   }
   async decreaseAvailableSlot(slotId: string): Promise<boolean> {
       return this.appointmentRepository.decreaseAvailableSlot(slotId)
   }

   async createPaypalOrder(amount: string): Promise<string> {
       const token  = await payPalClient.getAccessToken()
       return await payPalClient.createOrder(amount,token)
   }
   async capturePaypalOrder(orderID: string): Promise<any> {
       const token = await payPalClient.getAccessToken()
       return await payPalClient.captureOrder(orderID,token)
   }
}
   
