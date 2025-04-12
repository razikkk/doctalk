import { Doctor, IDoctor } from "../../Models/doctorModel";
import { IDoctorRegisterType } from "../../type/type";
import { IDoctorRepository } from "../interface/IDoctorRepository";
import { BaseRepository } from "./baseRepository";

export class DoctorRepository extends BaseRepository<IDoctor> implements IDoctorRepository{
    constructor(){
        super(Doctor)
    }
    async findDoctorByEmail(email: string): Promise<IDoctor | null> {
        try {
            return await Doctor.findOne({email})
        } catch (error) {
            throw new Error("error finding doctor")
        }
    }
    async createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor> {
        try {
            return await this.create(doctorData)
        } catch (error) {
            console.log(error)
            throw new Error("error creating doctor")
        }
    }

    async saveDoctor(doctor: IDoctor): Promise<IDoctor> {
        return await doctor.save()
    }

    async updateDoctorStatus(email: string, status: string): Promise<IDoctor | null> {
        return await Doctor.findOneAndUpdate(
            {email},
            {status},
            {new:true}
        )
    }

    async updateDoctorStatusById(doctorId: string, status: string): Promise<IDoctor | null> {
        return await Doctor.findByIdAndUpdate(
            doctorId,
            {status},
            {new:true}
        )
    }

    async findPendingDoctors(): Promise<IDoctor[]> {
        return await Doctor.find({status:'pending'}).populate('specialization').exec()
    }

    async getDoctorStatus(email: string): Promise<"pending" | "approved" | "rejected" | undefined> {
        const doctor = await Doctor.findOne({email})
        return doctor?.isActive
    }

    async getDoctorProfile(doctorId: string): Promise<IDoctor | null> {
        return await this.findById(doctorId)
    }
}