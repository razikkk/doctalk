// //* Only admins can access admin routes

import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";

// // Only doctors can access doctor dashboard

// // Only users can access user routes *

// import { NextFunction, Request, Response } from "express"
// import jwt, { JwtPayload } from "jsonwebtoken"
// import dotenv from 'dotenv'
// dotenv.config()

// const secret = process.env.ACCESS_TOKEN || ""

// interface customJwtPayload extends JwtPayload{
//     userId?:string,
//     role: "admin" | "user" | "doctor"
// }

// export const roleBasedMiddleware = (...allowedRoles:("admin" | "user" | "doctor")[])=>{
//     return (req:Request,res:Response,next:NextFunction)=>{
//         try {
//             const tokenHeader = req.headers.authorization
//             if(!tokenHeader || !tokenHeader.startsWith("Bearer ")){
//                 return res.status(401).json({message:"Authorization header missing"})
//             }
//             const token = tokenHeader.split(" ")[1]

//             const decoded = jwt.verify(token,secret)
//             if(!allowedRoles.includes(decoded.role)){
//                 return res.status(403).json({message:"Access denied.."})
//             }
//             next()

//         } catch (error:any) {
//             return res.status(500).json({message:error.message})
//         }
//     }

// }

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("hy");
    console.log("authorization started");
    console.log(req.user, "user", req.user?.role, "role");
    if (!req.user || !roles.includes(req.user.role)) {
      console.log("access denied");
      res
        .status(403)
        .json({ message: "Access denied you are not supposed to be here." });
      return;
    }
    console.log("access granted");
    next();
  };
};
