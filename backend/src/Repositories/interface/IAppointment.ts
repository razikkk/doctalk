import { IAppointment } from "../../Models/appointmentModel";

export interface IAppointmentRepository {
  createAppointment(
    appointmentData: Partial<IAppointment>
  ): Promise<IAppointment>;
  getAppointmentById(appointmentId: string): Promise<IAppointment | null>;
  decreaseAvailableSlot(slotId: string): Promise<boolean>;
  getAllAppointment(userId: string): Promise<IAppointment[]>;
}
