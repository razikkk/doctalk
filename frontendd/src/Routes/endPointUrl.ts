export const userEndpoints = {
  SIGNUP: "/register",
  SIGNIN: "login",
  VERIFY_OTP: "/verify-otp",
  FETCHDOCTORS : "/get-doctors",
  // REFRESH_TOKEN : "/refreshToken"
  LOGOUT : "/logout",
  REFRESH_RESPONSE:"/refreshToken",
  FETCH_SPECIALIZATION : '/specialization',
  APPOINTMENTS: `/appointments`,
  BOOK_APPOINTMENT:'/book-appointment',
  CREATE_PAYPAL_ORDER:'/create-paypal-order',
  CAPTURE_PAYPAL_ORDER:'/capture-paypal-order'
};

export const doctorEndpoints = {
  SIGNUP: "/register",
  SIGNIN: "/login",
  VERIFY_OTP: "/verifyOtp",
  VERIFICATION_SECITON_ONE: "/verification/step1",
  VERIFICATION_SECTION_TWO: "/verification/step2",
  DOCTOR_STATUS : (email:string)=> `/status/${email}`,
  GOOGLE_LOGIN:'/doctor-google-login', 
  GET_DOCTOR_PROFILE:(doctorId:string)=>`/profile/${doctorId}`,
  LOGOUT:'/logout',
  ADD_SLOTS : '/add-slot',
  REFRESH_RESPONSE:"/refreshToken",
  EDIT_DOCTOR_PROFILE : (doctorId:string)=>`/profile/editProfile/${doctorId}`,
  SPECIALITIES : '/get-all-specialities',
  APPOINTMENTS:(doctorId:string)=>`/appointments?doctorId=${doctorId}`
};

export const adminEndpoints = {
  SIGNIN: "/login",
  PATIENTS: "/all-patients",
  SPECIALITIES: "/specialities",
  ADD_SPECIALITIES: "/add-speciality",
  UPDATE_SPECIALITIES : (id:string)=>`/update-speciality/${id}`,
  DELETE_SPECIALITIES : (id:string)=> `/delete-speciality/${id}`,
  RESTORE_SPECIALITIES : (id:string)=> `/restore-speciality/${id}`,
  FETCH_SPECIALITIES : (id:string)=> `/specialities/${id}`,
  ACTIVE_SPECIALITIES: "/active-specialities",
  DOCTORS: "/doctors",
  DOCTOR_BY_ID: (doctorId: string) => `/doctors/${doctorId}`,
  APPROVE_DOCTOR : (doctorId:string)=> `/doctors/approve-doctor/${doctorId}`,
  BLOCK_USER : (userId:string)=> `/all-patients/block/${userId}`,
  UNBLOCK_USER: (userId: string) => `/all-patients/unblock/${userId}`,
  FETCH_DOCTOR_APPOINTMENTS:"/appointments",
  BLOCK_UNBLOCK_DOCTOR:(doctorId:string)=> `/doctors/block/${doctorId}`,
  REFRESH_RESPONSE:"/refreshToken",
  APPOINTMENT_FILTER_BY_DATE : (slotDate:string,doctorId:string)=>`/appointments/filter?slotDate=${slotDate}&doctorId=${doctorId}`
};
