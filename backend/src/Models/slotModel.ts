import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface ISlot {
  doctorId: ObjectId;
  specialization: ObjectId;
  days: Date;
  startTime: string;
  endTime: string;
  availableSlot: number;
  consultingFees: number;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const slotSchema = new Schema<ISlot>(
  {
    doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor" },
    specialization: { type: mongoose.Types.ObjectId, ref: "Speciality" },
    days: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    availableSlot: { type: Number },
    consultingFees: { type: Number },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Slot = model<ISlot>("Slot", slotSchema);
