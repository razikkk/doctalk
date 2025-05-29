import { IReviewRating } from "../../Models/RevieRating";
import { IDoctor } from "../../Models/doctorModel";
import { ISlot } from "../../Models/slotModel";
import { ISpeciality } from "../../Models/specialisationModel";

export interface IAdminService {
  getAllSpecialities(): Promise<ISpeciality[]>;
  addSpecialities(data: Partial<ISpeciality>): Promise<ISpeciality>;
  updateSpecialities(
    id: string,
    data: Partial<ISpeciality>
  ): Promise<ISpeciality | null>;
  deleteSpecialities(id: string): Promise<boolean>;
  restoreSpecialities(id: string): Promise<boolean>;
  getSpecialisationById(id: string): Promise<ISpeciality | null>;
  getActiveSpecialites(): Promise<ISpeciality[]>;
  getAllDoctors(
    search: string,
    page: number,
    limit: number
  ): Promise<{ doctors: IDoctor[]; totalPages: number; currentPage: number }>;
  getDoctorById(doctorId: string): Promise<IDoctor | null>;
  approveDoctor(
    doctorId: string,
    isActive: string
  ): Promise<{ success: boolean; doctor?: any }>;
  rejectedDoctors(doctorId: string): Promise<boolean | null>;
  blockAndUnblockDoctor(
    doctorId: string,
    isBlocked: boolean
  ): Promise<boolean | null>;
  fetchDoctorAppointment(): Promise<ISlot[]>;
  filterSlots(slotDate: string, doctorId: string): Promise<ISlot[]>;
  fetchDoctorReviews(doctorId:string):Promise<IReviewRating[]>
}
