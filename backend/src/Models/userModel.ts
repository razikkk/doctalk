import { Schema, model, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  imageUrl?: string;
  age?: number;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  gender?: "male" | "female";
  phoneNumber?: string;
  addressId?: string;
  walletId?: string;
  otp: string;
  otpExpires?: Date;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    imageUrl: { type: String },
    age: { type: Number },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    gender: { type: String, enum: ["male", "female"] },
    phoneNumber: { type: String },
    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
    isBlocked: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
