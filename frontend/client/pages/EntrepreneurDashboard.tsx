import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosLocal from "../api/axiosLocal";
import { io } from "socket.io-client";
import Messages from "./Messages";

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
  Menu,
  X,
  BarChart3,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
interface Milestone {
  id: number;
  title: string;
  description: string;
  duration: string;
  created_at: string;
  completed?: boolean; // Indicates if the milestone is completed
}
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
  id: number;
  project_title: string;
  developer_name: string;
  status: string;
  signed_by_developer: number;
  signed_by_entrepreneur: number;
  timeline?: string;
  equity_percentage?: string;
  ip_ownership?: string;
  confidentiality?: string;
  developer_id?: number;
}
interface Contract {
  id: number;
  title?: string;
  developer_id: number;
  entrepreneur_id: number;
  signed_by_developer: number;
  signed_by_entrepreneur?: number;
}

export default function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pendingContracts, setPendingContracts] = useState([]);
const [collaboration, setCollaboration] = useState<Collaboration[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [previewLoading, setPreviewLoading] = useState(false);

  
  useEffect(() => {
    if (activeTab !== "contract") return;

    const fetchPendingContracts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const entrepreneurId = userData?.id;
        if (!entrepreneurId) return;

        const res = await axiosLocal.post<{
          success: boolean;
          contracts: Contract[];
        }>(
          "/entrepreneur/pending-contracts",
          { entrepreneurId }, // <-- passed in body
        );

        if (res.data.success) {
          console.log(res.data);
          setPendingContracts(res.data.contracts);
        }
      } catch (err) {
        console.error("Failed to fetch pending contracts:", err);
      }
    };

    fetchPendingContracts();
  }, [activeTab]);

 useEffect(() => {
  if (activeTab !== "collaboration") return;

  const fetchCollaboration = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const entrepreneurId = userData?.id;
      console.log("entrepreneurId:", entrepreneurId);
      if (!entrepreneurId) return;

      const response = await axiosLocal.get(
        `/entrepreneur-collaboration/${entrepreneurId}`
      );

      console.log("Collaboration Fetched:", response.data);

      // Only set the contracts array
      setCollaboration(response.data.contracts || []);
    } catch (err) {
      console.error("Failed to fetch signed collaborations:", err);
    }
  };

  fetchCollaboration();
}, [activeTab]);
;

  useEffect(() => {
    const checkUserAndFetchIdeas = async () => {
      // 1️⃣ Check user
      const userData = JSON.parse(localStorage.getItem("userData"));
const entrepreneurId = userData?.id;
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
           
        const response = await axiosLocal.get(
          `/entrepreneur-dashboard/${entrepreneurId}`,
        );
        console.log(response.data);
        setIdeas(response.data);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      }
    };

 
    checkUserAndFetchIdeas();
  }, [navigate]);
  const handleAcceptContract = async (contractId: number) => {
    try {
      const res = await axiosLocal.post<{ success: boolean; message?: string }>(
        "/entrepreneur-accept-contract",
        { contractId },
      );

      if (res.data.success) {
        alert("Contract accepted!");
        setPendingContracts((prev) => prev.filter((c) => c.id !== contractId));
      } else {
        alert(res.data.message || "Failed to accept contract.");
      }
    } catch (err) {
      console.error("Error accepting contract:", err);
      alert("Failed to accept contract. Try again.");
    }
  };
  const handleRejectContract = async (contractId: number) => {
    try {
      const res = await axiosLocal.post<{ success: boolean; message?: string }>(
      "/entrepreneur-reject-contract",
        { contractId },
      );

      if (res.data.success) {
        alert("Contract rejected!");

        // Remove from pending contracts
        setPendingContracts((prev) => prev.filter((c) => c.id !== contractId));

        // Optionally, if you want to keep it in the list and mark as rejected:
        // setPendingContracts((prev) =>
        //   prev.map((c) =>
        //     c.id === contractId ? { ...c, status: "rejected" } : c
        //   )
        // );
      } else {
        alert(res.data.message || "Failed to reject contract.");
      }
    } catch (err) {
      console.error("Error rejecting contract:", err);
      alert("Failed to reject contract. Try again.");
    }
  };

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
      const response = await axiosLocal.get(
        `/entrepreneur-proposals/${entrepreneurId}`,
      );
      console.log("Proposals fetched:", response.data);
      setProposals(response.data.proposals); // store in state
    } catch (error: any) {
      console.error("Failed to fetch proposals:", error);
    }
  };
  useEffect(() => {
    fetchProposals();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this idea?",
      );
      if (!confirmDelete) return;

      await axiosLocal.delete(
        `/entrepreneur-dashboard/ideas/${id}`,
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
    action: "accept" | "reject",
  ) => {
    // Determine the new status immediately for optimistic UI
    const newStatus: Proposal["status"] =
      action === "accept" ? "Accepted" : "Rejected";

    // 🔹 Optimistic update: instantly update frontend
    setProposals((prev) =>
      prev.map((p) =>
        Number(p.id) === proposalId ? { ...p, status: newStatus } : p,
      ),
    );

    try {
      // 🔹 API call to update backend
      const res = await axios.post(
        `http://localhost:5000/proposal/${proposalId}/status`,
        { action },
      );

      // Ensure the backend returns a valid status, fallback to previous if not
      const updatedStatus: Proposal["status"] =
        res.data.status === "Accepted" ||
        res.data.status === "Rejected" ||
        res.data.status === "Pending" ||
        res.data.status === "Reviewed"
          ? res.data.status
          : newStatus;

      // 🔹 Ensure frontend matches backend response
      setProposals((prev) =>
        prev.map((p) =>
          Number(p.id) === proposalId ? { ...p, status: updatedStatus } : p,
        ),
      );
    } catch (err) {
      console.error("Failed to update proposal:", err);

      // 🔹 Do not rollback to Pending, just keep the optimistic status
      // Optionally, you can show an error toast instead
    }
  };
  const capitalizeWords = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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

  // Example: 1 milestone = completed, 0 = pending
  const calculateProgress = (milestones: Milestone[] | null) => {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-skyblue text-white rounded-full shadow-lg hover:bg-navy transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="h-full lg:h-auto overflow-y-auto bg-gray-50 lg:bg-transparent pt-6 lg:pt-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab("overview");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "overview"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <TrendingUp className={`w-5 h-5 transition-transform ${activeTab === "overview" ? "" : "group-hover:scale-110"}`} />
                  <span className="font-medium">Overview</span>
                  {activeTab === "overview" && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("ideas");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "ideas"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <Lightbulb className={`w-5 h-5 transition-transform ${activeTab === "ideas" ? "" : "group-hover:scale-110 group-hover:rotate-12"}`} />
                  <span className="font-medium">My Ideas</span>
                  <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                    activeTab === "ideas" ? "bg-white/20 text-white" : "bg-skyblue text-white"
                  }`}>
                    {ideas.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("proposals");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "proposals"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <FileText className={`w-5 h-5 transition-transform ${activeTab === "proposals" ? "" : "group-hover:scale-110"}`} />
                  <span className="font-medium">Proposals</span>
                  {proposals.filter((p) => p.status === "Pending").length > 0 && (
                    <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse ${
                      activeTab === "proposals" ? "bg-white/20 text-white" : "bg-red-500 text-white"
                    }`}>
                      {proposals.filter((p) => p.status === "Pending").length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("collaboration");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "collaboration"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <Users className={`w-5 h-5 transition-transform ${activeTab === "collaboration" ? "" : "group-hover:scale-110"}`} />
                  <span className="font-medium">Collaborations</span>
                  {activeTab === "collaboration" && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("messages");
                    navigate("/entrepreneur-dashboard/message");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "messages"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <MessageCircle className={`w-5 h-5 transition-transform ${activeTab === "messages" ? "" : "group-hover:scale-110 group-hover:rotate-12"}`} />
                  <span className="font-medium">Messages</span>
                  <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse ${
                    activeTab === "messages" ? "bg-white/20 text-white" : "bg-red-500 text-white"
                  }`}>
                    3
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("analytics");
                    navigate("/analytics");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "analytics"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <BarChart3 className={`w-5 h-5 transition-transform ${activeTab === "analytics" ? "" : "group-hover:scale-110"}`} />
                  <span className="font-medium">Analytics</span>
                  {activeTab === "analytics" && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("contract");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "contract"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <FileText className={`w-5 h-5 transition-transform ${activeTab === "contract" ? "" : "group-hover:scale-110"}`} />
                  <span className="font-medium">Contracts</span>
                  {activeTab === "contract" && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
                </button>
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
                  {/* <span className="text-sm font-semibold text-green-600">
                    {collaborations.filter((c) => c.status === "Active").length}
                  </span> */}
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
          </div>

          {/* Backdrop overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

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
                <div className="flex justify-between items-center mb-8">
                  <Link
                    to="/post-idea"
                    className="group bg-gradient-to-r from-skyblue to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-semibold flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                    <span>Post New Idea</span>
                    <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                  </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <Lightbulb className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Target className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Ideas Posted</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {ideas.length}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>Active campaigns</span>
                    </div>
                  </div>

                  <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      {proposals.filter((p) => p.status === "Pending").length > 0 && (
                        <div className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                          New!
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Pending Proposals</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {proposals.filter((p) => p.status === "Pending").length}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Awaiting review</span>
                    </div>
                  </div>

                  <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Zap className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Collaborations</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {collaboration.length}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span>In progress</span>
                    </div>
                  </div>

                  <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-skyblue/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-skyblue to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <Eye className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-skyblue opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-skyblue transition-colors">
                      {ideas.reduce((sum, idea) => sum + idea.viewsCount, 0)}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>Across all ideas</span>
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
                      Active Developers
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Render contract content only when active */}
            {activeTab === "contract" && (
              <div className="p-4 space-y-4">
                {pendingContracts.length === 0 ? (
                  <p>No pending contracts from developers.</p>
                ) : (
                  pendingContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="p-3 border rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                    >
                      <div>
                        <p>
                          <strong>Contract ID:</strong> {contract.id}
                        </p>
                        <p>
                          <strong>Title:</strong>{" "}
                          {contract.project_title
                            ? capitalizeWords(contract.project_title)
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Developer:</strong>{" "}
                          {contract.developer_name
                            ? capitalizeWords(contract.developer_name)
                            : "N/A"}
                        </p>
                        <p className="mt-2 text-gray-700">
                          This contract has been signed by the developer. By
                          clicking <strong>Accept</strong>, you also agree and
                          sign the contract. After accepting, you can view the
                          details in the <strong>Collaborations</strong> tab. If
                          you click <strong>Reject</strong>, you can't undo this
                          decision.
                        </p>
                      </div>

                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                          onClick={() => handleAcceptContract(contract.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectContract(contract.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
  onClick={async () => {
  try {
    setPreviewLoading(true);

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const entrepreneurId = userData?.id;

    // Fetch ideas (each idea has attachments)
    const response = await axiosLocal.get(
      `/entrepreneur-dashboard/${entrepreneurId}`
    );

    // Get ALL attachments from ALL ideas
    const allAttachments = response.data.flatMap(
      (idea) => idea.attachments || []
    );

    if (!allAttachments.length) {
      alert("No documents available");
      setPreviewLoading(false);
      return;
    }

    // Open each attachment
    allAttachments.forEach((file) => {
      if (file.url) window.open(file.url, "_blank");
    });

    setPreviewLoading(false);
  } catch (err) {
    console.error("Preview error:", err);
    setPreviewLoading(false);
  }
}}

  className="flex items-center space-x-2 px-3 py-2 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
>
  {previewLoading ? (
    <svg
      className="animate-spin h-5 w-5 text-skyblue"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  ) : (
    <Eye className="w-5 h-5" />
  )}

  <span>{previewLoading ? "Loading..." : "Preview Attachments"}</span>
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
         {activeTab === "collaboration" && (
  <div className="space-y-3">
    {collaboration.length === 0 ? (
      <p>No signed collaborations yet.</p>
    ) : (
      collaboration.map((c) => (
        <div
          key={c.id}
          className="p-4 border rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          {/* Left: Basic info */}
          <div className="space-y-1">
            <p><strong>Contract ID:</strong> {c.id}</p>
            <p><strong>Project Title:</strong> {c.project_title || "N/A"}</p>
            <p><strong>Developer:</strong> {c.developer_name || "N/A"}</p>
            <p><strong>Timeline:</strong> {c.timeline || "N/A"}</p>
            <p><strong>Equity:</strong> {c.equity_percentage || "N/A"}</p>
            <p><strong>Status:</strong> {c.status}</p>
          </div>

          {/* Middle: Contract details */}
          <div className="space-y-1">
            <p><strong>Signed by Entrepreneur:</strong> {c.signed_by_entrepreneur ? "✅" : "❌"}</p>
            <p><strong>Signed by Developer:</strong> {c.signed_by_developer ? "✅" : "❌"}</p>
            <p><strong>IP Ownership:</strong> {c.ip_ownership || "N/A"}</p>
            <p><strong>Confidentiality:</strong> {c.confidentiality || "N/A"}</p>
          </div>

          {/* Right: Action buttons */}
          <div className="flex flex-col gap-2 mt-2 md:mt-0">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => console.log("View full contract", c)}
            >
              View Details
            </button>

            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => navigate("/entrepreneur-dashboard/message")}
            >
              Chat
            </button>
          </div>
        </div>
      ))
    )}
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

                {/* Replace the placeholder with your chat component */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[24rem] flex flex-col">
                  <Messages />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
