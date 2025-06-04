// Chat.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Edit, MoreVertical, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import { fetchDoctorProfile, getMessages, getOrCreateRoom, sendMessage } from '../utils/auth';
import { useLocation, useParams } from 'react-router-dom';

interface IMessage {
  userId: string;
  doctorId: string;
  chats: string;
  createdAt: string;
}

interface IDoctor {
  name: string;
  imageUrl: string;
  _id: string;
}

interface IRoom {
  room: {
    _id: string;
    users: string[];
  };
}

const socket = io('http://localhost:3000');

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [chatUsers, setChatUsers] = useState<IDoctor[]>([]);
  const userId = localStorage.getItem('userId') || '';
const {doctorId} = useParams()

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      const response = await fetchDoctorProfile(doctorId);
      setDoctor(response?.result || null);
    };
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    const setUpChat = async () => {
      if (!userId || !doctorId) return;
      const roomData: IRoom | undefined = await getOrCreateRoom(userId, doctorId);
      console.log(roomData,'room')
      if (!roomData) return;
      setRoomId(roomData.room._id);
      socket.emit('join_chat_room', roomData.room._id);

      const existingMessages: IMessage[] = await getMessages(roomData.room._id);
      setMessages(Array.isArray(existingMessages) ? existingMessages : []);
    };
    setUpChat();
  }, [userId, doctorId]);

  useEffect(() => {
    socket.on('recieve_message', (newMessage: IMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      socket.off('recieve_message');
    };
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || !roomId) return;
    const newMessage = { roomId, userId, doctorId, chats: input };
    await sendMessage(roomId, userId, doctorId, input);
    socket.emit('send_message', newMessage);
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!roomId) return <div className="p-4">Loading chat...</div>;

  return (
    <div className="max-w-6xl mx-auto flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 space-y-4">
        <h2 className="font-bold text-lg">Chats</h2>
        {/* Placeholder: replace with dynamic chat list */}
        {doctor && (
          <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
            <img src={doctor.imageUrl || '/default.jpg'} className="w-8 h-8 rounded-full" alt={doctor.name} />
            <span>{doctor.name}</span>
          </div>
        )}
      </div>

      {/* Main Chat */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-4rem)]">
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor?.imageUrl || '/default.jpg'}
                    className="w-10 h-10 rounded-full"
                    alt="Doctor"
                  />
                  <div>
                    <h3 className="font-semibold">{doctor?.name}</h3>
                    <p className="text-sm text-gray-500">Connected with Doctor</p>
                  </div>
                </div>
                <MoreVertical size={20} className="text-gray-400" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        message.userId === userId
                          ? 'bg-[#157B7B] text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p>{message.chats}</p>
                      <p className="text-xs mt-1 text-right text-gray-500">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-center">
                  <Edit size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 mx-3 p-3 rounded-lg border bg-gray-50"
                  />
                  <button
                    className="p-2 bg-[#157B7B] text-white rounded-full hover:bg-[#116969]"
                    onClick={handleSendMessage}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
