import { Doctor, IDoctor } from '../../Models/doctorModel';
import {IUser, User} from '../../Models/userModel'
import redisClient from '../../config/redisClient';
import { IUserRepository } from '../interface/IUserRepository';
import { BaseRepository } from './baseRepository';


export class userRepository extends BaseRepository<IUser> implements IUserRepository{
    constructor(){
        super(User)  
    }

       async findUserByEmail(email:string):Promise<IUser | null>{
        try {
            return await User.findOne({email})
        } catch (err) {
            console.log(err)
            throw new Error("Error Finding User By Email")
        }
        }
        async createUser(userData: Partial<IUser>):Promise<IUser>{
            try {
                return await this.create(userData)
            } catch (err) {
                console.log(err)
                throw new Error("Cant Create User")
            }
           }
           async findById(userId:string):Promise<IUser |  null>{
              return await User.findById(userId)
           }

          async saveOtp(email: string, otp: string): Promise<void> {
               await redisClient.set(email,otp,{EX:300}) // 5mins
           }   
            async getOtp(email: string): Promise<string | null> {
                return await redisClient.get(email)
            }
            async  deleteOtp(email: string): Promise<void> {
                await redisClient.del(email)
            }

            async getAllUser(): Promise<IUser[]> {
                try {
                    return await User.find({role:'user'})
                } catch (error:any) {
                    console.log(error.message)
                    throw new Error("failed to Fetch Users")
                }
            }

            async getUserById(userId: string): Promise<IUser | null> {
                return await User.findById(userId)
            }

            async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
                return await User.findByIdAndUpdate(userId,updateData,{new:true})
            }
            
            async findDoctors(): Promise<IDoctor[]> {
                return await Doctor.find().populate('specialization','name')
            }
}






