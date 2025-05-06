import { Types } from "mongoose";
import { speciality, ISpeciality } from "../../Models/specialisationModel";
import { IDoctor } from "../../Models/doctorModel";
import { ISlot } from "../../Models/slotModel";
//abstraction

// The controller or service layer only depends on the interface.

// They don’t care how addSpecialities() is implemented.

// They just know — “hey, this method exists, and it gives me what I need.”

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
  getAllDoctors(search:string,page:number,limit:number): Promise<{
   doctors:IDoctor[];
    totalPages:number;
    currentPage:number;
  }>;
  getDoctorById(doctorId: string): Promise<IDoctor | null>;
  approveDoctor(doctorId: string, isActive: string): Promise<boolean | null>;
  rejectedDoctor(doctorId: string): Promise<boolean | null>;
  blockAndUnblockDoctor(
    doctorId: string,
    isBlocked: boolean
  ): Promise<boolean | null>;
  fetchDoctorAppointment():Promise<ISlot[]>
  filterSlots(slotDate:string,doctorId:string):Promise<ISlot[]>


}
