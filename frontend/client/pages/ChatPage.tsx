import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import axiosLocal from "../api/axiosLocal"
import { SOCKET_URL } from "../api/axiosLocal";

interface Message {
  id?: number;
  contractId: string;
  senderId: number;
  message: string;
  created_at?: string;
}

interface UserData {
  id: number;
  fullName: string;
  email: string;
  userType: "entrepreneur" | "developer";
}
const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default function ChatPage() {
  const { contractId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const storedUser = localStorage.getItem("userData");
  const userData: UserData | null = storedUser
    ? JSON.parse(storedUser)
    : null;

  if (!userData) return null;

  // ============================
  // LOAD OLD MESSAGES
  // ============================
useEffect(() => {
  if (!contractId) return;

  const loadMessages = async () => {
    try {
      const res = await axiosLocal.get(`/messages/messages/${contractId}`);

      const normalized = res.data.map((msg: any) => ({
        id: msg.id,
        contractId: msg.contract_id,
        senderId: msg.sender_id,
        message: msg.message,
        created_at: msg.created_at,
      }));

      setMessages(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  loadMessages();
}, [contractId]);

  // ============================
  // JOIN ROOM
  // ============================
  useEffect(() => {
    if (!contractId) return;

    socket.emit("join_room", {
      contractId,
      userId: userData.id,
    });

socket.on("receive_message", (data: Message) => {
  setMessages((prev) => [
    ...prev,
    {
      ...data,
      senderId: Number(data.senderId),
    },
  ]);
});

    return () => {
      socket.off("receive_message");
    };
  }, [contractId, userData.id]);

  // ============================
  // AUTO SCROLL
  // ============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============================
  // SEND MESSAGE
  // ============================
  const sendMessage = () => {
    if (!message.trim() || !contractId) return;

    socket.emit("send_message", {
      contractId,
      senderId: userData.id,
      message,
    });

    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white shadow-sm border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Contract Chat #{contractId}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-md px-4 py-2 rounded-2xl text-sm ${
              
              Number(msg.senderId) === Number(userData.id)

                ? "ml-auto bg-blue-600 text-white"
                : "bg-white border text-gray-800"
            }`}
          >
            <p>{msg.message}</p>
            <p className="text-xs mt-1 opacity-70 text-right">
              {msg.created_at
                ? new Date(msg.created_at).toLocaleTimeString()
                : ""}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
