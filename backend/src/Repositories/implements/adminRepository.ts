import { Types } from "mongoose";
import { ISpeciality, speciality } from "../../Models/specialisationModel";
import { IAdmin } from "../interface/IAdminRepository";
import { Doctor, IDoctor } from "../../Models/doctorModel";



export class AdminRepository  implements IAdmin{
    async getAllSpecialities(): Promise<ISpeciality[]> {
        return await speciality.find()
    }

   async addSpecialities(data: Partial<ISpeciality>): Promise<ISpeciality> {
        return await speciality.create(data)   
    }
     async updateSpecialities(id: string, data: Partial<ISpeciality>): Promise<ISpeciality | null> {
        const updatedSpeciality = await speciality.findByIdAndUpdate(id,data,{new:true})
        return updatedSpeciality
     }
     async deleteSpecialities(id: string): Promise<boolean> {
        const deletingSpeciality = await speciality.findById(id)
        if(!deletingSpeciality){
            return false
        }
        await speciality.findByIdAndUpdate(id,{$set:{isDelete:true}})
        return true
    }
    async restoreSpecialities(id: string) {
        const specialityToRestore = await speciality.findById(id)
        if(!specialityToRestore) return false

        await speciality.findByIdAndUpdate(id,{$set:{isDelete:false}})
        return true
    }
    async getSpecialisationById(id: string | Types.ObjectId): Promise<ISpeciality | null> {
        return await speciality.findById(id)
    }
    async getActiveSpecialites(): Promise<ISpeciality[]> {
        const result =  await speciality.find({isDelete:false})
        console.log('ublocked',result)
        return result
    }
    async getAllDoctors(): Promise<IDoctor[]> {
        return await Doctor.find().populate("specialization","name")
    }
    async getDoctorById(doctorId:string):Promise<IDoctor | null>{
        return await Doctor.findById(doctorId).populate("specialization","name")
    }
    async approveDoctor(doctorId: string, isActive: string): Promise<boolean | null> {
       const approval =   await Doctor.findByIdAndUpdate(doctorId,{isActive})
         return approval?.isActive === 'approved'
    }
    async rejectedDoctor(doctorId: string): Promise<boolean | null> {
        return await Doctor.findByIdAndUpdate(doctorId,{
            isActive:'rejected',
            rejectionDate: new Date()
        },{new:true})
    }
    async blockAndUnblockDoctor(doctorId: string, isBlocked: boolean): Promise<boolean | null> {
        const updateDoctor = await Doctor.findByIdAndUpdate(doctorId,{isBlocked},{new:true})
        return updateDoctor ? updateDoctor.isBlocked ?? null : null // doctor ndengil isblocked (true or false) allengil null
    }

}