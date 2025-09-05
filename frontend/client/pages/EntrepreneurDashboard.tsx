import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

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
  Trash,
} from "lucide-react";

type Idea = {
  required_skills: any;
  attachments: any;
  id: number;
  title: string;
  stage: string;
  status: string;
  proposalsCount: number;
  viewsCount: number;
  equity_offering: string;
  created_at: string;
  lastUpdated: string;
  visibility: string;
  updated_at: string;
};
interface Proposal {
  id: string;
  ideaTitle: string;
  developerName: string;
  developerAvatar: string;
  skills: string[];
  equityRequested: string;
  timeline: string;
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [collaborations] = useState<Collaboration[]>(MOCK_COLLABORATIONS);
  const handleLogout = () => {
    localStorage.removeItem("jwt_token"); 
    localStorage.removeItem("userData"); 
    navigate("/login"); 
  };

  useEffect(() => {
    const checkUserAndFetchIdeas = async () => {
      // 1️⃣ Check user
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!userData) {
        navigate("/login");
        return;
      }

      if (userData.userType !== "entrepreneur") {
        navigate("/developer-dashboard");
        return;
      }

      // 2️⃣ Fetch ideas
      try {
        const response = await axios.get(
          "http://localhost:5000/entrepreneur-dashboard",
        );
        setIdeas(response.data);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      }
    };

    checkUserAndFetchIdeas();
  }, [navigate]);

  const fetchProposals = async () => {
    // Get entrepreneurId from localStorage here
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const entrepreneurId = userData?.id;

    if (!entrepreneurId) {
      console.error("Entrepreneur ID not found in localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/entrepreneur-proposals/${entrepreneurId}`,
      );
      console.log("Proposals fetched:", response.data);
      setProposals(response.data.proposals); // store in state
    } catch (error: any) {
      console.error("Failed to fetch proposals:", error);
    }
  };

  // Fetch proposals when component mounts
  useEffect(() => {
    fetchProposals();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this idea?",
      );
      if (!confirmDelete) return;

      await axios.delete(
        `http://localhost:5000/entrepreneur-dashboard/ideas/${id}`,
      );

      // Optionally, remove the idea from state so UI updates instantly
      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
      alert("Idea deleted successfully");
    } catch (error) {
      console.error("Error deleting idea:", error);
      alert("Failed to delete idea");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-idea/${id}`);
  };

 
  const handleProposalAction = async (
  proposalId: number,
  action: "accept" | "reject"
) => {
  // Determine the new status immediately for optimistic UI
  const newStatus: Proposal["status"] = action === "accept" ? "Accepted" : "Rejected";

  // 🔹 Optimistic update: instantly update frontend
  setProposals(prev =>
    prev.map(p =>
      Number(p.id) === proposalId ? { ...p, status: newStatus } : p
    )
  );

  try {
    // 🔹 API call to update backend
    const res = await axios.post(
      `http://localhost:5000/proposal/${proposalId}/status`,
      { action }
    );

    // Ensure the backend returns a valid status, fallback to previous if not
    const updatedStatus: Proposal["status"] =
      res.data.status === "Accepted" || res.data.status === "Rejected" ||
      res.data.status === "Pending" || res.data.status === "Reviewed"
        ? res.data.status
        : newStatus;

    // 🔹 Ensure frontend matches backend response
    setProposals(prev =>
      prev.map(p =>
        Number(p.id) === proposalId ? { ...p, status: updatedStatus } : p
      )
    );
  } catch (err) {
    console.error("Failed to update proposal:", err);

    // 🔹 Do not rollback to Pending, just keep the optimistic status
    // Optionally, you can show an error toast instead
  }
};

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
                <div>
                  <Link
                    to="/post-idea"
                    className="bg-skyblue text-white px-4 py-2 rounded-lg hover:bg-navy transition-colors font-semibold flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Idea</span>
                  </Link>
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
                              className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                idea.status || "Draft",
                              )}`}
                            >
                              {getStatusIcon(idea.status || "Draft")}
                              <span>{idea.status || "Draft"}</span>
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
                            <span>Equity: {idea.equity_offering}%</span>
                            <span>•</span>
                            <span>
                              Created:{" "}
                              {new Date(idea.updated_at).toLocaleString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",

                                  hour12: true, // optional, for AM/PM format
                                },
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(idea.id)}
                            className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(idea.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-2">
                            Skills Required
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {idea.required_skills
                              ?.flat()
                              .map((skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full max-w-[120px] truncate"
                                  title={skill} // Shows full skill name on hover
                                >
                                  {skill}
                                </span>
                              ))}
                            {!idea.required_skills?.length && (
                              <span className="text-gray-400">
                                No skills listed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {idea.attachments?.flat().length || 0}
                          </p>
                          <p className="text-sm text-gray-500">Attachments</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {idea.equity_offering}%
                          </p>
                          <p className="text-sm text-gray-500">
                            Equity Offered
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Last updated:{" "}
                          {new Date(idea.updated_at).toLocaleString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",

                            hour12: true,
                          })}
                        </span>
                        <div className="flex space-x-2">
                          {/* View Proposals */}
                          <Link
                            to={`/manage-proposals/${idea.id}`}
                            className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Proposals</span>
                          </Link>

                          {/* Preview Attachments */}
                          <button
                            onClick={() => {
                              idea.attachments
                                ?.flat()
                                .forEach((file: any) =>
                                  window.open(
                                    `http://localhost:5000/${file.path}`,
                                    "_blank",
                                  ),
                                );
                            }}
                            className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Preview Attachments</span>
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
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-navy mb-2">
                      Developer Proposals
                    </h1>
                    <p className="text-gray-600">
                      Review and manage proposals submitted for your ideas
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Total Proposals: {proposals.length}
                  </div>
                </div>

                <div className="space-y-6">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      {/* Developer Info */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                            {proposal.developerName[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-navy">
                              {proposal.developerName}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              Applied for: {proposal.ideaTitle}
                            </p>

                          
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                            proposal.status,
                          )}`}
                        >
                          {proposal.status}
                        </span>
                      </div>

                      {/* Proposal Details */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">
                            Equity Requested:
                          </span>
                          <p className="font-semibold text-skyblue">
                            {proposal.equityRequested}%
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeline:</span>
                          <p className="font-semibold">{proposal.timeline}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <p className="font-semibold">
                            {new Date(proposal.submittedAt).toLocaleString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons for Entrepreneur */}
                      {proposal.status === "Pending" && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              handleProposalAction(
                                Number(proposal.id),
                                "accept",
                              )
                            }
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() =>
                              handleProposalAction(
                                Number(proposal.id),
                                "reject",
                              )
                            }
                            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Reject
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat</span>
                          </button>
                        </div>
                      )}

                      {proposal.status === "Accepted" && (
                        <div className="flex space-x-3">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat</span>
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

                      {proposal.status === "Rejected" && (
                        <p className="text-red-500 font-medium">
                          This proposal has been rejected.
                        </p>
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
