export const userEndpoints = {
  SIGNUP: "/register",
  SIGNIN: "login",
  VERIFY_OTP: "/verify-otp",
  FETCHDOCTORS : "/get-doctors",
  // REFRESH_TOKEN : "/refreshToken"
  LOGOUT : "/logout"
};

export const doctorEndpoints = {
  SIGNUP: "/register",
  SIGNIN: "/login",
  VERIFY_OTP: "/verifyOtp",
  VERIFICATION_SECITON_ONE: "/verification/step1",
  VERIFICATION_SECTION_TWO: "/verification/step2",
  DOCTOR_STATUS : (email:string)=> `/status/${email}`,
  GOOGLE_LOGIN:'/doctor-google-login', 
  GET_DOCTOR_PROFILE:(doctorId:string)=>`/profile/${doctorId}`
};

export const adminEndpoints = {
  SIGNIN: "/login",
  PATIENTS: "/all-patients",
  SPECIALITIES: "/specialities",
  ADD_SPECIALITIES: "/addSpeciality",
  UPDATE_SPECIALITIES : (id:string)=>`/updateSpeciality/${id}`,
  DELETE_SPECIALITIES : (id:string)=> `/deleteSpeciality/${id}`,
  RESTORE_SPECIALITIES : (id:string)=> `/restoreSpeciality/${id}`,
  FETCH_SPECIALITIES : (id:string)=> `/specialities/${id}`,
  ACTIVE_SPECIALITIES: "/activeSpecialities",
  DOCTORS: "/doctors",
  DOCTOR_BY_ID: (doctorId: string) => `/doctors/${doctorId}`,
  APPROVE_DOCTOR : (doctorId:string)=> `/doctors/${doctorId}/approve-doctor`,
  BLOCK_USER : (userId:string)=> `/all-patients/${userId}/block`,
  UNBLOCK_USER: (userId: string) => `/all-patients/${userId}/unblock`,
};
