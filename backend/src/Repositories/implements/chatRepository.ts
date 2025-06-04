import { IRoom, chatRoom } from "../../Models/ChatRoom";
import { Chat, IChat } from "../../Models/ChatSchema";
import { IChatRepository } from "../interface/IChatRepository";

export class ChatRepository implements IChatRepository{
   async getOrCreateRoom(userId: string, doctorId: string): Promise<IRoom> {
        try {
            const participants = [userId,doctorId]

            let room = await chatRoom.findOne({
                participants:{$all:participants,$size:2}
            })
            if(!room){
                room = await chatRoom.create({participants})
            }
            return room
        } catch (error) {
            throw new Error("failed to get or create room")
        }
   }
   async saveMessages(data: { roomId: string; userId: string; doctorId: string; chat?: string | undefined; image?: string | undefined; }): Promise<IChat> {
       return await Chat.create(data)
   }
   async getMessagesByRoom(roomId: string): Promise<IChat[]> {
       return await Chat.find({roomId}).sort({createdAt:1})
   }
}