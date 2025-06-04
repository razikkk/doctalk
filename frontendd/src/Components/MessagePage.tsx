import React, { useState, useEffect, useRef } from 'react';
import { Edit, MoreVertical, Search, Send, ArrowLeft } from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  serverTimestamp,
  arrayUnion,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const MessagesPage = ({ 
    currentUser,
    specificDoctorId = null,
    specificUserId = null,
    onBack = null,
    doctorInfo = null
  }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatData, setActiveChatData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);
    const unsubscribeRefs = useRef([]);

    // Create or get existing chat room
    useEffect(() => {
      console.log('Current Firebase Auth User:', auth.currentUser);
      console.log('Current User prop:', currentUser);
    }, [currentUser]);

    const createOrGetChatRoom = async (doctorMongoId, userId) => {
        try {
          console.log('Creating/getting chat room for:', { doctorMongoId, userId });
          
          // First find the doctor's Firebase UID using mongoId
          const doctorsRef = collection(db, 'doctors');
          const q = query(doctorsRef, where('mongoId', '==', doctorMongoId));
          const querySnapshot = await getDocs(q);
      
          if (querySnapshot.empty) {
            console.error('No doctor found with mongoId:', doctorMongoId);
            // Try to find in users collection as fallback
            const usersRef = collection(db, 'users');
            const userQuery = query(usersRef, where('mongoId', '==', doctorMongoId));
            const userSnapshot = await getDocs(userQuery);
            
            if (userSnapshot.empty) {
              throw new Error(`Doctor not found with mongoId: ${doctorMongoId}`);
            }
            
            const userDoc = userSnapshot.docs[0];
            const doctorUid = userDoc.id;
            console.log('Found doctor in users collection:', doctorUid);
            
            return await createChatWithUid(doctorUid, doctorMongoId, userId);
          }
      
          const doctorDoc = querySnapshot.docs[0];
          const doctorUid = doctorDoc.id;
          console.log('Found doctor with UID:', doctorUid);
      
          return await createChatWithUid(doctorUid, doctorMongoId, userId);
        } catch (error) {
          console.error('Error creating/getting chat room:', error);
          return null;
        }
    };

    // Helper function to create chat with UID
    const createChatWithUid = async (doctorUid, doctorMongoId, userId) => {
      try {
        // Check if chat room already exists - FIXED to use OR query
        const chatsRef = collection(db, 'chats');
        
        // First check with current combination
        let chatQuery = query(
          chatsRef, 
          where('doctorId', '==', doctorUid),
          where('userId', '==', userId)
        );
        
        let chatQuerySnapshot = await getDocs(chatQuery);
        
        // If not found, check reverse combination (in case roles were mixed up)
        if (chatQuerySnapshot.empty) {
          chatQuery = query(
            chatsRef, 
            where('doctorId', '==', userId),
            where('userId', '==', doctorUid)
          );
          chatQuerySnapshot = await getDocs(chatQuery);
        }
        
        if (!chatQuerySnapshot.empty) {
          const existingChatId = chatQuerySnapshot.docs[0].id;
          console.log('Found existing chat:', existingChatId);
          return existingChatId;
        }

        // Create new chat room
        const newChatRef = await addDoc(chatsRef, {
          doctorId: doctorUid,
          doctorMongoId: doctorMongoId,
          userId,
          lastMessage: '',
          messages: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log('Created new chat:', newChatRef.id);
        return newChatRef.id;
      } catch (error) {
        console.error('Error in createChatWithUid:', error);
        return null;
      }
    };

    // Initialize chat - create or find existing chat room
    useEffect(() => {
      if (!currentUser?.uid || !currentUser?.role) {
        console.error('Invalid currentUser:', currentUser);
        setLoading(false);
        return;
      }

      console.log('MessagePage useEffect triggered with:', {
        currentUser: currentUser.uid,
        role: currentUser.role,
        specificDoctorId,
        specificUserId
      });

      const initializeSpecificChat = async () => {
        try {
          setLoading(true);
          
          if (specificDoctorId && currentUser.role === 'user') {
            console.log('Initializing chat with doctor:', specificDoctorId);
            const chatId = await createOrGetChatRoom(specificDoctorId, currentUser.uid);
            console.log('Chat room result:', chatId);
            
            if (!chatId) {
              console.error('Failed to create/get chat room');
              setLoading(false);
              return;
            }
            
            setActiveChat(chatId);
            setTimeout(() => {
              const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`);
              if (chatElement) {
                chatElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
            
          } else if (specificUserId && currentUser.role === 'doctor') {
            console.log('Initializing chat with user:', specificUserId);
            const chatId = await createOrGetChatRoom(currentUser.mongoId || currentUser.uid, specificUserId);
            console.log('Chat room result:', chatId);
            
            if (!chatId) {
              console.error('Failed to create/get chat room');
              setLoading(false);
              return;
            }
            
            setActiveChat(chatId);
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error initializing specific chat:', error);
          setLoading(false);
        }
      };

      // Clean up previous subscriptions
      unsubscribeRefs.current.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      unsubscribeRefs.current = [];

      // Load chat rooms first
      loadChatRooms();
      
      // Then initialize specific chat if needed
      if (specificDoctorId || specificUserId) {
        initializeSpecificChat();
      } else {
        setLoading(false);
      }

      return () => {
        unsubscribeRefs.current.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
        unsubscribeRefs.current = [];
      };
    }, [currentUser?.uid, currentUser?.role, specificDoctorId, specificUserId]);

    // FIXED: Single query to load all relevant chat rooms
    const loadChatRooms = () => {
        if (!currentUser?.uid || !currentUser?.role) {
          console.log('Cannot load chat rooms - missing user info');
          return;
        }
      
        console.log('Loading chat rooms for:', currentUser.uid, currentUser.role);
      
        const chatsRef = collection(db, 'chats');
        
        // FIXED: Single listener for all chats where user participates
        // Use array-contains-any or combine multiple where clauses
        
        // Create a compound query to get all chats where user participates
        const userQuery = query(chatsRef, where('userId', '==', currentUser.uid));
        const doctorQuery = query(chatsRef, where('doctorId', '==', currentUser.uid));
        
        let processedChatIds = new Set(); // Prevent duplicates
        
        // Listen to chats where user is patient
        const unsubscribe1 = onSnapshot(userQuery, 
          async (snapshot) => {
            console.log('Chats where user is patient:', snapshot.docs.length);
            await processChatSnapshot(snapshot, 'user', processedChatIds);
          }, 
          (error) => {
            console.error("User chats error:", error);
          }
        );
        
        unsubscribeRefs.current.push(unsubscribe1);

        // Listen to chats where user is doctor
        const unsubscribe2 = onSnapshot(doctorQuery, 
          async (snapshot) => {
            console.log('Chats where user is doctor:', snapshot.docs.length);
            await processChatSnapshot(snapshot, 'doctor', processedChatIds);
          }, 
          (error) => {
            console.error("Doctor chats error:", error);
          }
        );
        
        unsubscribeRefs.current.push(unsubscribe2);

        // If user has mongoId, also check doctorMongoId field
        if (currentUser.mongoId) {
          const mongoQuery = query(chatsRef, where('doctorMongoId', '==', currentUser.mongoId));
          
          const unsubscribe3 = onSnapshot(mongoQuery, 
            async (snapshot) => {
              console.log('Chats where user mongoId is doctor:', snapshot.docs.length);
              await processChatSnapshot(snapshot, 'doctor', processedChatIds);
            }, 
            (error) => {
              console.error("Mongo doctor chats error:", error);
            }
          );
          
          unsubscribeRefs.current.push(unsubscribe3);
        }
      };

    // FIXED: Process chat snapshot with duplicate prevention
    const processChatSnapshot = async (snapshot, userRole, processedChatIds) => {
        try {
          const rooms = [];
          
          for (const docSnap of snapshot.docs) {
            // Skip if already processed
            if (processedChatIds.has(docSnap.id)) {
              continue;
            }
            
            const chatData = { id: docSnap.id, ...docSnap.data() };
            
            // Determine user's role and other participant
            const isUserTheDoctor = chatData.doctorId === currentUser.uid || 
                                    chatData.doctorMongoId === currentUser.mongoId;
            const isUserThePatient = chatData.userId === currentUser.uid;
            
            let actualRole, otherUserId, collectionName;
            
            if (isUserTheDoctor) {
              actualRole = 'doctor';
              otherUserId = chatData.userId;
              collectionName = 'users';
              console.log(`Chat ${chatData.id}: Current user is DOCTOR, other user is:`, otherUserId);
            } else if (isUserThePatient) {
              actualRole = 'user';
              otherUserId = chatData.doctorId;
              collectionName = 'doctors';
              console.log(`Chat ${chatData.id}: Current user is PATIENT, other user is:`, otherUserId);
            } else {
              console.warn('User not found in chat participants:', chatData);
              continue;
            }
            
            console.log(`Getting info for ${collectionName}:`, otherUserId);
            
            let otherUserInfo = await getUserInfo(otherUserId, collectionName);
            
            // Enhanced fallback logic
            if (!otherUserInfo && collectionName === 'doctors') {
              console.log('Fallback: Looking for doctor in users collection');
              otherUserInfo = await getUserInfo(otherUserId, 'users');
            }
            
            if (!otherUserInfo && collectionName === 'users') {
              console.log('Fallback: Looking for user in doctors collection');
              otherUserInfo = await getUserInfo(otherUserId, 'doctors');
            }
            
            const roomData = {
              ...chatData,
              userRole: actualRole,
              otherUser: otherUserInfo || {
                id: otherUserId,
                name: collectionName === 'doctors' ? 'Unknown Doctor' : 'Unknown User',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  collectionName === 'doctors' ? 'Unknown Doctor' : 'Unknown User'
                )}&background=random`,
                status: 'offline'
              }
            };
            
            rooms.push(roomData);
            processedChatIds.add(docSnap.id);
          }
          
          if (rooms.length > 0) {
            // FIXED: Use functional update to merge without duplicates
            setChatRooms(prevRooms => {
              const existingIds = new Set(prevRooms.map(room => room.id));
              const newRooms = rooms.filter(room => !existingIds.has(room.id));
              const updatedRooms = [...prevRooms, ...newRooms];
              
              console.log('Chat rooms updated:', updatedRooms.length);
              console.log('Room details:', updatedRooms.map(r => ({
                id: r.id,
                otherUser: r.otherUser.name,
                userRole: r.userRole
              })));
              
              return updatedRooms;
            });
          }
          
        } catch (error) {
          console.error('Error processing chat snapshot:', error);
        }
      };

    // Enhanced getUserInfo with better error handling
    const getUserInfo = async (userId, collectionName) => {
      try {
        console.log(`Fetching user info from ${collectionName} for:`, userId);
        
        const userDoc = await getDoc(doc(db, collectionName, userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(`Found user data in ${collectionName}:`, userData);
          
          const name = userData.name || 
                       (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : '') ||
                       userData.fullName || 
                       userData.displayName ||
                       (collectionName === 'doctors' ? 'Unknown Doctor' : 'Unknown User');
          
          return {
            id: userId,
            name,
            avatar: userData.profilePicture || userData.avatar || userData.profileImage || userData.photoURL ||
                   `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            status: userData.status || userData.isOnline ? 'online' : 'offline'
          };
        } else {
          console.log(`No user found in ${collectionName} for:`, userId);
          return null;
        }
      } catch (error) {
        console.error(`Error getting user info from ${collectionName}:`, error);
        return null;
      }
    };

    // Load messages for active chat
    useEffect(() => {
      if (!activeChat || !currentUser?.uid) return;

      console.log('Loading messages for chat:', activeChat);

      const chatDocRef = doc(db, 'chats', activeChat);
      
      const unsubscribe = onSnapshot(chatDocRef, async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data();
          setMessages(chatData.messages || []);
          
          // Determine other user based on chat data, not assumed role
          const isCurrentUserDoctor = chatData.doctorId === currentUser.uid || 
                                      chatData.doctorMongoId === currentUser.mongoId;
          const isCurrentUserPatient = chatData.userId === currentUser.uid;
          
          let otherUserId, collectionName;
          
          if (isCurrentUserDoctor) {
            otherUserId = chatData.userId;
            collectionName = 'users';
          } else if (isCurrentUserPatient) {
            otherUserId = chatData.doctorId;
            collectionName = 'doctors';
          }
          
          let otherUserInfo = await getUserInfo(otherUserId, collectionName);
          
          // Fallback for cross-collection lookup
          if (!otherUserInfo && collectionName === 'doctors') {
            otherUserInfo = await getUserInfo(otherUserId, 'users');
          } else if (!otherUserInfo && collectionName === 'users') {
            otherUserInfo = await getUserInfo(otherUserId, 'doctors');
          }
          
          setActiveChatData({ 
            ...chatData, 
            otherUser: otherUserInfo || {
              id: otherUserId,
              name: collectionName === 'doctors' ? 'Unknown Doctor' : 'Unknown User',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                collectionName === 'doctors' ? 'Unknown Doctor' : 'Unknown User'
              )}&background=random`,
              status: 'offline'
            }
          });
        } else {
          console.log('Chat document does not exist');
          setMessages([]);
          setActiveChatData(null);
        }
      }, (error) => {
        console.error('Error loading chat messages:', error);
      });

      unsubscribeRefs.current.push(unsubscribe);
      return () => unsubscribe();
    }, [activeChat, currentUser?.uid, currentUser?.mongoId]);

    // Auto-scroll to bottom
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message
    const sendMessage = async () => {
      if (!newMessage.trim() || !activeChat || !currentUser?.uid) return;

      try {
        const messageObj = {
          id: Date.now().toString(),
          text: newMessage.trim(),
          senderId: currentUser.uid,
          senderRole: currentUser.role,
          senderName: currentUser.name || currentUser.displayName || 
                     (currentUser.firstName && currentUser.lastName 
                       ? `${currentUser.firstName} ${currentUser.lastName}` 
                       : currentUser.role === 'doctor' ? 'Doctor' : 'User'),
          timestamp: Date.now()
        };

        await updateDoc(doc(db, 'chats', activeChat), {
          messages: arrayUnion(messageObj),
          lastMessage: newMessage.trim(),
          updatedAt: serverTimestamp()
        });

        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    // Format message time
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Filter chat rooms based on search term
    const filteredChatRooms = chatRooms.filter(room =>
      room.otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">Loading chats...</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          {onBack && (
            <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="ml-4 text-sm text-gray-500">
            Role: {currentUser?.role} | Rooms: {chatRooms.length}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-12rem)]">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={18} />
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
                {filteredChatRooms.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {chatRooms.length === 0 ? 'No conversations yet' : 'No matching conversations'}
                    <div className="text-xs mt-2">
                      Debug: User {currentUser?.uid} ({currentUser?.role})
                    </div>
                  </div>
                ) : (
                  filteredChatRooms.map((room) => (
                    <div 
                      key={room.id}
                      data-chat-id={room.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        activeChat === room.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => {
                        console.log('Switching to chat:', room.id);
                        setActiveChat(room.id);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img 
                            src={room.otherUser?.avatar} 
                            alt={room.otherUser?.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(room.otherUser?.name || 'User')}&background=random`;
                            }}
                          />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            room.otherUser?.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">
                              {room.otherUser?.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTime(room.updatedAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {room.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Chat Area */}
            {activeChat && activeChatData ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={activeChatData.otherUser?.avatar} 
                      alt={activeChatData.otherUser?.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChatData.otherUser?.name || 'User')}&background=random`;
                      }}
                    />
                    <div className="ml-3">
                      <h3 className="font-semibold">{activeChatData.otherUser?.name}</h3>
                      <div className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          activeChatData.otherUser?.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <span className="text-gray-500">
                          {activeChatData.otherUser?.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => {
                      // FIXED: Correct message alignment logic
                      const isCurrentUser = message.senderId === currentUser.uid;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                              isCurrentUser
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p
                              className={`text-xs mt-1 text-right ${
                                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      className="flex-1 mx-2 p-3 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button 
                      onClick={sendMessage}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newMessage.trim()}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Select a conversation to start messaging</p>
                  {specificDoctorId && (
                    <p className="text-sm text-gray-400">Looking for doctor: {specificDoctorId}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default MessagesPage;