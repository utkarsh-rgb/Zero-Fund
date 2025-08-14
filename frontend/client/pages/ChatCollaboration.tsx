import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Send,
  Paperclip,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Image,
  File,
  User,
  Shield,
  MessageCircle,
  MoreVertical,
  Phone,
  Video,
  Search,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "developer" | "founder";
  senderName: string;
  content: string;
  timestamp: Date;
  type: "text" | "file" | "milestone" | "contract";
  fileData?: {
    name: string;
    size: string;
    type: string;
  };
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "submitted" | "approved" | "rejected";
  submittedDate?: string;
  files?: { name: string; size: string }[];
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "founder",
    senderName: "Priya Sharma",
    content:
      "Hi! I'm excited to work with you on the AI Education Platform. Let's discuss the technical approach.",
    timestamp: new Date("2024-01-16T10:00:00"),
    type: "text",
  },
  {
    id: "2",
    sender: "developer",
    senderName: "John Developer",
    content:
      "Thank you for accepting my proposal! I've reviewed the requirements and I'm ready to start. Should we begin with the user authentication system?",
    timestamp: new Date("2024-01-16T10:15:00"),
    type: "text",
  },
  {
    id: "3",
    sender: "founder",
    senderName: "Priya Sharma",
    content:
      "Perfect! I've attached the detailed wireframes and user flow diagrams. These should help you understand the UX requirements.",
    timestamp: new Date("2024-01-16T10:30:00"),
    type: "file",
    fileData: {
      name: "UI_Wireframes_v2.fig",
      size: "3.2 MB",
      type: "Figma",
    },
  },
  {
    id: "4",
    sender: "founder",
    senderName: "Priya Sharma",
    content:
      "Also, here's the contract for our collaboration. Please review and let me know if you have any questions.",
    timestamp: new Date("2024-01-16T10:35:00"),
    type: "contract",
  },
  {
    id: "5",
    sender: "developer",
    senderName: "John Developer",
    content:
      "Great! I'll review the wireframes and contract today. I should have the authentication system milestone ready by next Friday.",
    timestamp: new Date("2024-01-16T11:00:00"),
    type: "text",
  },
];

const MOCK_MILESTONES: Milestone[] = [
  {
    id: "1",
    title: "User Authentication System",
    description:
      "Complete user registration, login, password reset functionality with email verification",
    dueDate: "2024-01-22",
    status: "submitted",
    submittedDate: "2024-01-20",
    files: [
      { name: "auth_system_demo.mp4", size: "12.5 MB" },
      { name: "authentication_code.zip", size: "2.1 MB" },
    ],
  },
  {
    id: "2",
    title: "Dashboard Interface",
    description:
      "Build responsive dashboard with student/teacher views, navigation, and basic layouts",
    dueDate: "2024-02-05",
    status: "pending",
  },
  {
    id: "3",
    title: "AI Integration Setup",
    description:
      "Set up ML model integration, API endpoints, and data processing pipeline",
    dueDate: "2024-02-20",
    status: "pending",
  },
];

const PROJECT_INFO = {
  title: "AI-Powered Education Platform",
  founderName: "Priya Sharma",
  equity: "12%",
  status: "Active",
  startDate: "2024-01-15",
  contractSigned: true,
};

export default function ChatCollaboration() {
  const [messages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [milestones] = useState<Milestone[]>(MOCK_MILESTONES);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "chat" | "files" | "contract" | "timeline"
  >("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // TODO: Send message to backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "submitted":
        return <Eye className="w-4 h-4" />;
      case "rejected":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/developer-dashboard"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Back to Dashboard</span>
              </Link>
              <span className="text-gray-400">|</span>
              <div>
                <h1 className="text-lg font-semibold text-navy">
                  {PROJECT_INFO.title}
                </h1>
                <p className="text-sm text-gray-600">
                  with {PROJECT_INFO.founderName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <p className="text-gray-500">Equity Earned</p>
                <p className="font-semibold text-skyblue">
                  {PROJECT_INFO.equity}
                </p>
              </div>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">
                  Skill Invest
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Project Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  PS
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {PROJECT_INFO.founderName}
                  </p>
                  <p className="text-sm text-gray-500">Founder</p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {PROJECT_INFO.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Started:</span>
                  <span>{PROJECT_INFO.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract:</span>
                  <span className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Signed</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>View Contract</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>

            {/* Milestone Progress */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-semibold">33%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-skyblue h-2 rounded-full"
                      style={{ width: "33%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Next Milestone:</p>
                  <p className="font-medium">Dashboard Interface</p>
                  <p className="text-xs text-gray-400">Due Feb 5, 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm flex flex-col">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 px-6 py-4">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "chat"
                      ? "border-skyblue text-skyblue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      2
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("files")}
                  className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "files"
                      ? "border-skyblue text-skyblue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4" />
                    <span>Files</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("contract")}
                  className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "contract"
                      ? "border-skyblue text-skyblue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Contract</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "timeline"
                      ? "border-skyblue text-skyblue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Timeline</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Chat Tab */}
            {activeTab === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => {
                    const isNewDay =
                      index === 0 ||
                      formatDate(message.timestamp) !==
                        formatDate(messages[index - 1].timestamp);

                    return (
                      <div key={message.id}>
                        {isNewDay && (
                          <div className="flex items-center justify-center my-4">
                            <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                        )}

                        <div
                          className={`flex ${message.sender === "developer" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md ${message.sender === "developer" ? "order-1" : "order-2"}`}
                          >
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                message.sender === "developer"
                                  ? "bg-skyblue text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {message.type === "text" && (
                                <p className="text-sm">{message.content}</p>
                              )}

                              {message.type === "file" && message.fileData && (
                                <div>
                                  <p className="text-sm mb-2">
                                    {message.content}
                                  </p>
                                  <div className="bg-white/20 rounded-lg p-3 flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                                      <File className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {message.fileData.name}
                                      </p>
                                      <p className="text-xs opacity-75">
                                        {message.fileData.type} •{" "}
                                        {message.fileData.size}
                                      </p>
                                    </div>
                                    <button className="p-1 hover:bg-white/20 rounded">
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {message.type === "contract" && (
                                <div>
                                  <p className="text-sm mb-2">
                                    {message.content}
                                  </p>
                                  <div className="bg-white/20 rounded-lg p-3 flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                                      <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        Collaboration Contract
                                      </p>
                                      <p className="text-xs opacity-75">
                                        Ready for review
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => setActiveTab("contract")}
                                      className="px-3 py-1 bg-white/30 text-xs rounded hover:bg-white/40 transition-colors"
                                    >
                                      Review
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <p
                              className={`text-xs text-gray-500 mt-1 ${
                                message.sender === "developer"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                              message.sender === "developer"
                                ? "bg-skyblue text-white order-2 ml-3"
                                : "bg-navy text-white order-1 mr-3"
                            }`}
                          >
                            {message.sender === "developer" ? "JD" : "PS"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors disabled:bg-gray-300"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* Files Tab */}
            {activeTab === "files" && (
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {messages
                    .filter((m) => m.type === "file" && m.fileData)
                    .map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-skyblue/10 rounded-lg flex items-center justify-center">
                            {message.fileData?.type === "Figma" ? (
                              <Image className="w-5 h-5 text-skyblue" />
                            ) : (
                              <File className="w-5 h-5 text-skyblue" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {message.fileData?.name}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{message.fileData?.type}</span>
                              <span>•</span>
                              <span>{message.fileData?.size}</span>
                              <span>•</span>
                              <span>Shared by {message.senderName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Contract Tab */}
            {activeTab === "contract" && (
              <div className="flex-1 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">
                    Contract Signed
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your collaboration contract was signed on{" "}
                    {PROJECT_INFO.startDate}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/contract-review"
                      className="px-6 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                    >
                      View Full Contract
                    </Link>
                    <button className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === "timeline" && (
              <div className="flex-1 p-6">
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative">
                      {index < milestones.length - 1 && (
                        <div className="absolute left-4 top-10 w-0.5 h-full bg-gray-200"></div>
                      )}

                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === "approved"
                              ? "bg-green-100"
                              : milestone.status === "submitted"
                                ? "bg-blue-100"
                                : milestone.status === "rejected"
                                  ? "bg-red-100"
                                  : "bg-gray-100"
                          }`}
                        >
                          {getMilestoneStatusIcon(milestone.status)}
                        </div>

                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">
                              {milestone.title}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getMilestoneStatusColor(milestone.status)}`}
                            >
                              {milestone.status.charAt(0).toUpperCase() +
                                milestone.status.slice(1)}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">
                            {milestone.description}
                          </p>

                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Due: {milestone.dueDate}</span>
                            {milestone.submittedDate && (
                              <span>Submitted: {milestone.submittedDate}</span>
                            )}
                          </div>

                          {milestone.files && milestone.files.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-2">
                                Submitted Files:
                              </p>
                              <div className="space-y-1">
                                {milestone.files.map((file, fileIndex) => (
                                  <div
                                    key={fileIndex}
                                    className="flex items-center space-x-2 text-xs"
                                  >
                                    <File className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-600">
                                      {file.name}
                                    </span>
                                    <span className="text-gray-400">
                                      ({file.size})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {milestone.status === "pending" && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <Link
                                to="/contribution-tracker"
                                className="inline-flex items-center space-x-1 text-skyblue hover:text-navy transition-colors text-sm"
                              >
                                <span>Submit Work</span>
                                <Send className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
