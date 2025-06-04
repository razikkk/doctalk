import { IRoom } from "../../Models/ChatRoom";
import { IChat } from "../../Models/ChatSchema";

export interface IChatRepository{
    getOrCreateRoom(userId:string,doctorId:string):Promise<IRoom>
    saveMessages(data:{roomId:string,userId:string,doctorId:string,chat?:string,image?:string}):Promise<IChat>
    getMessagesByRoom(roomId:string):Promise<IChat[]>
}