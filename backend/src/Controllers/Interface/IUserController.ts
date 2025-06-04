import { NextFunction, Request, Response } from "express";

export interface IUserController {
  login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
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
  // verifyToken(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void | Response>;
  googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  findDoctors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  fetchSpecialization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  fetchDoctorAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  bookAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  captureOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getAllAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  findDoctorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  findDoctorBySpecialization(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  postReviewAndRating(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  fetchDoctorReview(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  editReviewAndRating(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  getOrCreateRoom(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  sendMessage(req:Request,res:Response,next:NextFunction):Promise<void | Response>
  getMessages(req:Request,res:Response,next:NextFunction):Promise<void | Response>
}
