import { IDoctor } from "../../Models/doctorModel";
import { IDoctorRegisterType } from "../../type/type";

export interface IDoctorRepository {
  findDoctorByEmail(email: string): Promise<IDoctor | null>;
  
  createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor>;

  saveDoctor(doctor: IDoctor): Promise<IDoctor>;

  updateDoctorStatus(email: string, status: string): Promise<IDoctor | null>;

  updateDoctorStatusById(
    doctorId: string,
    status: string
  ): Promise<IDoctor | null>;

  findPendingDoctors(): Promise<IDoctor[]>;

  getDoctorStatus(
    email: string
  ): Promise<"approved" | "rejected" | "pending" | undefined>;
  getDoctorProfile(doctorId:string):Promise<IDoctor | null>
}
