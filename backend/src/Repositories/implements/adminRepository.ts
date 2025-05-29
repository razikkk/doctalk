import { Types } from "mongoose";
import { ISpeciality, speciality } from "../../Models/specialisationModel";
import { IAdmin } from "../interface/IAdminRepository";
import { Doctor, IDoctor } from "../../Models/doctorModel";
import { ISlot, Slot } from "../../Models/slotModel";

//encapsulation

export class AdminRepository implements IAdmin {
  async getAllSpecialities(): Promise<ISpeciality[]> {
    return await speciality.find();
  }

  async addSpecialities(data: Partial<ISpeciality>): Promise<ISpeciality> {
    return await speciality.create(data);
  }
  async updateSpecialities(
    id: string,
    data: Partial<ISpeciality>
  ): Promise<ISpeciality | null> {
    const updatedSpeciality = await speciality.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedSpeciality;
  }
  async deleteSpecialities(id: string): Promise<boolean> {
    const deletingSpeciality = await speciality.findById(id);
    if (!deletingSpeciality) {
      return false;
    }
    await speciality.findByIdAndUpdate(id, { $set: { isDelete: true } });
    return true;
  }
  async restoreSpecialities(id: string) {
    const specialityToRestore = await speciality.findById(id);
    if (!specialityToRestore) return false;

    await speciality.findByIdAndUpdate(id, { $set: { isDelete: false } });
    return true;
  }
  async getSpecialisationById(
    id: string | Types.ObjectId
  ): Promise<ISpeciality | null> {
    return await speciality.findById(id);
  }
  async getActiveSpecialites(): Promise<ISpeciality[]> {
    const result = await speciality.find({ isDelete: false });
    console.log("ublocked", result);
    return result;
  }
  async getAllDoctors(
    search: string,
    page: number,
    limit: number
  ): Promise<{ doctors: IDoctor[]; totalPages: number; currentPage: number }> {
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    const totalDocs = await Doctor.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    const skip = (page - 1) * limit;
    const doctors = await Doctor.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("specialization", "name");
    return { doctors, totalPages, currentPage: page };
  }
  async getDoctorById(doctorId: string): Promise<IDoctor | null> {
    return await Doctor.findById(doctorId).populate("specialization", "name");
  }
  async approveDoctor(
    doctorId: string,
    isActive: string
  ): Promise<boolean | null> {
    const approval = await Doctor.findByIdAndUpdate(doctorId, { isActive });
    return approval?.isActive === "approved";
  }
  async rejectedDoctor(doctorId: string): Promise<boolean | null> {
    return await Doctor.findByIdAndUpdate(
      doctorId,
      {
        isActive: "rejected",
        rejectionDate: new Date(),
      },
      { new: true }
    );
  }
  async blockAndUnblockDoctor(
    doctorId: string,
    isBlocked: boolean
  ): Promise<boolean | null> {
    const updateDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { isBlocked },
      { new: true }
    );
    return updateDoctor ? updateDoctor.isBlocked ?? null : null; // doctor ndengil isblocked (true or false) allengil null
  }
  async fetchDoctorAppointment(): Promise<ISlot[]> {
    return await Slot.find().populate({
      path: "doctorId",
      select: "name imageUrl specialization",
      populate: {
        path: "specialization",
        select: "name",
      },
    });
  }

  async filterSlots(slotDate: string, doctorId: string): Promise<ISlot[]> {
    const startOfDay = new Date(slotDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(slotDate);
    endOfDay.setHours(23, 59, 59, 999);

    return Slot.find({
      days: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      doctorId: doctorId,
    }).populate({
      path: "doctorId",
      select: "name imageUrl specialization",
      populate: {
        path: "specialization",
        select: "namae",
      },
    });
  }
}
