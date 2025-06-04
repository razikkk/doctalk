import  express, { RequestHandler } from "express";
import {  userRepository } from "../Repositories/implements/userRepositories";
import { UserController } from "../Controllers/Implements/userController";
import { userService } from "../Services/Implements/userServices";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleBasedAuthorization";
import limitter from "../middleware/RateLimitter";
import { appointemntRepository } from "../Repositories/implements/appointment";
import { paymentRepository } from "../Repositories/implements/paymentRepository";
import { AdminService } from "../Services/Implements/adminService";
import { AdminRepository } from "../Repositories/implements/adminRepository";
import { RevieRatingRepository } from "../Repositories/implements/ReviewRating";
import { ChatRepository } from "../Repositories/implements/chatRepository";

const router = express.Router()

const UserRepository = new userRepository()
const AppointemntRepository = new appointemntRepository()
const PayementRepository = new paymentRepository()
const adminRepository = new AdminRepository()
const reviewRatingRepository = new RevieRatingRepository()
const chatRepository = new ChatRepository()
const UserService = new userService(UserRepository,AppointemntRepository,PayementRepository,reviewRatingRepository,chatRepository)
const adminService = new AdminService(adminRepository,reviewRatingRepository)
const userController = new UserController(UserService,adminService)

// router.post('/register',(req,res,next)=>userController.register(req,res,next))
// router.post('/login',(req,res,next)=>userController.login(req,res,next))

router.post("/register",limitter,userController.register.bind(userController));
router.post('/verify-otp',limitter,userController.verifyOtp.bind(userController))
router.post("/login",limitter, userController.login.bind(userController));
// router.post("/verify-token",userController.verifyToken.bind(userController))
const resendOtp = userController.resendOtp.bind(userController) as RequestHandler
router.post('/resend-otp',resendOtp)

const googleSignIn = userController.googleLogin.bind(userController) as RequestHandler
router.post('/google',googleSignIn)

const refreshToken = userController.refreshToken.bind(userController) as RequestHandler
router.post('/refreshToken',refreshToken)

const fetchDoctors = userController.findDoctors.bind(userController) as RequestHandler
router.get('/get-doctors',verifyToken,fetchDoctors)

const logout = userController.logout.bind(userController) as RequestHandler
router.post('/logout',logout)

const fetchSpecialization = userController.fetchSpecialization.bind(userController) as RequestHandler
router.get('/specialization',verifyToken,fetchSpecialization)

const fetchDoctorAppointment = userController.fetchDoctorAppointment.bind(userController) as RequestHandler
router.get('/appointments',verifyToken,fetchDoctorAppointment)

const bookAppointment = userController.bookAppointment.bind(userController) as RequestHandler
router.post('/book-appointment',verifyToken,bookAppointment)

const createPaypalOrder = userController.createOrder.bind(userController) as RequestHandler
router.post('/create-paypal-order',verifyToken,createPaypalOrder)

const capturePaypalOrder = userController.captureOrder.bind(userController) as RequestHandler
router.post('/capture-paypal-order',capturePaypalOrder)

const getAllAppointment = userController.getAllAppointment.bind(userController) as RequestHandler
router.get('/appointments/:userId',verifyToken,getAllAppointment)

const findDoctorById = userController.findDoctorById.bind(userController) as RequestHandler
router.get('/doctor/:doctorId',verifyToken,findDoctorById)

const findDoctorBySpecialization = userController.findDoctorBySpecialization.bind(userController) as RequestHandler
router.get('/doctor/specialization/:specializationId',findDoctorBySpecialization)

const postReviewAndRating = userController.postReviewAndRating.bind(userController) as RequestHandler
router.post('/review-rating',postReviewAndRating)

const fetchDoctorReview = userController.fetchDoctorReview.bind(userController) as RequestHandler
router.get('/reviews/:doctorId',fetchDoctorReview)

const editReviewAndRating =  userController.editReviewAndRating.bind(userController) as RequestHandler
router.patch('/review/:reviewId',editReviewAndRating)

const getOrCreateRoom = userController.getOrCreateRoom.bind(userController) as RequestHandler
router.post('/chat/room',getOrCreateRoom)

const getMessages = userController.getMessages.bind(userController) as RequestHandler
router.get('/chat/messages/:roomId',getMessages)

const sendMessage = userController.sendMessage.bind(userController) as RequestHandler
router.post('/chat/message',sendMessage)
export default router