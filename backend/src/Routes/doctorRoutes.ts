import { DoctorController } from "../Controllers/Implements/doctorController";
import { DoctorRepository } from "../Repositories/implements/doctorRepository";
import { userRepository } from "../Repositories/implements/userRepositories";
import { DoctorService } from "../Services/Implements/doctorService";
import express, { RequestHandler } from 'express'
import uploads from "../config/multer";
import { AdminRepository } from "../Repositories/implements/adminRepository";
import { verifyToken } from "../middleware/authMiddleware";
import limitter from "../middleware/RateLimitter";
import { RevieRatingRepository } from "../Repositories/implements/ReviewRating";


const router = express.Router()
const UserRepository = new userRepository()
const doctorRepository = new DoctorRepository()
const adminRepository = new AdminRepository()
const reviewRatingRepository = new RevieRatingRepository()
const doctorService = new DoctorService(doctorRepository,UserRepository,adminRepository,reviewRatingRepository)
const doctorController = new DoctorController(doctorService,doctorRepository)

const register = doctorController.register.bind(doctorController) as RequestHandler
router.post('/register',limitter,register)

const verifyOtp = doctorController.verifyOtp.bind(doctorController) as RequestHandler
router.post('/verifyOtp',limitter,verifyOtp)

const resendOtp = doctorController.resendOtp.bind(doctorController) as RequestHandler
router.post('/resendOtp',resendOtp)

const verificationSectionOne = doctorController.verificationSectionOne.bind(doctorController) as RequestHandler
router.post('/verification/step1',verificationSectionOne)

const verificationSectionTwo = doctorController.verificationSectionTwo.bind(doctorController) as RequestHandler
router.post('/verification/step2',uploads.fields([{name:"imageUrl",maxCount:1},{name:"identityProofUrl",maxCount:1},{name:"medicalCertificateUrl",maxCount:1}]),verificationSectionTwo)

const getDoctorStatus = doctorController.getDoctorStatus.bind(doctorController) as RequestHandler
router.get('/status/:email',getDoctorStatus)

const login = doctorController.login.bind(doctorController) as RequestHandler
router.post('/login',limitter,login)

const googleLogin = doctorController.googleLogin.bind(doctorController) as RequestHandler
router.post('/doctor-google-login',googleLogin)

const refreshToken = doctorController.refreshToken.bind(doctorController) as RequestHandler
router.post('/refreshToken',refreshToken)

const getDoctorProfile = doctorController.getDoctorProfile.bind(doctorController) as RequestHandler
router.get('/profile/:doctorId', verifyToken,getDoctorProfile)

const logout = doctorController.logout.bind(doctorController) as RequestHandler
router.post('/logout',logout)

const addSlots = doctorController.addSlot.bind(doctorController) as RequestHandler
router.post('/add-slot',verifyToken,addSlots)

const editDoctorProfile = doctorController.editDoctorProfile.bind(doctorController) as RequestHandler
router.patch('/profile/editProfile/:doctorId',uploads.fields([{name:"imageUrl",maxCount:1},{name:"identityProofUrl",maxCount:1},{name:"medicalCertificateUrl",maxCount:1}]),verifyToken,editDoctorProfile)

const getAllSpecialities = doctorController.getAllSpecialities.bind(doctorController) as RequestHandler
router.get('/get-all-specialities',getAllSpecialities)

const fetchDoctorAppointment = doctorController.fetchDoctorAppointment.bind(doctorController) as RequestHandler
router.get('/appointments',verifyToken,fetchDoctorAppointment)

const deleteSlot = doctorController.deleteSlot.bind(doctorController) as RequestHandler
router.patch('/deleteSlot/:slotId',verifyToken,deleteSlot)

const getAllAppointments = doctorController.getAllAppointments.bind(doctorController) as RequestHandler
router.get('/appointments/:doctorId',getAllAppointments)

const updateAppointmentStatus = doctorController.updateAppointmentStatus.bind(doctorController) as RequestHandler
router.post('/update-status/:appointmentId',updateAppointmentStatus)

const fetchReviewPerDoctor = doctorController.fetchReviewPerDoctor.bind(doctorController) as RequestHandler
router.get('/review/:doctorId',fetchReviewPerDoctor)

export default router