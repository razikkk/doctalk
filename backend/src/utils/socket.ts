import { Server, Socket } from "socket.io";
import { Appointment } from "../Models/appointmentModel";

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
  
      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
  };