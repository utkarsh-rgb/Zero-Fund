import React, { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";

type Message = {
  id?: string; // optional unique id from backend
  sender_type: "entrepreneur" | "developer";
  sender_id: number;
  receiver_type: "entrepreneur" | "developer";
  receiver_id: number;
  message: string;
  timestamp?: string; // optional timestamp from backend
};

const SOCKET_URL = "http://localhost:5000";
const API_URL = "http://localhost:5000/messages";
const UNIQUE_DEVELOPERS_API = "http://localhost:5000/unique-developers";

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  type Developer = { developer_id: number; fullname: string };
  
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState<number | null>(
    null,
  );

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Get entrepreneur ID from localStorage
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const entrepreneurId = userData?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch unique developers for this entrepreneur
  useEffect(() => {
    if (!entrepreneurId) return;

  const fetchDevelopers = async () => {
  try {
    const res = await axios.get<{ developers: { developer_id: number; fullname: string }[] }>(
      `${UNIQUE_DEVELOPERS_API}?entrepreneur_id=${entrepreneurId}`
    );

    // Ensure unique developers by developer_id
    const uniqueDevsMap = new Map<number, { developer_id: number; fullname: string }>();
    res.data.developers.forEach(dev => {
      if (!uniqueDevsMap.has(dev.developer_id)) {
        uniqueDevsMap.set(dev.developer_id, dev);
      }
    });

    const uniqueDevs = Array.from(uniqueDevsMap.values());
    console.log(uniqueDevs);
    setDevelopers(uniqueDevs);

    if (uniqueDevs.length > 0) {
      setSelectedDeveloper(uniqueDevs[0].developer_id);
    }
  } catch (err) {
    console.error("Failed to fetch developers:", err);
  }
};

    fetchDevelopers();
  }, [entrepreneurId]);

  // Connect Socket.IO
  useEffect(() => {
    if (!entrepreneurId) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    // Join entrepreneur personal room
    socket.emit("join", { type: "entrepreneur", id: entrepreneurId });

    socket.on("newMessage", (msg: Message) => {
      if (
        selectedDeveloper &&
        ((msg.sender_id === selectedDeveloper &&
          msg.sender_type === "developer") ||
          (msg.receiver_id === selectedDeveloper &&
            msg.receiver_type === "developer"))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [entrepreneurId, selectedDeveloper]);

  // Fetch chat history when selectedDeveloper changes
  useEffect(() => {
    if (!selectedDeveloper || !entrepreneurId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get<Message[]>(
          `${API_URL}/entrepreneur/${entrepreneurId}/developer/${selectedDeveloper}`,
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [entrepreneurId, selectedDeveloper]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedDeveloper) return;

    const msg: Message = {
      sender_type: "entrepreneur",
      sender_id: entrepreneurId,
      receiver_type: "developer",
      receiver_id: selectedDeveloper,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    // 1️⃣ Emit via Socket.IO
    socketRef.current?.emit("sendMessage", msg);

    // 2️⃣ Save to backend
    // try {
    //   await axios.post(`${API_URL}`, msg); // your backend should accept POST /messages
    // } catch (err) {
    //   console.error("Failed to save message:", err);
    // }

    // 3️⃣ Update UI
    // setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };
function capitalizeName(name: string): string {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto my-5 h-[80vh]">
      {/* Developer list sidebar */}
      <div className="w-full md:w-64 border md:border-r border-gray-300 rounded-lg md:rounded-none bg-gray-100 p-3 overflow-y-auto">
        <h3 className="mb-3 font-semibold">💻 Developers</h3>
        {developers.length === 0 ? (
          <div className="text-gray-500">No developers found.</div>
        ) : (
          developers.map((dev) => (
            <div
              key={`dev-${dev.developer_id}`}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition 
            ${
              dev.developer_id === selectedDeveloper
                ? "bg-green-500 text-white shadow-md"
                : "bg-white text-gray-800 shadow-sm hover:bg-gray-50"
            }`}
              onClick={() => setSelectedDeveloper(dev.developer_id)}
            >
              {dev.fullname ?capitalizeName(dev.fullname): `Developer #${dev.developer_id}`}
            </div>
          ))
        )}
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col border border-gray-300 rounded-lg bg-white">
        {/* Chat header */}
  <div className="p-3 border-b border-gray-200 font-bold bg-gray-100 rounded-t-lg">
  Chat with {capitalizeName(developers.find(dev => dev.developer_id === selectedDeveloper)?.fullname || "Developer")}
</div>



        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === entrepreneurId;
            return (
              <div
                key={msg.id || `${msg.timestamp}-${idx}`}
                className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[65%] shadow 
                ${isMe ? "bg-green-500 text-white" : "bg-white text-black"}`}
                >
                  {msg.message}
                  <div
                    className={`text-[10px] mt-1 ${isMe ? "text-gray-200 text-right" : "text-gray-500 text-left"}`}
                  >
                   {msg.timestamp
  ? new Date(msg.timestamp + "Z").toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // force IST
    })
  : ""}

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

export default Messages;
