import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN || "razik3407"; //signature secret key
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN || "razikm107";

export const generateAccessToken = (
  userId: string,
  role: "admin" | "user" | "doctor"
) => {
  //payload (userId, role)
  const expiresIn = role === "admin" ? "20s" : role === "user" ? "30s" : "25s";
  return jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, { expiresIn }); //payload,secret,options
};

export const generateRefreshToken = (
  userId: string,
  role: "admin" | "user" | "doctor"
) => {
  const expiresIn = role === "admin" ? "1d" : role === "user" ? "7d" : "3d";
  return jwt.sign({ userId, role }, REFRESH_TOKEN_SECRET, { expiresIn });
};
