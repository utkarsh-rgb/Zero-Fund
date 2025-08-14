import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Lightbulb,
  Eye,
  MessageCircle,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  LogOut,
  Edit,
  Share,
  MoreVertical,
  Calendar,
  Star,
  Shield,
  Send,
} from "lucide-react";

interface Idea {
  id: string;
  title: string;
  stage: "Idea" | "MVP" | "Beta";
  status: "Draft" | "Published" | "In Review" | "Closed";
  proposalsCount: number;
  viewsCount: number;
  equityOffered: string;
  createdAt: string;
  lastUpdated: string;
  visibility: "Public" | "Invite Only" | "NDA Required";
}

interface Proposal {
  id: string;
  ideaTitle: string;
  developerName: string;
  developerAvatar: string;
  skills: string[];
  equityRequested: string;
  proposedTimeline: string;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
  submittedAt: string;
  rating?: number;
}

interface Collaboration {
  id: string;
  projectTitle: string;
  developerName: string;
  developerAvatar: string;
  status: "Active" | "Completed" | "On Hold" | "Terminated";
  progress: number;
  nextMilestone: string;
  equityAllocated: string;
  startDate: string;
}

const MOCK_IDEAS: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Education Platform",
    stage: "Idea",
    status: "Published",
    proposalsCount: 8,
    viewsCount: 127,
    equityOffered: "10-15%",
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-16",
    visibility: "NDA Required",
  },
  {
    id: "2",
    title: "Sustainable Food Delivery App",
    stage: "MVP",
    status: "Published",
    proposalsCount: 12,
    viewsCount: 203,
    equityOffered: "8-10%",
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-16",
    visibility: "Public",
  },
  {
    id: "3",
    title: "Remote Team Collaboration Tool",
    stage: "Beta",
    status: "Draft",
    proposalsCount: 0,
    viewsCount: 0,
    equityOffered: "12-15%",
    createdAt: "2024-01-16",
    lastUpdated: "2024-01-16",
    visibility: "Invite Only",
  },
];

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "1",
    ideaTitle: "AI-Powered Education Platform",
    developerName: "John Developer",
    developerAvatar: "JD",
    skills: ["Frontend", "AI/ML", "Backend"],
    equityRequested: "12%",
    proposedTimeline: "6 months",
    status: "Pending",
    submittedAt: "2024-01-16",
    rating: 4.8,
  },
  {
    id: "2",
    ideaTitle: "Sustainable Food Delivery App",
    developerName: "Sarah Chen",
    developerAvatar: "SC",
    skills: ["Full Stack", "Mobile", "DevOps"],
    equityRequested: "10%",
    proposedTimeline: "4 months",
    status: "Reviewed",
    submittedAt: "2024-01-15",
    rating: 4.9,
  },
  {
    id: "3",
    ideaTitle: "AI-Powered Education Platform",
    developerName: "Mike Johnson",
    developerAvatar: "MJ",
    skills: ["Backend", "AI/ML"],
    equityRequested: "14%",
    proposedTimeline: "8 months",
    status: "Pending",
    submittedAt: "2024-01-14",
    rating: 4.6,
  },
];

const MOCK_COLLABORATIONS: Collaboration[] = [
  {
    id: "1",
    projectTitle: "FinTech for Rural India",
    developerName: "Vikram Singh",
    developerAvatar: "VS",
    status: "Active",
    progress: 65,
    nextMilestone: "Payment Gateway Integration",
    equityAllocated: "10%",
    startDate: "2024-01-01",
  },
  {
    id: "2",
    projectTitle: "Health Monitoring App",
    developerName: "Lisa Wang",
    developerAvatar: "LW",
    status: "Completed",
    progress: 100,
    nextMilestone: "Project Delivered",
    equityAllocated: "12%",
    startDate: "2023-11-15",
  },
];

export default function EntrepreneurDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [ideas] = useState<Idea[]>(MOCK_IDEAS);
  const [proposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [collaborations] = useState<Collaboration[]>(MOCK_COLLABORATIONS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
      case "Active":
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Draft":
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Review":
      case "Reviewed":
        return "bg-blue-100 text-blue-800";
      case "Closed":
      case "Terminated":
        return "bg-red-100 text-red-800";
      case "On Hold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Published":
      case "Active":
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "Draft":
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "In Review":
      case "Reviewed":
        return <Eye className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "NDA Required":
        return <Shield className="w-4 h-4 text-orange-600" />;
      case "Invite Only":
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <Eye className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">
                  Skill Invest
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Entrepreneur Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/post-idea"
                className="bg-skyblue text-white px-4 py-2 rounded-lg hover:bg-navy transition-colors font-semibold flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Idea</span>
              </Link>
              <Link
                to="/notifications"
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Link>
              <Link
                to="/settings"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <Link
                to="/profile"
                className="w-8 h-8 bg-skyblue rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-navy transition-colors"
              >
                PS
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "overview"
                      ? "bg-skyblue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab("ideas")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "ideas"
                      ? "bg-skyblue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Lightbulb className="w-5 h-5" />
                  <span>My Ideas</span>
                  <span className="ml-auto bg-skyblue text-white text-xs px-2 py-1 rounded-full">
                    {ideas.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("proposals")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "proposals"
                      ? "bg-skyblue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Proposals</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {proposals.filter((p) => p.status === "Pending").length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("collaborations")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "collaborations"
                      ? "bg-skyblue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Collaborations</span>
                </button>

                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "messages"
                      ? "bg-skyblue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Messages</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    3
                  </span>
                </button>

                <Link
                  to="/notifications"
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    7
                  </span>
                </Link>

                <Link
                  to="/contract-builder"
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-5 h-5" />
                  <span>Contracts</span>
                </Link>
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Pending Proposals
                  </span>
                  <span className="text-sm font-semibold text-orange-600">
                    {proposals.filter((p) => p.status === "Pending").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="text-sm font-semibold text-green-600">
                    {collaborations.filter((c) => c.status === "Active").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {ideas.reduce((sum, idea) => sum + idea.viewsCount, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-semibold text-skyblue">
                    {ideas.length > 0
                      ? Math.round((proposals.length / ideas.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-navy mb-2">
                    Dashboard Overview
                  </h1>
                  <p className="text-gray-600">
                    Manage your startup ideas and collaborate with developers
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ideas Posted</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {ideas.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Pending Proposals
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {
                            proposals.filter((p) => p.status === "Pending")
                              .length
                          }
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
                        <p className="text-sm text-gray-500">
                          Active Collaborations
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {
                            collaborations.filter((c) => c.status === "Active")
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
                        <p className="text-sm text-gray-500">Total Views</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {ideas.reduce(
                            (sum, idea) => sum + idea.viewsCount,
                            0,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-navy mb-4">
                      Recent Proposals
                    </h3>
                    <div className="space-y-4">
                      {proposals.slice(0, 3).map((proposal) => (
                        <div
                          key={proposal.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-xs">
                              {proposal.developerAvatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {proposal.developerName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {proposal.ideaTitle}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}
                          >
                            {proposal.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-navy mb-4">
                      Active Projects
                    </h3>
                    <div className="space-y-4">
                      {collaborations
                        .filter((c) => c.status === "Active")
                        .map((collab) => (
                          <div
                            key={collab.id}
                            className="p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                  {collab.developerAvatar}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {collab.projectTitle}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    with {collab.developerName}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-semibold text-skyblue">
                                {collab.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-skyblue h-2 rounded-full transition-all duration-300"
                                style={{ width: `${collab.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Ideas Tab */}
            {activeTab === "ideas" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-navy mb-2">
                      My Ideas
                    </h1>
                    <p className="text-gray-600">
                      Manage your startup ideas and track their performance
                    </p>
                  </div>
                  <Link
                    to="/post-idea"
                    className="bg-skyblue text-white px-4 py-2 rounded-lg hover:bg-navy transition-colors font-semibold flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Idea</span>
                  </Link>
                </div>

                <div className="grid gap-6">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-navy">
                              {idea.title}
                            </h3>
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(idea.status)}`}
                            >
                              {getStatusIcon(idea.status)}
                              <span>{idea.status}</span>
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {idea.stage}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center space-x-1">
                              {getVisibilityIcon(idea.visibility)}
                              <span>{idea.visibility}</span>
                            </span>
                            <span>•</span>
                            <span>Equity: {idea.equityOffered}</span>
                            <span>•</span>
                            <span>Created: {idea.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                            <Share className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-skyblue">
                            {idea.proposalsCount}
                          </p>
                          <p className="text-sm text-gray-500">Proposals</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {idea.viewsCount}
                          </p>
                          <p className="text-sm text-gray-500">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {idea.equityOffered}
                          </p>
                          <p className="text-sm text-gray-500">
                            Equity Offered
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Last updated: {idea.lastUpdated}
                        </span>
                        <div className="flex space-x-2">
                          <Link
                            to={`/manage-proposals?idea=${idea.id}`}
                            className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Proposals</span>
                          </Link>
                          <button className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proposals Tab */}
            {activeTab === "proposals" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-navy mb-2">
                    Developer Proposals
                  </h1>
                  <p className="text-gray-600">
                    Review and manage proposals from talented developers
                  </p>
                </div>

                <div className="space-y-6">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                            {proposal.developerAvatar}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-navy">
                              {proposal.developerName}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              Applied for: {proposal.ideaTitle}
                            </p>
                            <div className="flex items-center space-x-2 mb-2">
                              {proposal.rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm font-medium">
                                    {proposal.rating}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-1">
                                {proposal.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2 py-1 bg-skyblue/10 text-skyblue text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(proposal.status)}`}
                        >
                          {proposal.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">
                            Equity Requested:
                          </span>
                          <p className="font-semibold text-skyblue">
                            {proposal.equityRequested}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeline:</span>
                          <p className="font-semibold">
                            {proposal.proposedTimeline}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <p className="font-semibold">
                            {proposal.submittedAt}
                          </p>
                        </div>
                      </div>

                      {proposal.status === "Pending" && (
                        <div className="flex space-x-3">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat with Developer</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept & Proceed</span>
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                            Reject
                          </button>
                        </div>
                      )}

                      {proposal.status === "Reviewed" && (
                        <div className="flex space-x-3">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>Continue Chat</span>
                          </button>
                          <Link
                            to="/contract-builder"
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Generate Contract</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collaborations Tab */}
            {activeTab === "collaborations" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-navy mb-2">
                    Active Collaborations
                  </h1>
                  <p className="text-gray-600">
                    Manage your ongoing projects with developers
                  </p>
                </div>

                <div className="space-y-6">
                  {collaborations.map((collab) => (
                    <div
                      key={collab.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                            {collab.developerAvatar}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-navy">
                              {collab.projectTitle}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              with {collab.developerName}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Started: {collab.startDate}</span>
                              <span>•</span>
                              <span>
                                Equity Allocated: {collab.equityAllocated}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(collab.status)}`}
                        >
                          {collab.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">
                            {collab.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-skyblue h-3 rounded-full transition-all duration-300"
                            style={{ width: `${collab.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Next Milestone:</span>
                          <p className="font-semibold">
                            {collab.nextMilestone}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-semibold">{collab.status}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Link
                          to="/entrepreneur-chat"
                          className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Open Chat</span>
                        </Link>
                        <Link
                          to="/review-contributions"
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Review Work</span>
                        </Link>
                        <Link
                          to="/contract-builder"
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Contract</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-navy mb-2">
                    Messages
                  </h1>
                  <p className="text-gray-600">
                    Communicate with developers about your projects
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Messages Yet
                    </h3>
                    <p className="text-gray-500">
                      Start conversations with developers who apply to your
                      ideas
                    </p>
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
