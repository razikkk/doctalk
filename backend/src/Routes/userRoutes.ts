import  express, { RequestHandler } from "express";
import {  userRepository } from "../Repositories/implements/userRepositories";
import { UserController } from "../Controllers/Implements/userController";
import { userService } from "../Services/Implements/userServices";
import { verifyToken } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleBasedAuthorization";
import limitter from "../middleware/RateLimitter";

const router = express.Router()

const UserRepository = new userRepository()
const UserService = new userService(UserRepository)
const userController = new UserController(UserService)

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
router.get('/specialization',fetchSpecialization)
export default router