import mongoose, { Document, ObjectId, Schema, model, mongo } from "mongoose";

export interface IChat extends Document{
    roomId:ObjectId
    userId:ObjectId,
    doctorId:ObjectId,
    chats:string,
    image:string,
    createdAt:Date,
    updatedAt:Date
}

const chatSchema = new Schema<IChat>({
    roomId:{type:mongoose.Types.ObjectId,ref:"ChatRoom"},
    userId:{type:mongoose.Types.ObjectId,ref:"User"},
    doctorId:{type:mongoose.Types.ObjectId,ref:'Doctor'},
    chats:{type:String},
    image:{type:String}
},{timestamps:true})

export const Chat = model<IChat>("Chat",chatSchema)