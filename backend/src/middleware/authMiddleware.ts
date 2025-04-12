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
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN || "";
const UserRepository = new userRepository();

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
    console.log(userId,"userd")

    const user = await UserRepository.findById(userId);
    if (!user) {
      res.status(404).json({ valid: false, message: "User dont exists" });
      return;
    }
    if (user.isBlocked) {
      await redisClient.set(`Blocked:${userId}`, "true");
      res.status(403).json({ valid: false, message: "User is blocked" });
      return;
    } else {
      await redisClient.del(`Blocked:${userId}`);
    }
    req.user = { userId, role: decoded.role };
    next();
  } catch (error:any) {
    if(error.name === 'TokenExpiredError'){
      res.status(401).json({valid:false,message:"Token expird"})
    }else{

      res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
  }
  return;
};
