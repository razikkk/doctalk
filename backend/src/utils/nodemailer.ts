import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
export const sendMail = async (
  to: string,
  otp: string,
  userType: "doctor" | "user"
) => {
  let subject, text;
  if (userType === "doctor") {
    subject = "Welcome to DocTalk – Start Your Journey with Us!";
    text = `Dear Doctor, 

Thank you for joining DocTalk! We’re excited to have you on board as a trusted healthcare professional. 

Your One-Time Password (OTP) for verification: ${otp}

Please verify your account to start connecting with patients.

Best regards,  
DocTalk Team`;
  } else {
    subject = "Welcome to DocTalk – Your Health, Our Priority!";
    text = `Dear User,  

Thank you for signing up with DocTalk! Your health and well-being matter to us, and we're here to help you connect with top doctors effortlessly.  

Your One-Time Password (OTP) for verification: ${otp}  

Use this OTP to complete your registration.  

Best regards,  
DocTalk Team`;
  }
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};
