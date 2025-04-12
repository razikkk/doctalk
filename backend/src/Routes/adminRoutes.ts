import express, { RequestHandler } from 'express'
import { AdminController } from '../Controllers/Implements/adminCotroller'
import { userService } from '../Services/Implements/userServices'
import { userRepository } from '../Repositories/implements/userRepositories'
import { AdminRepository } from '../Repositories/implements/adminRepository'
import { AdminService } from '../Services/Implements/adminService'
import uploads from '../config/multer'
import { verifyToken } from '../middleware/authMiddleware'
import { authorizeRole } from '../middleware/roleBasedAuthorization'

const router = express.Router()
const UserRepository = new userRepository()
const adminRepository = new AdminRepository()
const UserService = new userService(UserRepository) 
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(UserService,adminService)

const loginHandler = adminController.adminLogin.bind(adminController) as RequestHandler
router.post('/login',loginHandler)

const getAllUser = adminController.getAllUsers.bind(adminController) as RequestHandler
router.get("/all-patients",verifyToken,authorizeRole(['admin']),getAllUser)

const getAllSpecialities = adminController.getAllSpecialities.bind(adminController) as RequestHandler
router.get('/specialities',verifyToken,authorizeRole(['admin']),getAllSpecialities)

const addSpecialities = adminController.addSpecialities.bind(adminController) as RequestHandler
router.post('/addSpeciality',verifyToken,authorizeRole(['admin']),uploads.single("image"),addSpecialities)

const updatedSpeciality = adminController.updateSpecialities.bind(adminController) as RequestHandler
router.put('/updateSpeciality/:id',verifyToken,authorizeRole(['admin']),uploads.single("image"),updatedSpeciality)

const deleteSpecialities = adminController.deleteSpecialities.bind(adminController) as RequestHandler
router.patch('/deleteSpeciality/:id',verifyToken,authorizeRole(['admin']),deleteSpecialities)

const restoreSpecialities = adminController.restoreSpecialities.bind(adminController) as RequestHandler
router.patch('/restoreSpeciality/:id',verifyToken,authorizeRole(['admin']),restoreSpecialities)

const getSpecialisationById = adminController.getSpecialisationById.bind(adminController) as RequestHandler
router.get('/specialities/:id',verifyToken,authorizeRole(['admin']),getSpecialisationById)

const getActiveSpecialites = adminController.getActiveSpecialites.bind(adminController) as RequestHandler
router.get('/activeSpecialities',verifyToken,authorizeRole(['admin']),getActiveSpecialites)

const getAllDoctors = adminController.getAllDoctors.bind(adminController) as RequestHandler
router.get('/doctors',verifyToken,authorizeRole(['admin']),getAllDoctors)

const getDoctorById = adminController.getDoctorById.bind(adminController) as RequestHandler
router.get('/doctors/:doctorId',verifyToken,authorizeRole(['admin']),getDoctorById)

const approveDoctor = adminController.approveDoctor.bind(adminController) as RequestHandler
router.post('/doctors/:doctorId/approve-doctor',verifyToken,authorizeRole(['admin']),approveDoctor)

const blockUser = adminController.blockUser.bind(adminController) as  RequestHandler
router.put('/all-patients/:userId/block',verifyToken,authorizeRole(['admin']),blockUser)

const unblockUser = adminController.unblockUser.bind(adminController) as RequestHandler
router.put('/all-patients/:userId/unblock',verifyToken,authorizeRole(['admin']),unblockUser)

const blockDoctor = adminController.blockAndUnblockDoctor.bind(adminController) as RequestHandler
router.put(`/doctors/:doctorId/block`,verifyToken,authorizeRole(['admin']),blockDoctor) //ivde oru ulla fieldine update cheyyan so we use put 

const refreshToken = adminController.refreshToken.bind(adminController) as RequestHandler
router.post('/refreshToken',refreshToken)
export default router