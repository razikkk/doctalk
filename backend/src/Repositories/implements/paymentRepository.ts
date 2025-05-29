import { IPayment, Payment } from "../../Models/paymentModel";
import { IPaymentRepository } from "../interface/IPayment";

export class paymentRepository implements IPaymentRepository {
  async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
    return await Payment.create(paymentData);
  }

  async updatePaymentWithAppointment(
    paymentId: string,
    appointmentId: string
  ): Promise<IPayment | null> {
    return await Payment.findByIdAndUpdate(
      paymentId,
      { appointmentId },
      { new: true }
    );
  }
}
