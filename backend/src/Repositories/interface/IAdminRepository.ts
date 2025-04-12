import { Types } from "mongoose";
import { speciality, ISpeciality } from "../../Models/specialisationModel";
import { IDoctor } from "../../Models/doctorModel";

export interface IAdmin {
  //specialisation
  getAllSpecialities(): Promise<ISpeciality[]>;
  addSpecialities(data: Partial<ISpeciality>): Promise<ISpeciality>;
  updateSpecialities(
    id: string,
    data: Partial<ISpeciality>
  ): Promise<ISpeciality | null>;
  deleteSpecialities(id: string): Promise<boolean>;
  restoreSpecialities(id: string): Promise<boolean>;
  getSpecialisationById(
    id: Types.ObjectId | string
  ): Promise<ISpeciality | null>;
  getActiveSpecialites(): Promise<ISpeciality[]>;
  getAllDoctors(): Promise<IDoctor[]>;
  getDoctorById(doctorId: string): Promise<IDoctor | null>;
  approveDoctor(doctorId: string, isActive: string): Promise<boolean | null>;
  rejectedDoctor(doctorId: string): Promise<boolean | null>;
  blockAndUnblockDoctor(
    doctorId: string,
    isBlocked: boolean
  ): Promise<boolean | null>;
}
