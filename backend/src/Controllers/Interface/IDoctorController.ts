import { NextFunction, Request, Response } from "express";

export interface IDoctorController {
  register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  verificationSectionOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  verificationSectionTwo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getDoctorStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  googleLogin(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  refreshToken(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  getDoctorProfile(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  logout(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  addSlot(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  editDoctorProfile(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  getAllSpecialities(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  fetchDoctorAppointment(req:Request,res:Response,next:NextFunction):Promise<void | Response>
}
