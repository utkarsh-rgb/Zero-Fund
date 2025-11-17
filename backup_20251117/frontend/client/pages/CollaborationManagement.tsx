import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Lightbulb,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  FileText,
  Eye,
  Settings,
  Plus,
  Star,
  MapPin,
  Pause,
  Play,
  XCircle,
  Edit,
  Download,
  Send,
} from "lucide-react";

interface Developer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  skills: string[];
  rating: number;
  isOnline: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "submitted" | "approved" | "overdue";
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
}

interface Collaboration {
  id: string;
  projectTitle: string;
  developer: Developer;
  status: "active" | "paused" | "completed" | "terminated";
  startDate: string;
  endDate?: string;
  equityAllocated: string;
  totalHours: number;
  completedHours: number;
  milestones: Milestone[];
  overallProgress: number;
  nextMeeting?: string;
  contractId: string;
  lastActivity: string;
  priority: "high" | "medium" | "low";
}

const MOCK_COLLABORATIONS: Collaboration[] = [
  {
    id: "1",
    projectTitle: "AI-Powered Education Platform",
    developer: {
      id: "dev1",
      name: "John Developer",
      avatar: "JD",
      email: "john.dev@example.com",
      skills: ["React", "Node.js", "AI/ML"],
      rating: 4.8,
      isOnline: true,
    },
    status: "active",
    startDate: "2024-01-15",
    equityAllocated: "12%",
    totalHours: 120,
    completedHours: 45,
    milestones: [
      {
        id: "m1",
        title: "User Authentication System",
        description: "Complete user registration and login functionality",
        dueDate: "2024-01-25",
        status: "approved",
        progress: 100,
        tasksCompleted: 3,
        totalTasks: 3,
      },
      {
        id: "m2",
        title: "Dashboard Interface",
        description: "Build responsive dashboard with navigation",
        dueDate: "2024-02-05",
        status: "in_progress",
        progress: 65,
        tasksCompleted: 2,
        totalTasks: 4,
      },
      {
        id: "m3",
        title: "AI Integration",
        description: "Integrate machine learning models",
        dueDate: "2024-02-20",
        status: "pending",
        progress: 0,
        tasksCompleted: 0,
        totalTasks: 5,
      },
    ],
    overallProgress: 38,
    nextMeeting: "2024-01-22T15:00:00Z",
    contractId: "contract_001",
    lastActivity: "2024-01-20T14:30:00Z",
    priority: "high",
  },
  {
    id: "2",
    projectTitle: "Sustainable Food Delivery",
    developer: {
      id: "dev2",
      name: "Sarah Chen",
      avatar: "SC",
      email: "sarah.chen@example.com",
      skills: ["Flutter", "Firebase", "UI/UX"],
      rating: 4.9,
      isOnline: false,
    },
    status: "completed",
    startDate: "2023-11-01",
    endDate: "2024-01-10",
    equityAllocated: "10%",
    totalHours: 80,
    completedHours: 85,
    milestones: [
      {
        id: "m4",
        title: "Mobile App MVP",
        description: "Core app functionality",
        dueDate: "2023-12-15",
        status: "approved",
        progress: 100,
        tasksCompleted: 4,
        totalTasks: 4,
      },
      {
        id: "m5",
        title: "Sustainability Features",
        description: "Carbon tracking and eco-metrics",
        dueDate: "2024-01-05",
        status: "approved",
        progress: 100,
        tasksCompleted: 3,
        totalTasks: 3,
      },
    ],
    overallProgress: 100,
    contractId: "contract_002",
    lastActivity: "2024-01-10T18:00:00Z",
    priority: "medium",
  },
];

export default function CollaborationManagement() {
  const [collaborations, setCollaborations] =
    useState<Collaboration[]>(MOCK_COLLABORATIONS);
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "milestones" | "team" | "documents"
  >("overview");
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      case "terminated":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const handlePauseCollaboration = (id: string) => {
    setCollaborations((prev) =>
      prev.map((collab) =>
        collab.id === id ? { ...collab, status: "paused" as const } : collab,
      ),
    );
  };

  const handleResumeCollaboration = (id: string) => {
    setCollaborations((prev) =>
      prev.map((collab) =>
        collab.id === id ? { ...collab, status: "active" as const } : collab,
      ),
    );
  };

  const handleTerminateCollaboration = () => {
    if (!selectedCollab) return;

    setCollaborations((prev) =>
      prev.map((collab) =>
        collab.id === selectedCollab.id
          ? { ...collab, status: "terminated" as const }
          : collab,
      ),
    );

    setShowTerminateModal(false);
    setSelectedCollab(null);
    setTerminationReason("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/entrepreneur-dashboard"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Back to Dashboard</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy">Zero Fund</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedCollab ? (
          <>
            {/* Overview Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-navy mb-2">
                Collaboration Management
              </h1>
              <p className="text-gray-600">
                Manage your active projects and team collaborations
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {
                        collaborations.filter((c) => c.status === "active")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {
                        collaborations.filter((c) => c.status === "completed")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-skyblue/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-skyblue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Equity</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {collaborations
                        .reduce(
                          (sum, c) => sum + parseFloat(c.equityAllocated),
                          0,
                        )
                        .toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Developers</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {collaborations.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collaborations List */}
            <div className="space-y-6">
              {collaborations.map((collaboration) => (
                <div
                  key={collaboration.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                          {collaboration.developer.avatar}
                        </div>
                        {collaboration.developer.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-navy">
                          {collaboration.projectTitle}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          with {collaboration.developer.name}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{collaboration.developer.rating}</span>
                          </div>
                          <span>
                            Started {formatDate(collaboration.startDate)}
                          </span>
                          <span>•</span>
                          <span>
                            {collaboration.completedHours}h /{" "}
                            {collaboration.totalHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(collaboration.priority)}`}
                      >
                        {collaboration.priority} priority
                      </span>
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(collaboration.status)}`}
                      >
                        {getStatusIcon(collaboration.status)}
                        <span>{collaboration.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {collaboration.developer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-skyblue/10 text-skyblue text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-semibold">
                        {collaboration.overallProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-skyblue h-3 rounded-full transition-all duration-300"
                        style={{ width: `${collaboration.overallProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Milestones Status */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Milestone Status
                    </h4>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-600">
                        {
                          collaboration.milestones.filter(
                            (m) => m.status === "approved",
                          ).length
                        }{" "}
                        completed
                      </span>
                      <span className="text-yellow-600">
                        {
                          collaboration.milestones.filter(
                            (m) => m.status === "in_progress",
                          ).length
                        }{" "}
                        in progress
                      </span>
                      <span className="text-gray-600">
                        {
                          collaboration.milestones.filter(
                            (m) => m.status === "pending",
                          ).length
                        }{" "}
                        pending
                      </span>
                    </div>
                  </div>

                  {/* Key Info */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Equity Allocated:</span>
                      <p className="font-semibold text-skyblue">
                        {collaboration.equityAllocated}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {collaboration.nextMeeting
                          ? "Next Meeting:"
                          : "Last Activity:"}
                      </span>
                      <p className="font-semibold">
                        {collaboration.nextMeeting
                          ? formatDateTime(collaboration.nextMeeting)
                          : formatDate(collaboration.lastActivity)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Contract:</span>
                      <p className="font-semibold">Signed & Active</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Link
                        to={`/entrepreneur-chat?developer=${collaboration.developer.id}`}
                        className="flex items-center space-x-2 px-3 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </Link>
                      <Link
                        to="/review-contributions"
                        className="flex items-center space-x-2 px-3 py-2 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Review Work</span>
                      </Link>
                      <button
                        onClick={() => setSelectedCollab(collaboration)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Manage</span>
                      </button>
                    </div>

                    {collaboration.status === "active" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handlePauseCollaboration(collaboration.id)
                          }
                          className="flex items-center space-x-2 px-3 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCollab(collaboration);
                            setShowTerminateModal(true);
                          }}
                          className="flex items-center space-x-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Terminate</span>
                        </button>
                      </div>
                    )}

                    {collaboration.status === "paused" && (
                      <button
                        onClick={() =>
                          handleResumeCollaboration(collaboration.id)
                        }
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Resume</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Detailed Collaboration View */
          <div>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setSelectedCollab(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Collaborations</span>
              </button>
              <div className="flex space-x-3">
                <Link
                  to={`/entrepreneur-chat?developer=${selectedCollab.developer.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Chat</span>
                </Link>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>View Contract</span>
                </button>
              </div>
            </div>

            {/* Project Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {selectedCollab.developer.avatar}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-navy mb-1">
                      {selectedCollab.projectTitle}
                    </h1>
                    <p className="text-gray-600 mb-2">
                      Collaborating with {selectedCollab.developer.name}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Started {formatDate(selectedCollab.startDate)}
                      </span>
                      <span>•</span>
                      <span>{selectedCollab.equityAllocated} equity</span>
                      <span>•</span>
                      <span>
                        {selectedCollab.completedHours}h of{" "}
                        {selectedCollab.totalHours}h completed
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedCollab.status)}`}
                >
                  {getStatusIcon(selectedCollab.status)}
                  <span>{selectedCollab.status}</span>
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <nav className="flex space-x-8">
                  {[
                    { id: "overview", label: "Overview", icon: TrendingUp },
                    { id: "milestones", label: "Milestones", icon: Calendar },
                    { id: "team", label: "Team", icon: Users },
                    { id: "documents", label: "Documents", icon: FileText },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-skyblue text-skyblue"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Progress Overview
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Overall Progress</span>
                            <span className="font-semibold">
                              {selectedCollab.overallProgress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-skyblue h-3 rounded-full"
                              style={{
                                width: `${selectedCollab.overallProgress}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Milestones:</span>
                            <p className="font-semibold">
                              {
                                selectedCollab.milestones.filter(
                                  (m) => m.status === "approved",
                                ).length
                              }{" "}
                              / {selectedCollab.milestones.length} completed
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Time Logged:</span>
                            <p className="font-semibold">
                              {selectedCollab.completedHours}h /{" "}
                              {selectedCollab.totalHours}h
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Recent Activity
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>
                            Task submitted: User Registration API (2 hours ago)
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>
                            Message sent: Progress update on dashboard (1 day
                            ago)
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>
                            Milestone approved: User Authentication (2 days ago)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "milestones" && (
                  <div className="space-y-4">
                    {selectedCollab.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {milestone.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {milestone.description}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getMilestoneStatusColor(milestone.status)}`}
                          >
                            {milestone.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                          <span>Due: {formatDate(milestone.dueDate)}</span>
                          <span>
                            {milestone.tasksCompleted} / {milestone.totalTasks}{" "}
                            tasks completed
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-skyblue h-2 rounded-full"
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "team" && (
                  <div>
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {selectedCollab.developer.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {selectedCollab.developer.name}
                        </h3>
                        <p className="text-gray-600">
                          {selectedCollab.developer.email}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>
                              {selectedCollab.developer.rating} rating
                            </span>
                          </div>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              selectedCollab.developer.isOnline
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          <span>
                            {selectedCollab.developer.isOnline
                              ? "Online"
                              : "Offline"}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/entrepreneur-chat?developer=${selectedCollab.developer.id}`}
                          className="flex items-center space-x-2 px-3 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Documents Yet
                    </h3>
                    <p className="text-gray-500">
                      Shared documents will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terminate Modal */}
      {showTerminateModal && selectedCollab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">
                Terminate Collaboration
              </h2>
              <p className="text-gray-600">
                Are you sure you want to terminate the collaboration with{" "}
                {selectedCollab.developer.name}?
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for termination
              </label>
              <textarea
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                placeholder="Please provide a reason for terminating this collaboration..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowTerminateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTerminateCollaboration}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
