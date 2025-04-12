import mongoose, { ObjectId, Schema } from "mongoose";

export interface ISlot {
  doctorId: ObjectId;
  startTime: Date;
  endTime: Date;
  availableSlot: number;
  avgConsultingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const slotSchema = new Schema<ISlot>(
  {
    doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    availableSlot: { type: Number, required: true },
    avgConsultingTime: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISlot>("Slot", slotSchema);
