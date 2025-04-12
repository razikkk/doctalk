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
  logout(req:Request,res:Response,next:NextFunction):Promise<void | Response>
}
