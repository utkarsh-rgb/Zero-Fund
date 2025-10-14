import React, { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";

type Message = {
  sender_type: "entrepreneur" | "developer";
  sender_id: number;
  receiver_type: "entrepreneur" | "developer";
  receiver_id: number;
  message: string;
  timestamp: string;
};

const SOCKET_URL = "http://51.21.211.14/api";
const API_URL = "http://51.21.211.14/api/messages";
const UNIQUE_ENTREPRENEURS_API = "http://51.21.211.14/api/unique-entrepreneurs";

const DeveloperMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [entrepreneurs, setEntrepreneurs] = useState<number[]>([]);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<number | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Get developer ID from localStorage
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const developerId = userData?.id;

const currentUserId = developerId; // Add this

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch unique entrepreneurs who sent proposals/messages to this developer
  useEffect(() => {
    
console.log(developerId);
    if (!developerId) return;
const fetchEntrepreneurs = async () => {
  try {
    const res = await axios.get<{ entrepreneurIds: number[] }>(
      `${API_URL}/unique-entrepreneurs`,
      { params: { developer_id: developerId } }
    );

    setEntrepreneurs(res.data.entrepreneurIds);

    if (res.data.entrepreneurIds.length > 0) {
      setSelectedEntrepreneur(res.data.entrepreneurIds[0]);
    }
  } catch (err) {
    console.error("Failed to fetch entrepreneurs:", err);
  }
};


    fetchEntrepreneurs();
  }, [developerId]);

  // Connect to Socket.IO
  useEffect(() => {
    if (!developerId) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    // Join developer personal room
    socket.emit("join", { type: "developer", id: developerId });

    // Listen for new messages
    socket.on("newMessage", (msg: Message) => {
      // Only show messages for selected entrepreneur
      if (
        selectedEntrepreneur &&
        ((msg.sender_id === selectedEntrepreneur && msg.sender_type === "entrepreneur") ||
          (msg.receiver_id === selectedEntrepreneur && msg.receiver_type === "entrepreneur"))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [developerId, selectedEntrepreneur]);

  // Fetch chat history with selected entrepreneur
  useEffect(() => {
    if (!selectedEntrepreneur || !developerId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get<Message[]>(
          `${API_URL}/developer/${developerId}/entrepreneur/${selectedEntrepreneur}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [developerId, selectedEntrepreneur]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedEntrepreneur) return;

    const msg: Message = {
      sender_type: "developer",
      sender_id: developerId,
      receiver_type: "entrepreneur",
      receiver_id: selectedEntrepreneur,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    socketRef.current?.emit("sendMessage", msg);
    // setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
  <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto h-[80vh]">
  {/* Entrepreneur list sidebar */}
  <div className="w-full md:w-52 border border-gray-300 rounded-lg p-3 bg-gray-50 overflow-y-auto">
    <h4 className="mb-3 font-semibold">👔 Entrepreneurs</h4>
    {entrepreneurs.length === 0 && <p className="text-sm text-gray-500">No entrepreneurs yet</p>}
    {entrepreneurs.map((entId) => (
      <div
        key={entId}
        className={`p-2.5 mb-2 rounded-md cursor-pointer transition 
          ${entId === selectedEntrepreneur 
            ? "bg-green-500 text-white shadow-md" 
            : "bg-gray-100 text-black hover:bg-gray-200"}`}
        onClick={() => setSelectedEntrepreneur(entId)}
      >
        Entrepreneur #{entId}
      </div>
    ))}
  </div>

  {/* Chat panel */}
  <div className="flex-1 flex flex-col border border-gray-300 rounded-lg bg-white">
    {/* Chat header */}
    <div className="p-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t-lg">
      Chat with Entrepreneur #{selectedEntrepreneur}
    </div>

    {/* Messages area */}
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
      {messages.map((msg, idx) => {
        const isDev = msg.sender_id === developerId;
        return (
          <div key={idx} className={`flex mb-2 ${isDev ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] break-words shadow 
                ${isDev ? "bg-green-500 text-white" : "bg-white text-black"}`}
            >
              {msg.message}
              <div className="text-[10px] mt-1 text-right text-gray-400">
                {msg.timestamp && new Date(msg.timestamp +  "Z").toLocaleTimeString([], {
                hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
                })}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>

    {/* Input box */}
    <div className="flex gap-2 p-3 border-t border-gray-200 bg-white rounded-b-lg">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="px-5 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition"
      >
        Send
      </button>
    </div>
  </div>
</div>

  );
};

export default DeveloperMessages;
