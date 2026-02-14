import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axiosLocal from "../api/axiosLocal";
import { SOCKET_URL } from "../api/axiosLocal";

interface Contract {
  id: number;
  project_title: string;
  developer_name?: string;
  entrepreneur_name?: string;
  last_message?: string;
  unread_count?: number;
}

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

export default function MessagesPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const storedUser = localStorage.getItem("userData");
  const userData: UserData | null = storedUser ? JSON.parse(storedUser) : null;
  if (!userData) return null;

  /* ── Fetch contract list ── */
  useEffect(() => {
    axiosLocal
      .get(`/messages/chat-list/${userData.id}`)
      .then((res) => setContracts(res.data.contracts))
      .catch(console.error);
  }, []);

  /* ── Load old messages + join socket room when contract selected ── */
  useEffect(() => {
    if (!selected) return;

    // Load history
    axiosLocal
      .get(`/messages/messages/${selected.id}`)
      .then((res) => {
        const normalized = res.data.map((msg: any) => ({
          id: msg.id,
          contractId: msg.contract_id,
          senderId: msg.sender_id,
          message: msg.message,
          created_at: msg.created_at,
        }));
        setMessages(normalized);
      })
      .catch(console.error);

    // Join room
    socket.emit("join_room", { contractId: String(selected.id), userId: userData.id });

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, { ...data, senderId: Number(data.senderId) }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selected]);

  /* ── Auto scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Send message ── */
  const sendMessage = () => {
    if (!message.trim() || !selected) return;
    socket.emit("send_message", {
      contractId: String(selected.id),
      senderId: userData.id,
      message,
    });
    setMessage("");
  };

  const contactName = (c: Contract) =>
    userData.userType === "entrepreneur"
      ? c.developer_name || "Developer"
      : c.entrepreneur_name || "Entrepreneur";

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    "bg-blue-100 text-blue-600",
    "bg-violet-100 text-violet-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-pink-100 text-pink-600",
    "bg-sky-100 text-sky-600",
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      {/* ─── Sidebar ─── */}
      <aside className="w-1/4 min-w-[220px] border-r border-gray-100 flex flex-col flex-shrink-0">

        <div className="px-5 pt-6 pb-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-900">Messages</h1>
          <p className="text-xs text-gray-400 mt-0.5">{contracts.length} conversations</p>
        </div>

        <div className="flex flex-col">
          {contracts.length === 0 && (
            <p className="text-xs text-gray-400 px-5 py-4">No conversations yet.</p>
          )}

          {contracts.map((contract, idx) => {
            const name = contactName(contract);
            const color = avatarColors[idx % avatarColors.length];
            const isActive = selected?.id === contract.id;

            return (
              <button
                key={contract.id}
                onClick={() => { setSelected(contract); setMessages([]); }}
                className={`flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2 ${
                  isActive
                    ? "bg-blue-50 border-l-blue-500"
                    : "border-l-transparent hover:bg-gray-50"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color}`}>
                  {getInitials(name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? "text-blue-600" : "text-gray-800"}`}>
                    {name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{contract.project_title}</p>
                </div>
                {!!contract.unread_count && (
                  <span className="text-[10px] font-bold bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                    {contract.unread_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ─── Chat Panel ─── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Empty state */}
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Select a conversation</p>
            <p className="text-xs text-gray-400">Pick a chat from the left to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold ${
                avatarColors[contracts.findIndex((c) => c.id === selected.id) % avatarColors.length]
              }`}>
                {getInitials(contactName(selected))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{contactName(selected)}</p>
                <p className="text-xs text-gray-400">{selected.project_title} · Contract #{selected.id}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-center text-xs text-gray-400 mt-8">No messages yet. Say hello!</p>
              ) : (
                messages.map((msg, index) => {
                  const mine = Number(msg.senderId) === Number(userData.id);
                  return (
                    <div key={msg.id ?? index} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        mine
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                      }`}>
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 opacity-60 text-right`}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
              <input
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="w-9 h-9 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}