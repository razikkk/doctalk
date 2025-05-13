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
import  jwt, { JwtPayload }  from "jsonwebtoken";
dotenv.config();

const client = new OAuth2Client(process.env.CLIENT_ID);
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN || ""
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN || ""

export class UserController implements IUserController {
  private userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
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
      const ticket = await client.verifyIdToken({ //google oauth2 client aan ee varialble(client). ath google api library ulaltha
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
        res
          .status(400)
          .json({
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

      res
        .status(201)
        .json({
          success: true,
          message: "user logined",
          user: userData,
          accessToken,
          refreshToken,
          isBlocked,
        });
        console.log(refreshToken)
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
      if(!refreshToken){
        console.log("nonoo")
        res.status(404).json({success:false,message:"No token"})
        return
      }
      const decoded = jwt.verify(refreshToken,REFRESH_TOKEN_SECRET) as JwtPayload
      console.log(decoded)
      const {userId,role} = decoded
      console.log(userId,role)
      const newAccessToken = jwt.sign({userId,role},ACCESS_TOKEN_SECRET,{expiresIn:"3d"})
      console.log(newAccessToken,'aa')
      return res.status(200).json({success:true,accessToken:newAccessToken})


    } catch (error:any) {
      console.log(error.message)
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
      return res
        .status(200)
        .json({
          success: true,
          message: "doctor fetched successfully",
          doctor,
        });
    } catch (error: any) {
      next(error.message);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      res.clearCookie("accessToken")
      console.log("clerared")
      res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
       path:'/'
      })
      console.log("done")
      
       res.status(200).json({success:true,message:"Logout successfull"})
      return
    } catch (error:any) {
      res.status(500).json({success:false,message:error.message})
    }
  }

  async fetchSpecialization(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const specializationData = await this.userService.fetchSpecialization()
      if(!specializationData){
        return res.status(400).json({success:false,message:"specialization data is required"})
      }
      console.log(specializationData,'spec')
      return res.status(200).json({success:true,message:"Specialization fetched",specializationData})
    } catch (error:any) {
      return res.status(500).json({success:false,message:error.message})
    }
  }

  async fetchDoctorAppointment(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const appointmentData = await this.userService.fetchDoctorAppointment()
      if(!appointmentData){
        return res.status(400).json({success:false,messsage:"can't fetch appointment data"})
      }
      console.log(appointmentData,'data')
      return res.status(200).json({success:true,message:"Fetched appointment data",appointmentData})
    } catch (error:any) {
      return res.status(500).json({success:false,message:error.message})
    }
  }

  async bookAppointment(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const {userId,doctorId,slotId,tokenNumber,amount} = req.body
      const availableSlots = await this.userService.decreaseAvailableSlot(slotId)
      if(!availableSlots){
        return res.status(400).json({success:false,message:"No available slots"})
      }

    const payment = await this.userService.createPayment({
      userId,
      doctorId,
      amount,
      status:'paid'
    })

    const appointment = await this.userService.createAppointment({
      userId,
      doctorId,
      slotId,
      tokenNumber,
      paymentId:payment._id,
      status:'scheduled'
    })

    
    await this.userService.updatePaymentWithAppointment(payment._id.toString(),appointment._id.toString())

    return res.status(201).json({success:true,message:"appointment created",appointment})
    } catch (error:any) {
      console.log(error.message)
      return res.status(500).json({success:false,message:error.message})
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const {amount} = req.body
      const orderID = await this.userService.createPaypalOrder(amount)
      res.status(200).json({success:true,orderID})
      return
    } catch (error:any) {
      console.log(error.message)
      res.status(500).json({success:false,message:error.message})
    }
  }

  async captureOrder(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const {orderID} = req.body
      const result = await this.userService.capturePaypalOrder(orderID)
      res.status(200).json({success:true,result})
      return 
    } catch (error:any) {
      console.log(error.message)
      res.status(500).json({success:false,message:error.message})
    }
  }
}
