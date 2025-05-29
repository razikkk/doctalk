import { NextFunction, Request, Response, json } from "express";
import { userService } from "../../Services/Implements/userServices";
import { IUserController } from "../Interface/IUserController";
import { IUserService } from "../../Services/Interface/IUserService";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { generateAccessToken } from "../../utils/jwtUtil";
import { IUser } from "../../Models/userModel";
import { IUserInput, googleUserInput } from "../../type/type";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IAdminService } from "../../Services/Interface/IAdminService";
import { appointmentSuccessEmail } from "../../utils/appointmentEmailTemplate";
import { transporter } from "../../utils/nodemailer";
import { IReviewRating } from "../../Models/RevieRating";
dotenv.config();

const client = new OAuth2Client(process.env.CLIENT_ID);
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN || "";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN || "";
interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export class UserController implements IUserController {
  private userService: IUserService;
  private adminService: IAdminService;
  constructor(userService: IUserService, adminService: IAdminService) {
    this.userService = userService;
    this.adminService = adminService;
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // console.log(req.body)
      const { name, email, password } = req.body;
      const result = await this.userService.register(name, email, password); // ith ppo nmll servicil vannathaan aa messagum newUserum

      await this.userService.generateOtp(email, "user");

      res
        .status(201)
        .json({ success: true, message: "user registered", result }); // send email to frontend so frontend know which  email is verifying otp
    } catch (error: any) {
      if (error.message === "User already exists") {
        res.status(400).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      if (!otp) {
        res.status(400).json({ success: false, message: "otp is required" });
        return;
      }
      const isVerified = await this.userService.validateOtp(email, otp);

      if (isVerified) {
        res
          .status(201)
          .json({ success: true, message: "Otp verified successfullly" });
        return;
      } else {
        res.status(400).json({ success: false, message: "invalid Otp" });
        return;
      }
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ success: false, message: "email is required" });
        return;
      }
      await this.userService.generateOtp(email, "user");
      res.status(200).json({ success: true, message: "otp sented" });
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { idToken } = req.body; // this token is from frontend the googleIDtoken . its a proof
      if (!idToken) {
        res.status(400).json({ error: "google token is required" });
        return;
      }
      const ticket = await client.verifyIdToken({
        //google oauth2 client aan ee varialble(client). ath google api library ulaltha
        //verifyIDToken thann token valid aano allen check cheyyan
        idToken,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload(); //If the token is valid, we get the user’s Google profile info inside payload (like name, email, etc).

      if (!payload) {
        res.status(400).json({ error: "Invalid google token" });
        return;
      }

      const { email, name } = payload; // aa informationsn emailum name edkum
      if (!email) {
        res.status(400).json({ error: "email is required" });
        return;
      }

      let user = await this.userService.findByEmail(email);
      if (user && user.isBlocked == true) {
        res.status(400).json({
          success: false,
          message: "you are blocked. please contact support",
        });
        return;
      }
      if (!user) {
        const userData: googleUserInput = {
          name: name || "unknown User",
          email,
          role: "user",
          isBlocked: false,
        };
        user = await this.userService.createUser(userData);
      }
      const token = await generateAccessToken(user._id.toString(), user.role);
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      console.log(user, "back");
      res.status(200).json({ message: "success", token, user });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { userData, accessToken, refreshToken, isBlocked } =
        await this.userService.login(email, password, false);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //cant access with js(means no hackers can access the token)
        secure: false, //true aanel https only
        sameSite: "lax", //CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      });

      res.status(201).json({
        success: true,
        message: "user logined",
        user: userData,
        accessToken,
        refreshToken,
        isBlocked,
      });
      console.log(refreshToken);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        console.log("nonoo");
        res.status(404).json({ success: false, message: "No token" });
        return;
      }
      const decoded = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET
      ) as JwtPayload;
      console.log(decoded);
      const { userId, role } = decoded;
      console.log(userId, role);
      const newAccessToken = jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, {
        expiresIn: "3d",
      });
      console.log(newAccessToken, "aa");
      return res
        .status(200)
        .json({ success: true, accessToken: newAccessToken });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  /**
   * for description
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async findDoctors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const doctor = await this.userService.findDoctor();
      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "doctors not fetched" });
      }
      return res.status(200).json({
        success: true,
        message: "doctor fetched successfully",
        doctor,
      });
    } catch (error: any) {
      next(error.message);
    }
  }

  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      res.clearCookie("accessToken");
      console.log("clerared");
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      console.log("done");

      res.status(200).json({ success: true, message: "Logout successfull" });
      return;
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async fetchSpecialization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const specializationData = await this.userService.fetchSpecialization();
      if (!specializationData) {
        return res
          .status(400)
          .json({ success: false, message: "specialization data is required" });
      }
      console.log(specializationData, "spec");
      return res
        .status(200)
        .json({
          success: true,
          message: "Specialization fetched",
          specializationData,
        });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async fetchDoctorAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const appointmentData = await this.userService.fetchDoctorAppointment();
      if (!appointmentData) {
        return res
          .status(400)
          .json({ success: false, messsage: "can't fetch appointment data" });
      }
      console.log(appointmentData, "data");
      return res
        .status(200)
        .json({
          success: true,
          message: "Fetched appointment data",
          appointmentData,
        });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async bookAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { userId, doctorId, slotId, tokenNumber, amount } = req.body;
      const availableSlots = await this.userService.decreaseAvailableSlot(
        slotId
      );
      if (!availableSlots) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Sorry for the inconvinience,No available slots",
          });
      }

      const payment = await this.userService.createPayment({
        userId,
        doctorId,
        amount,
        status: "paid",
      });

      const appointment = await this.userService.createAppointment({
        userId,
        doctorId,
        slotId,
        tokenNumber,
        paymentId: payment._id,
        status: "scheduled",
      });

      await this.userService.updatePaymentWithAppointment(
        payment._id.toString(),
        appointment._id.toString()
      );

      const user = await this.userService.getUserById(userId);
      console.log(user, "usertalk");
      const doctor = await this.adminService.getDoctorById(doctorId);
      if (!user?.email || !doctor?.email) {
        console.log("Missing email", {
          userEmail: user?.email,
          doctorEmail: doctor?.email,
        });
        return res
          .status(500)
          .json({ success: false, message: "Missing user or doctor email" });
      }

      const { user: userEmail, doctor: doctorEmail } = appointmentSuccessEmail(
        user?.name || "user",
        doctor?.name || "doctor"
      );

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user?.email,
        subject: userEmail.subject,
        text: userEmail.text,
      });
      console.log("done email");

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: doctor?.email,
        subject: doctorEmail.subject,
        text: doctorEmail.text,
      });

      return res
        .status(201)
        .json({ success: true, message: "appointment created", appointment });
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { amount } = req.body;
      const orderID = await this.userService.createPaypalOrder(amount);
      res.status(200).json({ success: true, orderID });
      return;
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async captureOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { orderID } = req.body;

      // Try to capture the order
      const result = await this.userService.capturePaypalOrder(orderID);
      console.log("Capture success:", result);

      res.status(200).json({ success: true, result });
      return;
    } catch (error: any) {
      // Better error handling for PayPal errors
      console.log(
        "Capture error:",
        error.response?.data || error.message || error
      );

      // If it's a PayPal API error with specific details
      if (error.response?.data?.name === "UNPROCESSABLE_ENTITY") {
        const paypalError = error.response.data;
        const issue = paypalError.details?.[0]?.issue;

        // Find redirect link if available
        const redirectLink = paypalError.links?.find(
          (link: PayPalLink) => link.rel === "redirect"
        )?.href;

        return res.status(400).json({
          success: false,
          paypalError: true,
          issue: issue,
          message: paypalError.details?.[0]?.description || paypalError.message,
          redirectUrl: redirectLink,
          debug_id: paypalError.debug_id,
        });
      }

      // General error
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred during payment capture",
      });
      return;
    }
  }

  async getAllAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { userId } = req.params;
      const result = await this.userService.getAllAppointment(userId);
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "userId is required" });
      }
      return res
        .status(200)
        .json({ success: true, message: "appointment fetched", result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.mesage });
    }
  }

  async findDoctorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { doctorId } = req.params;
      if (!doctorId) {
        return res
          .status(400)
          .json({ success: false, message: "doctorId is required" });
      }
      const result = await this.userService.findDoctorById(doctorId);
      return res
        .status(200)
        .json({ success: true, message: "fetched doctor profile", result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async findDoctorBySpecialization(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const {specializationId} = req.params
      const result = await this.userService.findDoctorBySpecialization(specializationId)
      return res.status(200).json({success:true,message:"Fetched doctors by specialization",result})
    } catch (error:any) {
      return res.status(500).json({success:false,message:error.message})
    }
  }

  async postReviewAndRating(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const {userId,doctorId,rating,review} = req.body
      if(!userId || !doctorId || !rating || !review){
        return res.status(400).json({success:false,message:"all fields are required"})
      }
      const savedReview = await this.userService.postReviewAndRating({userId,doctorId,rating,review})
      return res.status(200).json({success:true,message:"review saved successfully",savedReview})
    } catch (error:any) {
      console.log(error.message)
      return res.status(500).json({success:false,message:error.message})
    }
  }

  async fetchDoctorReview(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const {doctorId} = req.params
      const result = await this.userService.fetchDoctorReview(doctorId)
      return res.status(200).json({success:true,message:"review fetched",result})
    } catch (error:any) {
      console.log(error.message)
      return res.status(500).json({success:false,message:error.message})
    }
  }
}
