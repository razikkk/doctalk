import { Document, ObjectId, Schema, model } from "mongoose";

export interface ISpeciality extends Document {
  _id: ObjectId;
  name: string;
  image: string;
  isDelete: boolean;
}

const specialitySchema = new Schema<ISpeciality>(
  {
    name: { type: String, required: true },
    image: { type: String },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const speciality = model<ISpeciality>("Specaility", specialitySchema);
