import { text } from "express";

interface IAppointment {
  subject: string;
  text: string;
  html?: string;
}

export const appointmentSuccessEmail = (
  userName: string,
  doctorName: string
): { user: IAppointment; doctor: IAppointment } => {
  return {
    user: {
      subject: `🎉 Dear ${userName}, Your Appointment has been booked with ${doctorName}`,
      text: `Dear ${userName},
            \n\n
            Your appointment with Dr. ${doctorName} has been successfully booked.
            \n
            Please check the website for more details.
            \n\n
            Thank you,  
            Doctalk Team
             `,
    },
    doctor: {
      subject: `📅 New Appointment Booked with ${userName}`,
      text: `Dear Dr. ${doctorName},
            \n\n
            An appointment has been booked with patient ${userName}.
            \n
            Please check the website for more details.
            \n\n
            Best regards,  
            Doctalk Team`,
    },
  };
};
