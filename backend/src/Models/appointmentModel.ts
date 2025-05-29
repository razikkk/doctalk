import mongoose, { Document, ObjectId, Schema, model } from "mongoose";

export interface IAppointment extends Document {
  _id: ObjectId;
  doctorId: ObjectId;
  userId: ObjectId;
  slotId: ObjectId;
  tokenNumber: number;
  status: "scheduled" | "cancelled" | "completed";
  paymentId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor" },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    slotId: { type: mongoose.Types.ObjectId, ref: "Slot" },
    tokenNumber: { type: Number },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    paymentId: { type: mongoose.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema
);
