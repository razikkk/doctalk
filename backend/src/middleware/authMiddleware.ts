// import { NextFunction, Request, Response } from "express";
// import redisClient from "../config/redisClient";
// import { logout } from "../utils/auth";

// export const checkUserStatus = async(req:Request,res:Response,next:NextFunction)=>{
//     const userId = req.user._id
//     try {
//         const isBlocked = await redisClient.get(`blocked:${userId}`)
//         if(isBlocked==="true"){
//             logout()
//             res.status(403).json({success:false,message:"Your are blocked. Please contact support"})
//         }
//         next()
//     } catch (error:any) {
//         res.status(500).json({success:false,message:error.message})
//     }
// }

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { userRepository } from "../Repositories/implements/userRepositories";
import redisClient from "../config/redisClient";
import { DoctorRepository } from "../Repositories/implements/doctorRepository";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN || "";
const UserRepository = new userRepository();
const doctorRepository = new DoctorRepository()

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "user" | "admin" | "doctor";
  };
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1]; //bearer tokenn token edka
  if (!token) {
    console.log("access denied")
     res.status(401).json({ message: "Access Denied. No token provided" });
     return 
    
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload
    console.log(decoded,"deconddd")
    // if the token is valid it will returnu a object with iat and exp,userId,role (jwtpayload is a type)
    //it can be a string or a object(jwtpayload)
    const userId = decoded.userId as string;
    const role = decoded.role as "user" | "admin" | "doctor"
    console.log(userId,"userd")
    

    if(role === "doctor"){
      const doctor = await doctorRepository.findById(userId)
      if(!doctor){
        res.status(404).json({success:false,message:"Doctor not found"})
        return
      }
      if(doctor.isBlocked){
        res.status(403).json({success:false,message:"Doctor is blocked"})
        return
      }
      if(doctor.isActive === "rejected"){
        res.status(403).json({success:false,message:"Your application is rejected, Please contact support"})
        return
      }
      if(doctor.isActive === "pending"){
        res.status(403).json({success:false,messsage:"Your application is still under review. Please wait"})
        return
      }
    }else{
      const isBlockedInRedis = await redisClient.get(`blocked:${userId}`)
      if(isBlockedInRedis === "true"){
        res.status(403).json({success:false,message:"Your account is blocked by admin. Please contact support"})
        return
      }
    

    const user = await UserRepository.findById(userId);
    console.log(user,'blok')
    if (!user) {
      res.status(404).json({ valid: false, message: "User dont exists" });
      return;
    }
    if (user.isBlocked) {
      await redisClient.set(`blocked:${userId}`, "true");
      res.status(403).json({ valid: false, message: "User is blocked" });
      return;
    } else {
      await redisClient.del(`blocked:${userId}`);
      console.log("unblocked",)
    }
  }
    req.user = { userId, role };
    next();
  
  } catch (error:any) {
    if(error.name === 'TokenExpiredError'){
      res.status(401).json({valid:false,message:"Token expired"})
    }else{
      res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
  }
  return;
};
