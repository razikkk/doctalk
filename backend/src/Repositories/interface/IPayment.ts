import { IPayment } from "../../Models/paymentModel";

export interface IPaymentRepository{
    createPayment(paymentData:Partial<IPayment>):Promise<IPayment>
    updatePaymentWithAppointment(paymentId:string,appointmentId:string):Promise<IPayment | null>
}