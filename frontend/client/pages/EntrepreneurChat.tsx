import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Lightbulb,
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
  Star,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "entrepreneur" | "developer";
  senderName: string;
  content: string;
  timestamp: Date;
  type: "text" | "file" | "proposal_update" | "contract_status";
  fileData?: {
    name: string;
    size: string;
    type: string;
  };
  metadata?: any;
}

interface Developer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  location: string;
  timezone: string;
  rating: number;
  completedProjects: number;
  skills: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  isVerified: boolean;
  responseTime: string;
  isOnline: boolean;
  lastSeen?: string;
}

const MOCK_DEVELOPER: Developer = {
  id: "dev1",
  name: "John Developer",
  avatar: "JD",
  email: "john.dev@example.com",
  location: "Mumbai, India",
  timezone: "UTC+5:30",
  rating: 4.8,
  completedProjects: 12,
  skills: ["React", "Node.js", "Python", "AI/ML"],
  github: "https://github.com/johndev",
  linkedin: "https://linkedin.com/in/johndev",
  portfolio: "https://johndev.com",
  isVerified: true,
  responseTime: "< 2 hours",
  isOnline: true,
};

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "developer",
    senderName: "John Developer",
    content:
      "Hi! Thank you for considering my proposal for the AI Education Platform. I'm excited about the potential of this project and would love to discuss the technical approach in more detail.",
    timestamp: new Date("2024-01-16T10:00:00"),
    type: "text",
  },
  {
    id: "2",
    sender: "entrepreneur",
    senderName: "Priya Sharma",
    content:
      "Hello John! I reviewed your proposal and I'm impressed with your background. I have a few questions about the AI integration approach. How do you plan to handle personalized learning algorithms?",
    timestamp: new Date("2024-01-16T10:15:00"),
    type: "text",
  },
  {
    id: "3",
    sender: "developer",
    senderName: "John Developer",
    content:
      "Great question! I'm planning to use a hybrid approach combining collaborative filtering and content-based recommendations. I've attached a technical document outlining my proposed architecture.",
    timestamp: new Date("2024-01-16T10:30:00"),
    type: "file",
    fileData: {
      name: "AI_Architecture_Proposal.pdf",
      size: "1.8 MB",
      type: "PDF",
    },
  },
  {
    id: "4",
    sender: "entrepreneur",
    senderName: "Priya Sharma",
    content:
      "This looks comprehensive! I particularly like your approach to data privacy and GDPR compliance. Can we schedule a video call to discuss the timeline in more detail?",
    timestamp: new Date("2024-01-16T11:00:00"),
    type: "text",
  },
  {
    id: "5",
    sender: "developer",
    senderName: "John Developer",
    content:
      "Absolutely! I'm available for a call this week. I'm also updating my proposal based on our discussion to include some additional features we talked about.",
    timestamp: new Date("2024-01-16T11:15:00"),
    type: "proposal_update",
    metadata: {
      status: "updated",
      changes: "Added privacy compliance features and detailed timeline",
    },
  },
];

const PROJECT_INFO = {
  title: "AI-Powered Education Platform",
  stage: "Idea",
  equityOffered: "10-15%",
  status: "Under Discussion",
};

export default function EntrepreneurChat() {
  const [messages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [developer] = useState<Developer>(MOCK_DEVELOPER);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "chat" | "proposal" | "files" | "profile"
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

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "image":
      case "png":
      case "jpg":
      case "jpeg":
        return <Image className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
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
                to="/manage-proposals"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Back to Proposals</span>
              </Link>
              <span className="text-gray-400">|</span>
              <div>
                <h1 className="text-lg font-semibold text-navy">
                  Chat with {developer.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Discussing: {PROJECT_INFO.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <p className="text-gray-500">Project Status</p>
                <p className="font-semibold text-skyblue">
                  {PROJECT_INFO.status}
                </p>
              </div>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">
                  Zero Fund
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Developer Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                    {developer.avatar}
                  </div>
                  {developer.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {developer.isVerified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {developer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {developer.isOnline
                      ? "Online"
                      : `Last seen: ${developer.lastSeen}`}
                  </p>
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
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{developer.rating} rating</span>
                  <span className="text-gray-500">
                    ({developer.completedProjects} projects)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{developer.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Responds {developer.responseTime}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {developer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-skyblue/10 text-skyblue text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Links</h4>
                <div className="space-y-2">
                  {developer.github && (
                    <a
                      href={developer.github}
                      className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {developer.linkedin && (
                    <a
                      href={developer.linkedin}
                      className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {developer.portfolio && (
                    <a
                      href={developer.portfolio}
                      className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Project Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Title:</span>
                  <p className="font-medium">{PROJECT_INFO.title}</p>
                </div>
                <div>
                  <span className="text-gray-500">Stage:</span>
                  <p className="font-medium">{PROJECT_INFO.stage}</p>
                </div>
                <div>
                  <span className="text-gray-500">Equity Offered:</span>
                  <p className="font-medium text-skyblue">
                    {PROJECT_INFO.equityOffered}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  to="/contract-builder"
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Contract</span>
                </Link>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Send NDA</span>
                </button>
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
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("proposal")}
                  className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "proposal"
                      ? "border-skyblue text-skyblue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Proposal</span>
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
                  onClick={() => setActiveTab("profile")}
                  className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "profile"
                      ? "border-skyblue text-skyblue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
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
                          className={`flex ${message.sender === "entrepreneur" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md ${message.sender === "entrepreneur" ? "order-1" : "order-2"}`}
                          >
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                message.sender === "entrepreneur"
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
                                      {getFileIcon(message.fileData.type)}
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

                              {message.type === "proposal_update" && (
                                <div>
                                  <p className="text-sm mb-2">
                                    {message.content}
                                  </p>
                                  <div className="bg-white/20 rounded-lg p-3">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <FileText className="w-4 h-4" />
                                      <span className="text-sm font-medium">
                                        Proposal Updated
                                      </span>
                                    </div>
                                    <p className="text-xs opacity-75">
                                      {message.metadata?.changes}
                                    </p>
                                    <button
                                      onClick={() => setActiveTab("proposal")}
                                      className="mt-2 px-3 py-1 bg-white/30 text-xs rounded hover:bg-white/40 transition-colors"
                                    >
                                      View Changes
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <p
                              className={`text-xs text-gray-500 mt-1 ${
                                message.sender === "entrepreneur"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                              message.sender === "entrepreneur"
                                ? "bg-skyblue text-white order-2 ml-3"
                                : "bg-navy text-white order-1 mr-3"
                            }`}
                          >
                            {message.sender === "entrepreneur" ? "PS" : "JD"}
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

            {/* Proposal Tab */}
            {activeTab === "proposal" && (
              <div className="flex-1 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-skyblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-skyblue" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">
                    Developer Proposal
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Review the detailed proposal from {developer.name}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/manage-proposals"
                      className="px-6 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                    >
                      View Full Proposal
                    </Link>
                    <Link
                      to="/contract-builder"
                      className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Generate Contract
                    </Link>
                  </div>
                </div>
              </div>
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
                            {getFileIcon(message.fileData?.type || "")}
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

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="flex-1 p-6">
                <div className="max-w-2xl">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-xl">
                        {developer.avatar}
                      </div>
                      {developer.isVerified && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-navy mb-1">
                        {developer.name}
                      </h2>
                      <p className="text-gray-600 mb-2">{developer.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>
                            {developer.rating} ({developer.completedProjects}{" "}
                            projects)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{developer.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Skills & Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {developer.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-skyblue/10 text-skyblue rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Contact & Links
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-500">Timezone:</span>{" "}
                          {developer.timezone}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Response Time:</span>{" "}
                          {developer.responseTime}
                        </p>
                        <div className="space-y-1">
                          {developer.github && (
                            <a
                              href={developer.github}
                              className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors text-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="w-4 h-4" />
                              <span>GitHub Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {developer.linkedin && (
                            <a
                              href={developer.linkedin}
                              className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors text-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="w-4 h-4" />
                              <span>LinkedIn Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {developer.portfolio && (
                            <a
                              href={developer.portfolio}
                              className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors text-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Portfolio Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
