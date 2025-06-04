import { Server, Socket } from "socket.io";
import { Appointment } from "../Models/appointmentModel";
import {  userService } from "../Services/Implements/userServices";
import { RevieRatingRepository } from "../Repositories/implements/ReviewRating";
import { ChatRepository } from "../Repositories/implements/chatRepository";
import { appointemntRepository } from "../Repositories/implements/appointment";
import { paymentRepository } from "../Repositories/implements/paymentRepository";
import { userRepository } from "../Repositories/implements/userRepositories";

const UserRepository = new userRepository();
const AppointmentRepository = new appointemntRepository();
const PaymentRepository = new paymentRepository();
const reviewRatingRepository = new RevieRatingRepository();
const chatRepository = new ChatRepository();

const userServices = new userService(
    UserRepository,
    AppointmentRepository,
    PaymentRepository,
    reviewRatingRepository,
    chatRepository
)

export const socketHandler = (io: Server) => {
    io.on("connection", (socket) => {
  
      socket.on("join_room", (userId: string) => {
        socket.join(userId);
      });
  
      socket.on("call_user", ({appointmentId, callerId, receiverId}) => {
        console.log('hello world', appointmentId, callerId, receiverId);
        io.to(appointmentId).emit("incoming_call", { appointmentId, callerId, receiverId });
      });
  
      socket.on("end_call", async({ roomId }) => {
        socket.to(roomId).emit("call_ended");
      });
  
      socket.on("webrtc_signal", ({ roomId, data }) => {
        socket.to(roomId).emit("webrtc_signal", data);
      })

      //chat
      socket.on("join_chat_room",(roomId:string)=>{
        socket.join(roomId)
        console.log(`user ${socket.id} joined room : ${roomId}`)
      })

      socket.on("send_message",async(data)=>{
        try {
            const {roomId,userId,doctorId,chats,image} = data
            const savedMessage = await userServices.sendMessage({
                roomId,userId,doctorId,chats,image
            })
            io.to(roomId).emit("recieve_message",savedMessage)
        } catch (error:any) {
            console.log(error.message)
        }
      })
  
      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
  };