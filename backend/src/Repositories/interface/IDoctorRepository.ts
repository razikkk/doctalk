import { IDoctor } from "../../Models/doctorModel";
import { ISlot } from "../../Models/slotModel";
import { ISpeciality } from "../../Models/specialisationModel";
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
  findById(userId:string):Promise<IDoctor | null>

  addSlots(slotData:ISlot):Promise<ISlot>
  editDoctorProfile(doctorId:string,doctorData:Partial<IDoctor>):Promise<IDoctor | null>
  getAllSpecialities(): Promise<ISpeciality[]>;
  fetchDoctorAppointment(doctorId:string):Promise<ISlot[]>
}
