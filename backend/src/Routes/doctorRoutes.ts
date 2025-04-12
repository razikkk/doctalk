import { DoctorController } from "../Controllers/Implements/doctorController";
import { DoctorRepository } from "../Repositories/implements/doctorRepository";
import { userRepository } from "../Repositories/implements/userRepositories";
import { DoctorService } from "../Services/Implements/doctorService";
import express, { RequestHandler } from 'express'
import uploads from "../config/multer";
import { AdminRepository } from "../Repositories/implements/adminRepository";


const router = express.Router()
const UserRepository = new userRepository()
const doctorRepository = new DoctorRepository()
const adminRepository = new AdminRepository()
const doctorService = new DoctorService(doctorRepository,UserRepository,adminRepository)
const doctorController = new DoctorController(doctorService,doctorRepository)

const register = doctorController.register.bind(doctorController) as RequestHandler
router.post('/register',register)

const verifyOtp = doctorController.verifyOtp.bind(doctorController) as RequestHandler
router.post('/verifyOtp',verifyOtp)

const resendOtp = doctorController.resendOtp.bind(doctorController) as RequestHandler
router.post('/resendOtp',resendOtp)

const verificationSectionOne = doctorController.verificationSectionOne.bind(doctorController) as RequestHandler
router.post('/verification/step1',verificationSectionOne)

const verificationSectionTwo = doctorController.verificationSectionTwo.bind(doctorController) as RequestHandler
router.post('/verification/step2',uploads.fields([{name:"imageUrl",maxCount:1},{name:"identityProofUrl",maxCount:1},{name:"medicalCertificateUrl",maxCount:1}]),verificationSectionTwo)

const getDoctorStatus = doctorController.getDoctorStatus.bind(doctorController) as RequestHandler
router.get('/status/:email',getDoctorStatus)

const login = doctorController.login.bind(doctorController) as RequestHandler
router.post('/login',login)

const googleLogin = doctorController.googleLogin.bind(doctorController) as RequestHandler
router.post('/doctor-google-login',googleLogin)

const getDoctorProfile = doctorController.getDoctorProfile.bind(doctorController) as RequestHandler
router.get('/profile/:doctorId',getDoctorProfile)
export default router