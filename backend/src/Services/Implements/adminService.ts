import { Doctor, IDoctor } from "../../Models/doctorModel";
import { ISlot } from "../../Models/slotModel";
import { ISpeciality } from "../../Models/specialisationModel";
import { IAdmin } from "../../Repositories/interface/IAdminRepository";
import { getDoctorStatusEmail } from "../../utils/emailTemplate";
import { transporter } from "../../utils/nodemailer";
import { IAdminService } from "../Interface/IAdminService"; 

export class AdminService implements IAdminService{
    private AdminRepo : IAdmin
    constructor(AdminRepo:IAdmin){ //DInjecition(injected from outside not creating inside)
        this.AdminRepo = AdminRepo
    } ///oops,solid,
    async getAllSpecialities(): Promise<ISpeciality[]> {
        return await this.AdminRepo.getAllSpecialities()
    }
     async addSpecialities(data: Partial<ISpeciality>): Promise<ISpeciality> {
       return await this.AdminRepo.addSpecialities(data)
    }
    async updateSpecialities(id: string, data: Partial<ISpeciality>): Promise<ISpeciality | null> {
        return this.AdminRepo.updateSpecialities(id,data)
    }
    async  deleteSpecialities(id: string): Promise<boolean> { //specId 
        return await this.AdminRepo.deleteSpecialities(id)
    }
    async restoreSpecialities(id: string): Promise<boolean> {
        return await this.AdminRepo.restoreSpecialities(id)
    }
    async getSpecialisationById(id: string): Promise<ISpeciality | null> {
        return await this.AdminRepo.getSpecialisationById(id)
    }
    async getActiveSpecialites(): Promise<ISpeciality[]> {
        return await this.AdminRepo.getActiveSpecialites()
    }
    async getAllDoctors(search:string,page:number,limit:number): Promise<{doctors:IDoctor[];totalPages:number;currentPage:number}> {
        return await this.AdminRepo.getAllDoctors(search,page,limit)
    }
    async getDoctorById(doctorId: string): Promise<IDoctor | null> {
        return await this.AdminRepo.getDoctorById(doctorId)
    }
    async approveDoctor(doctorId: string, isActive: string): Promise<{success:boolean,doctor?:any}> {
        try {
            const doctor = await Doctor.findByIdAndUpdate(
                doctorId,
                {isActive},
                {new:true}
            )
            if(!doctor){
                return {success:false}
            }
            const emailTemplate = getDoctorStatusEmail(
                isActive as 'approved' | 'rejected',
                doctor.name
            )
            await transporter.sendMail({
                from : process.env.EMAIL,
                to : doctor.email,
                subject : emailTemplate.subject,
                text : emailTemplate.text,
                html : emailTemplate.html
            })
            return {success:true,doctor}
        } catch (error:any) {
            console.log(error.message)
            return {success:false}
        }
    }
    async rejectedDoctors(doctorId: string): Promise<boolean | null > {
       const doctor =  await this.AdminRepo.rejectedDoctor(doctorId)
       return !!doctor
    }
    async blockAndUnblockDoctor(doctorId: string, isBlocked: boolean): Promise<boolean | null> {
        const updateDoctor = await this.AdminRepo.blockAndUnblockDoctor(doctorId,isBlocked)
        if(updateDoctor == null){
            throw new Error("Doctor not found")
        }
        return updateDoctor
    }
    async fetchDoctorAppointment(): Promise<ISlot[]> {
        return await this.AdminRepo.fetchDoctorAppointment()
    }
    async filterSlots(slotDate: string,doctorId:string): Promise<ISlot[]> {
        return this.AdminRepo.filterSlots(slotDate,doctorId)
    }
   
}