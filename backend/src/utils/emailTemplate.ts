
interface EmailTemplate {
    subject:string,
    text:string,
    html?:string
}

export const getDoctorStatusEmail = (
    status: 'approved' | 'rejected',
    doctorName: string
  ): EmailTemplate => {
    const base = {
      approved: {
        subject: `🎉 Congratulations Dr. ${doctorName}! Your DocTalk Profile is Approved`,
        text: `Dear Dr. ${doctorName},\n\nWe're thrilled to inform you that your DocTalk practitioner profile has been approved!\n\nYou can now:\n- Start accepting patient appointments\n- Manage your availability\n- Access our doctor dashboard\n\nWelcome aboard!\n\nThe DocTalk Team`,
      },
      rejected: {
        subject: `🔍 DocTalk Profile Review Required`,
        text: `Dear Dr. ${doctorName},\n\nAfter careful review, we currently cannot approve your profile. We're happy to help at support@doctalk.com.\n\nDocTalk  Team`,
      }
    };
  
    return base[status];
  };