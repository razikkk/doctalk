import mongoose, { Document, ObjectId, Schema, model } from "mongoose";

export interface IDoctor extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  registrationId: string;
  registrationYear: number;
  language: "english" | "malayalam";
  hospital: string;
  age: number;
  gender: "male" | "female";
  experience: number;
  specialization?: ObjectId;
  imageUrl: string;
  about: string;
  identityProofUrl: string;
  medicalCertificateUrl: string;
  university: string;
  reviewId?: ObjectId[];
  walletId?: ObjectId;
  role: "doctor";
  otp: string;
  otpExpires: Date;
  slot?: ObjectId;
  isActive: "pending" | "approved" | "rejected";
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  step: number;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    registrationId: { type: String },
    registrationYear: { type: Number },
    language: { type: String, enum: ["english", "malayalam"] },
    hospital: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female"] },
    experience: { type: Number },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specaility",
      required: false,
    },
    imageUrl: { type: String },
    about: { type: String },
    identityProofUrl: { type: String },
    medicalCertificateUrl: { type: String },
    university: { type: String },
    reviewId: { type: mongoose.Types.ObjectId, ref: "ReviewRating" },
    walletId: { type: mongoose.Types.ObjectId, ref: "Wallet" },
    role: { type: String, enum: ["doctor"], default: "doctor" },
    isActive: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isBlocked: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    slot: [{ type: mongoose.Types.ObjectId, ref: "Slot" }],
    step: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Doctor = model<IDoctor>("Doctor", doctorSchema);
