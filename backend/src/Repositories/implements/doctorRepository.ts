import { Appointment, IAppointment } from "../../Models/appointmentModel";
import { Doctor, IDoctor } from "../../Models/doctorModel";
import { ISlot, Slot } from "../../Models/slotModel";
import { ISpeciality, speciality } from "../../Models/specialisationModel";
import { IDoctorRegisterType } from "../../type/type";
import { IDoctorRepository } from "../interface/IDoctorRepository";
import { BaseRepository } from "./baseRepository";

export class DoctorRepository
  extends BaseRepository<IDoctor>
  implements IDoctorRepository
{
  constructor() {
    super(Doctor);
  }
  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    try {
      return await Doctor.findOne({ email });
    } catch (error) {
      throw new Error("error finding doctor");
    }
  }
  async createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor> {
    try {
      return await this.create(doctorData);
    } catch (error) {
      console.log(error);
      throw new Error("error creating doctor");
    }
  }

  async saveDoctor(doctor: IDoctor): Promise<IDoctor> {
    return await doctor.save();
  }

  async updateDoctorStatus(
    email: string,
    status: string
  ): Promise<IDoctor | null> {
    return await Doctor.findOneAndUpdate({ email }, { status }, { new: true });
  }

  async updateDoctorStatusById(
    doctorId: string,
    status: string
  ): Promise<IDoctor | null> {
    return await Doctor.findByIdAndUpdate(doctorId, { status }, { new: true });
  }

  async findPendingDoctors(): Promise<IDoctor[]> {
    return await Doctor.find({ status: "pending" })
      .populate("specialization")
      .exec();
  }

  async getDoctorStatus(
    email: string
  ): Promise<"pending" | "approved" | "rejected" | undefined> {
    const doctor = await Doctor.findOne({ email });
    return doctor?.isActive;
  }

  async getDoctorProfile(doctorId: string): Promise<IDoctor | null> {
    return await Doctor.findById(doctorId).populate("specialization").populate('reviewId');
  }
  async findById(userId: string): Promise<IDoctor | null> {
    return await Doctor.findById(userId);
  }
  async addSlots(slotData: ISlot): Promise<ISlot> {
    console.log(slotData, "dd");
    const newSlot = await Slot.create(slotData);
    return newSlot.toObject();
  }
  async editDoctorProfile(
    doctorId: string,
    doctorData: Partial<IDoctor>
  ): Promise<IDoctor | null> {
    return await Doctor.findByIdAndUpdate(doctorId, doctorData, { new: true });
  }
  async getAllSpecialities(): Promise<ISpeciality[]> {
    return await speciality.find({ isDelete: false });
  }
  async fetchDoctorAppointment(doctorId: string): Promise<ISlot[]> {
    return await Slot.find({ doctorId, isDelete: false });
  }
  async deleteSlot(slotId: string, isDelete: boolean): Promise<boolean | null> {
    const result = await Slot.findByIdAndUpdate(slotId, { isDelete });
    return !!result;
  }
  async getAllAppointments(doctorId:string): Promise<IAppointment[]> {
      return await Appointment.find({doctorId}).populate('userId','name').populate('slotId')
  }
  async updateAppointmentStatus(appointmetId: string, status: string): Promise<IAppointment | null> {
      return await Appointment.findByIdAndUpdate(appointmetId,{status},{new:true})
  }
}
