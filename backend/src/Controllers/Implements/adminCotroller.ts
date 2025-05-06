import { Request, Response, NextFunction } from "express";
import { IUserService } from "../../Services/Interface/IUserService";
import { IAdminInterface } from "../Interface/IAdminController";
import { IAdminService } from "../../Services/Interface/IAdminService";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN || ""
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN || ""

export class AdminController implements IAdminInterface {
  private userService: IUserService;
  private adminService: IAdminService;
  constructor(userService: IUserService, adminService: IAdminService) {
    this.userService = userService;
    this.adminService = adminService;
  }

  
  async adminLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { email, password } = req.body;
      const { userData, accessToken, refreshToken } = await this.userService.login(
        email,
        password,
        true
      );
      res.cookie("adminRefreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:7 * 24 * 60 * 60 * 1000
      })
      res
        .status(200)
        .json({
          success: true,
          message: "admin Logined",
          user: userData,
          accessToken,
          refreshToken
        });
        
    } catch (error: any) {
      res.status(403).json({ success: false, message: error.message });
    }
  }
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const search = req.query.search as string
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 5
      const users = await this.userService.getAllUsers(search,page,limit);
      console.log(users,'fdd')
      res.status(201).json({ success: true, ...users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async getAllSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const specialities = await this.adminService.getAllSpecialities();
      return res.status(200).json(specialities);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async addSpecialities(
    req: Request & { file?: Express.Multer.File },
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      console.log(req.body, "boduu");
      console.log(req.file, "filee");
      const data = req.body;
      const file = req.file;
      if (file) {
        data.image = req.file?.path;
      }
      const speciality = await this.adminService.addSpecialities(data);
      console.log("spec", speciality);
      return res.status(200).json({ success: true, speciality });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { id } = req.params;
      console.log(req.params, "controler params");

      const data = req.body;
      console.log(req.body, "controler body");

      const file = req.file;
      if (file) {
        data.image = req.file?.path;
      }
      const updatedSpeciality = await this.adminService.updateSpecialities(
        id,
        data
      );
      console.log("spec update", updatedSpeciality);

      if (!updatedSpeciality) {
        return res.status(404).json({ message: "speciality not found" });
      }
      return res.status(200).json(updatedSpeciality);
    } catch (error) {
      return res.status(500).json({ message: "error occured", error });
    }
  }

  async deleteSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { id } = req.params;
      const isDeleted = await this.adminService.deleteSpecialities(id);

      if (!isDeleted) {
        return res.status(404).json({ message: "speciality not found" });
      }
      return res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "error occured", error });
    }
  }

  async restoreSpecialities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { id } = req.params;
      const isRestored = await this.adminService.restoreSpecialities(id);

      if (!isRestored) {
        return res.status(404).json({ message: "speciality not found" });
      }
      return res.status(200).json({ message: "restored successfully" });
    } catch (error) {
      return res.status(500).json({ message: "error occured", error });
    }
  }

  async getSpecialisationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { id } = req.params;
      const specialisation = await this.adminService.getSpecialisationById(id);
      if (!specialisation) {
        return res
          .status(404)
          .json({ success: false, message: "specialisation not found" });
      }
      return res.status(200).json({ success: true, data: specialisation });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  async getActiveSpecialites(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const specialities = await this.adminService.getActiveSpecialites();
      return res.status(200).json(specialities);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllDoctors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const search = req.query.search as string
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 5
      const doctor = await this.adminService.getAllDoctors(search,page,limit);
      console.log("doctors", doctor);
      res.status(200).json({ success: true, ...doctor });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }

  async getDoctorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { doctorId } = req.params;

      if (!doctorId) {
        return res
          .status(400)
          .json({ success: false, message: "doctor Id is required" });
      }
      const doctor = await this.adminService.getDoctorById(doctorId);
      if (!doctor) {
        res.status(404).json({ success: false, message: "Doctor not found" });
      }

      return res.status(200).json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }

  async approveDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { doctorId } = req.params;
      console.log(doctorId, "dff");
      const { isActive } = req.body;
      if (!doctorId) {
        return res
          .status(400)
          .json({ success: false, message: "doctorId is required" });
      }
      if (!isActive) {
        return res
          .status(400)
          .json({
            success: false,
            message: "approval or rejection is required",
          });
      }

      const approved = await this.adminService.approveDoctor(
        doctorId,
        isActive
      );
      if (!approved.success) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      if (isActive === "rejected") {
        await this.adminService.rejectedDoctors(doctorId);
      }

      res
        .status(200)
        .json({
          success: true,
          message:
            isActive === "approved" ? "Doctor approved" : "Doctor rejected",
          data: { isActive, doctorId },
        });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ success: false, message: "userId is required" });
        return;
      }
      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: "user not found" });
        return;
      }
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async blockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ success: false, message: "userId is required" });
        return;
      }
      await this.userService.blockUser(userId);
      res
        .status(200)
        .json({ success: true, message: "user blocked successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async unblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ success: false, message: "userId is required" });
      }
      await this.userService.unblockUser(userId);
      res
        .status(200)
        .json({ success: true, message: "user unblocked successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async blockAndUnblockDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const { doctorId } = req.params; //frontend request verumbo id athil ndavum ath extract cheyth edkum
      if (!doctorId) {
        return res
          .status(400)
          .json({ success: false, message: "DoctorId is required" });
      }
      const doctor = await this.adminService.getDoctorById(doctorId);
      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }
      const isBlocked = !doctor?.isBlocked; // ppo ith false aan ppo oru vattam nekkkiyal ith true aavum pne nekkiyaal false angane
      await this.adminService.blockAndUnblockDoctor(doctorId, isBlocked); //puthya statusine update cheyyan venditt databasil servicine vilikum

      return res
        .status(200)
        .json({
          success: true,
          message: isBlocked
            ? "Doctor blocked successfully"
            : "Doctor unblocked successfully",
        });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const refreshToken = req.cookies.adminRefreshToken
      console.log(refreshToken,'hylo')
      if(!refreshToken){
        console.log("not token")
        res.status(404).json({success:false,message:"token not found"})
      }
      const decoded = jwt.verify(refreshToken,REFRESH_TOKEN_SECRET) as JwtPayload
      const{userId,role} = decoded
      const newAdminAccessToken = jwt.sign({userId,role},ACCESS_TOKEN_SECRET,{expiresIn:"4d"})
      res.status(200).json({success:true,adminAccessToken:newAdminAccessToken})
    } catch (error) {
      console.log(error)
    }
  }

  //logout


  async fetchDoctorAppointment(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
        const doctorAppointment = await this.adminService.fetchDoctorAppointment()
        console.log(doctorAppointment,'dr')
          if(!doctorAppointment){
            res.status(404).json({success:false,message:"No Appointments found"})
            return
          }
           res.status(200).json({success:true,message:"Appointments fetched successfully",doctorAppointment})
           return
    } catch (error:any) {
      console.log(error.message)
      res.status(500).json({success:false,message:error.message})
      return
    }
  }

  async filterSlots(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
        const{slotDate,doctorId} = req.query
        if(!slotDate){
            return res.status(401).json({success:false,message:"Date is required"})
        }
        const filteredSlots = await this.adminService.filterSlots(slotDate as string,doctorId as string)
        return res.status(200).json({success:true,message:"slot filteration success",filteredSlots})
    } catch (error:any) {
        console.log(error.message)
    }
}

}
