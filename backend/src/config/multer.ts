import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

// Define Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Express.Request, file: Express.Multer.File) => ({
    resource_type: "image",
    upload_preset: "doctalk",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

// Multer Middleware
const uploads = multer({ storage });

export default uploads;
