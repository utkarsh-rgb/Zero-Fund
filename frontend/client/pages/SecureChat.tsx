import React, { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import axiosLocal from "../api/axiosLocal";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Circle,
  Search,
  ArrowLeft,
} from "lucide-react";

type Message = {
  id?: number;
  sender_type: "entrepreneur" | "developer";
  sender_id: number;
  receiver_type: "entrepreneur" | "developer";
  receiver_id: number;
  message: string;
  timestamp?: string;
  is_read?: boolean;
  tempId?: string;
};

type Contact = {
  id: number;
  fullname: string;
  isOnline?: boolean;
  lastMessage?: string;
  unreadCount?: number;
};

interface SecureChatProps {
  userType: "entrepreneur" | "developer";
}

const SecureChat: React.FC<SecureChatProps> = ({ userType }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData?.id;
  const token = localStorage.getItem("jwt_token");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch contacts
  useEffect(() => {
    if (!userId) return;

    const fetchContacts = async () => {
      try {
        const endpoint = userType === "entrepreneur" ? "/unique-developers" : "/unique-entrepreneurs";
        const res = await axiosLocal.get<any>(endpoint, {
          params: userType === "entrepreneur"
            ? { entrepreneur_id: userId }
            : { developer_id: userId }
        });

        const contactsList = userType === "entrepreneur"
          ? res.data.developers || []
          : res.data.entrepreneurIds || [];

        setContacts(contactsList.map((c: any) => ({
          id: c.developer_id || c.entrepreneur_id || c,
          fullname: c.fullname || `User #${c}`,
          isOnline: false,
        })));

        if (contactsList.length > 0) {
          setSelectedContact(contactsList[0].developer_id || contactsList[0].entrepreneur_id || contactsList[0]);
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      }
    };

    fetchContacts();
  }, [userId, userType]);

  // Socket.IO connection with authentication
  useEffect(() => {
    if (!userId || !token) return;

    const socket = io("https://bd.zerofundventure.com", {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to secure chat");
      socket.emit("join", { type: userType, id: userId });
    });

    socket.on("newMessage", (msg: Message) => {
      if (
        selectedContact &&
        ((msg.sender_id === selectedContact && msg.sender_type !== userType) ||
          (msg.receiver_id === selectedContact && msg.receiver_type !== userType))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("userTyping", ({ sender_type, sender_id, isTyping: typingStatus }) => {
      if (sender_id === selectedContact && sender_type !== userType) {
        setIsTyping(typingStatus);
      }
    });

    socket.on("userOnline", ({ type, id, online }) => {
      const userId = `${type}_${id}`;
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (online) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    socket.on("messageDelivered", ({ tempId, id }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.tempId === tempId ? { ...msg, id, tempId: undefined } : msg))
      );
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, selectedContact, userType, token]);

  // Fetch chat history
  useEffect(() => {
    if (!selectedContact || !userId) return;

    const fetchMessages = async () => {
      try {
        const otherType = userType === "entrepreneur" ? "developer" : "entrepreneur";
        const res = await axiosLocal.get<Message[]>(
          `/messages/${userType}/${userId}/${otherType}/${selectedContact}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [userId, selectedContact, userType]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const tempId = `temp-${Date.now()}`;
    const otherType = userType === "entrepreneur" ? "developer" : "entrepreneur";

    const msg: Message = {
      sender_type: userType,
      sender_id: userId,
      receiver_type: otherType,
      receiver_id: selectedContact,
      message: newMessage,
      timestamp: new Date().toISOString(),
      tempId,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, msg]);

    // Emit via Socket.IO
    socketRef.current?.emit("sendMessage", msg);

    setNewMessage("");

    // Stop typing indicator
    socketRef.current?.emit("typing", {
      sender_type: userType,
      sender_id: userId,
      receiver_type: otherType,
      receiver_id: selectedContact,
      isTyping: false,
    });
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!selectedContact) return;

    const otherType = userType === "entrepreneur" ? "developer" : "entrepreneur";

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing event
    socketRef.current?.emit("typing", {
      sender_type: userType,
      sender_id: userId,
      receiver_type: otherType,
      receiver_id: selectedContact,
      isTyping: true,
    });

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", {
        sender_type: userType,
        sender_id: userId,
        receiver_type: otherType,
        receiver_id: selectedContact,
        isTyping: false,
      });
    }, 2000);
  };

  const capitalizeName = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContactData = contacts.find((c) => c.id === selectedContact);
  const otherType = userType === "entrepreneur" ? "developer" : "entrepreneur";
  const isContactOnline = onlineUsers.has(`${otherType}_${selectedContact}`);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Contacts Sidebar */}
      <div
        className={`${
          isMobileView && selectedContact ? "hidden" : "flex"
        } w-full md:w-80 bg-white border-r border-gray-200 flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-skyblue to-blue-600">
          <h2 className="text-xl font-bold text-white mb-3">
            {userType === "entrepreneur" ? "🚀 Developers" : "💡 Entrepreneurs"}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No contacts found</div>
          ) : (
            filteredContacts.map((contact) => {
              const contactOnline = onlineUsers.has(`${otherType}_${contact.id}`);
              return (
                <div
                  key={`contact-${contact.id}`}
                  className={`flex items-center p-4 cursor-pointer transition-all duration-200 border-b border-gray-100 ${
                    contact.id === selectedContact
                      ? "bg-gradient-to-r from-skyblue/10 to-blue-50 border-l-4 border-l-skyblue"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedContact(contact.id);
                    setIsMobileView(true);
                  }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-skyblue to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {contact.fullname.charAt(0).toUpperCase()}
                    </div>
                    {contactOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900">
                      {capitalizeName(contact.fullname)}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Circle
                        className={`w-2 h-2 mr-1 ${
                          contactOnline ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400"
                        }`}
                      />
                      {contactOnline ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div className={`flex-1 flex flex-col ${!selectedContact ? "hidden md:flex" : "flex"}`}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center">
                <button
                  className="md:hidden mr-3 text-gray-600"
                  onClick={() => setIsMobileView(false)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-skyblue to-blue-600 flex items-center justify-center text-white font-bold">
                    {selectedContactData?.fullname.charAt(0).toUpperCase()}
                  </div>
                  {isContactOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">
                    {selectedContactData && capitalizeName(selectedContactData.fullname)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isTyping ? (
                      <span className="text-skyblue font-medium animate-pulse">typing...</span>
                    ) : isContactOnline ? (
                      "Online"
                    ) : (
                      "Offline"
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === userId;
                const showTimestamp =
                  idx === 0 ||
                  new Date(messages[idx - 1].timestamp || "").getTime() -
                    new Date(msg.timestamp || "").getTime() >
                    300000; // 5 minutes

                return (
                  <div key={msg.id || msg.tempId || `${msg.timestamp}-${idx}`}>
                    {showTimestamp && (
                      <div className="text-center text-xs text-gray-400 my-4">
                        {msg.timestamp
                          ? new Date(msg.timestamp + "Z").toLocaleString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "Asia/Kolkata",
                            })
                          : ""}
                      </div>
                    )}
                    <div className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`group relative max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                          isMe
                            ? "bg-gradient-to-r from-skyblue to-blue-600 text-white rounded-br-sm"
                            : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
                        }`}
                      >
                        <div className="break-words">{msg.message}</div>
                        <div
                          className={`flex items-center justify-end space-x-1 text-[10px] mt-1 ${
                            isMe ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          <span>
                            {msg.timestamp
                              ? new Date(msg.timestamp + "Z").toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                  timeZone: "Asia/Kolkata",
                                })
                              : ""}
                          </span>
                          {isMe && (
                            <>
                              {msg.id ? (
                                msg.is_read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-200" />
                                ) : (
                                  <Check className="w-3 h-3 text-blue-200" />
                                )
                              ) : (
                                <Circle className="w-2 h-2 animate-pulse" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="flex items-center gap-2 p-4 bg-white border-t border-gray-200">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-skyblue focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-3 rounded-full bg-gradient-to-r from-skyblue to-blue-600 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-skyblue/20 to-blue-600/20 rounded-full flex items-center justify-center">
                <Send className="w-12 h-12 text-skyblue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Encrypted Chat
              </h3>
              <p className="text-gray-500">
                Select a contact to start a secure conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureChat;
