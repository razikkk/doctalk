import { Request, Response, NextFunction } from "express";

export interface IAdminInterface {
  adminLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getAllSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  addSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  updateSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  deleteSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  restoreSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getSpecialisationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getActiveSpecialites(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getAllDoctors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getDoctorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  approveDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  blockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  unblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  blockAndUnblockDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  fetchDoctorAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  filterSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
  fetchDoctorReviews(req:Request,res:Response,next:NextFunction):Promise<void | Response>
}
