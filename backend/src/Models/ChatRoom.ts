import { Document, Schema, model } from "mongoose"

export interface IRoom extends Document{
    participants : string[]
    createdAt:Date,
    updatedAt:Date
}

const chatRoomSchema = new Schema<IRoom>({
    participants:[{type:String,required:true}]
},{timestamps:true})

export const chatRoom = model<IRoom>("ChatRoom",chatRoomSchema)