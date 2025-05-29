import { Appointment, IAppointment } from "../../Models/appointmentModel";
import { Slot } from "../../Models/slotModel";
import { IAppointmentRepository } from "../interface/IAppointment";

export class appointemntRepository implements IAppointmentRepository {
  async createAppointment(
    appointmentData: Partial<IAppointment>
  ): Promise<IAppointment> {
    return await Appointment.create(appointmentData);
  }

  async getAppointmentById(
    appointmentId: string
  ): Promise<IAppointment | null> {
    return await Appointment.findById(appointmentId);
  }

  async decreaseAvailableSlot(slotId: string): Promise<boolean> {
    const result = Slot.updateOne(
      { _id: slotId, availableSlot: { $gt: 0 } },
      { $inc: { availableSlot: -1 } }
    );
    return (await result).modifiedCount > 0;
  }

  async getAllAppointment(userId: string): Promise<IAppointment[]> {
    return await Appointment.find({ userId })
      .populate({
        path: "doctorId",
        select: "name specialization",
        populate: {
          path: "specialization",
          select: "name",
        },
      })
      .populate("slotId", "startTime endTime days")
      .sort({ "slotId.days": 1 });
  }
}
