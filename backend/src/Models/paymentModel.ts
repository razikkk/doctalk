import mongoose, { Document, ObjectId, Schema, model } from "mongoose";

export interface IPayment extends Document{
    _id:ObjectId
    appointmentId?:ObjectId
    userId:ObjectId,
    doctorId:ObjectId,
    amount:number,
    status:'paid' | 'pending' | 'failed'
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
    appointmentId:{type:mongoose.Types.ObjectId,ref:'Appointment'},
    userId:{type:mongoose.Types.ObjectId,ref:'User'},
    doctorId:{type:mongoose.Types.ObjectId,ref:'Doctor'},
    amount:{type:Number},
    status:{type:String,enum:['paid' , 'pending' , 'failed'],default:"pending"}
},{timestamps:true})

export const Payment = model<IPayment>("Payment",paymentSchema)