import express, { RequestHandler } from 'express'
import { AdminController } from '../Controllers/Implements/adminCotroller'
import { userService } from '../Services/Implements/userServices'
import { userRepository } from '../Repositories/implements/userRepositories'
import { AdminRepository } from '../Repositories/implements/adminRepository'
import { AdminService } from '../Services/Implements/adminService'
import uploads from '../config/multer'
import { verifyToken } from '../middleware/authMiddleware'
import { authorizeRole } from '../middleware/roleBasedAuthorization'
import limitter from '../middleware/RateLimitter'
import { appointemntRepository } from '../Repositories/implements/appointment'
import { paymentRepository } from '../Repositories/implements/paymentRepository'
import { RevieRatingRepository } from '../Repositories/implements/ReviewRating'
import { ChatRepository } from '../Repositories/implements/chatRepository'

const router = express.Router()
const UserRepository = new userRepository()
const adminRepository = new AdminRepository()
const AppointemntRepository = new appointemntRepository()
const PaymentRepository = new paymentRepository()
const reviewRatingRepository = new RevieRatingRepository()
const chatRepository = new ChatRepository()
const UserService = new userService(UserRepository,AppointemntRepository,PaymentRepository,reviewRatingRepository,chatRepository) 
const adminService = new AdminService(adminRepository,reviewRatingRepository)
const adminController = new AdminController(UserService,adminService)

const loginHandler = adminController.adminLogin.bind(adminController) as RequestHandler
router.post('/login',limitter,loginHandler)

const getAllUser = adminController.getAllUsers.bind(adminController) as RequestHandler
router.get("/all-patients",verifyToken,authorizeRole(['admin']),getAllUser)

const getAllSpecialities = adminController.getAllSpecialities.bind(adminController) as RequestHandler
router.get('/specialities',verifyToken,authorizeRole(['admin']),getAllSpecialities)

const addSpecialities = adminController.addSpecialities.bind(adminController) as RequestHandler
router.post('/add-speciality',verifyToken,authorizeRole(['admin']),uploads.single("image"),addSpecialities)

const updatedSpeciality = adminController.updateSpecialities.bind(adminController) as RequestHandler
router.put('/update-speciality/:id',verifyToken,authorizeRole(['admin']),uploads.single("image"),updatedSpeciality)

const deleteSpecialities = adminController.deleteSpecialities.bind(adminController) as RequestHandler
router.patch('/delete-speciality/:id',verifyToken,authorizeRole(['admin']),deleteSpecialities)

const restoreSpecialities = adminController.restoreSpecialities.bind(adminController) as RequestHandler
router.patch('/restore-speciality/:id',verifyToken,authorizeRole(['admin']),restoreSpecialities)

const getSpecialisationById = adminController.getSpecialisationById.bind(adminController) as RequestHandler
router.get('/specialities/:id',verifyToken,authorizeRole(['admin']),getSpecialisationById)

const getActiveSpecialites = adminController.getActiveSpecialites.bind(adminController) as RequestHandler
router.get('/active-specialities',getActiveSpecialites)

const getAllDoctors = adminController.getAllDoctors.bind(adminController) as RequestHandler
router.get('/doctors',verifyToken,authorizeRole(['admin']),getAllDoctors)

const getDoctorById = adminController.getDoctorById.bind(adminController) as RequestHandler
router.get('/doctors/:doctorId',verifyToken,authorizeRole(['admin']),getDoctorById)

const approveDoctor = adminController.approveDoctor.bind(adminController) as RequestHandler
router.post('/doctors/approve-doctor/:doctorId',verifyToken,authorizeRole(['admin']),approveDoctor)

const blockUser = adminController.blockUser.bind(adminController) as  RequestHandler
router.put('/all-patients/block/:userId',verifyToken,authorizeRole(['admin']),blockUser)

const unblockUser = adminController.unblockUser.bind(adminController) as RequestHandler
router.put('/all-patients/unblock/:userId',verifyToken,authorizeRole(['admin']),unblockUser)

const blockDoctor = adminController.blockAndUnblockDoctor.bind(adminController) as RequestHandler
router.put(`/doctors/block/:doctorId`,verifyToken,authorizeRole(['admin']),blockDoctor) //ivde oru ulla fieldine update cheyyan so we use put 

const refreshToken = adminController.refreshToken.bind(adminController) as RequestHandler
router.post('/refreshToken',refreshToken)

const fetchDoctorAppointment = adminController.fetchDoctorAppointment.bind(adminController) as RequestHandler
router.get('/appointments',verifyToken,authorizeRole(['admin']),fetchDoctorAppointment)

const filteredSlots = adminController.filterSlots.bind(adminController) as RequestHandler
router.get('/appointments/filter',verifyToken,authorizeRole(['admin']),filteredSlots)

const fetchDoctorReviews = adminController.fetchDoctorReviews.bind(adminController) as RequestHandler
router.get('/review/:doctorId',fetchDoctorReviews)
export default router