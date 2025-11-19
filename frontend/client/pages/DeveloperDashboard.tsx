import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";
import {
  Code,
  Search,
  Filter,
  Bookmark,
  MessageCircle,
  FileText,
  Clock,
  Star,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Calendar,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Shield,
  Menu,
  X,
  BarChart3,
  Lightbulb,
  Plus,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";

interface Idea {
  id: string;

  title: string;
  stage: "Idea" | "MVP" | "Beta";
  fullName: string;
  founderAvatar: string;
  required_skills: string[];
  equity_offering: string;
  shortDescription: string;
  fullDescription?: string;
  isBookmarked: boolean;
  isNDA: boolean;
  created_at: string;
  hasAcceptedNDA?: boolean;
}

interface Proposal {
  id: string;
  ideaTitle: string;
  status: "Submitted" | "Accepted" | "Rejected" | "Under Review";
  equityProposed: string;
  submittedAt: string;
  founderName: string;
}

interface Collaboration {
  id: string;
  projectTitle: string;
  founderName: string;
  developerName: string,
  status: "Active" | "Completed" | "On Hold";
  progress: number;
  nextMilestone: string;
  equity: string;
}



export default function DeveloperDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [proposals, setProposals] = useState<any[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [collaborations, setCollaborations] = useState([])
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
   const [selectedContract, setSelectedContract] = useState(null); // for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const developer_id = userData.id;
    const navigate = useNavigate();

  // Fetch developer stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await axiosLocal.get(`/developer-stats/${developer_id}`);
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    if (developer_id) {
      fetchStats();
    }
  }, [developer_id]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosLocal.get("/analytics/overview");
        setAnalytics(response.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab !="collaborations") return;

    const fetchDeveloperCollaborations = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const developerId = userData?.id;

        if (!developerId) return;

        const response = await axiosLocal.get(
          `/developer-collaboration/${developerId}`
        );

        setCollaborations(response.data.contracts || []);
      } catch (err) {
        console.error("Failed to fetch developer collaborations:", err);
      }
    };

    fetchDeveloperCollaborations();
  }, [activeTab]);

   // Open modal
  const openModal = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedContract(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!userData?.id || userData.userType !== "developer") return;

    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await axiosLocal.get(
          `/developer-dashboard/${developer_id}`,
        );

        if (res.data.success) {
          const ideasWithBookmark = res.data.data.map((idea: any) => ({
            ...idea,
            isBookmarked: idea.is_bookmarked === 1,
          }));
          setIdeas(ideasWithBookmark);
        } else setError("Failed to fetch ideas");
      } catch (err) {
        setError("Server error while fetching ideas");
      } finally {
        setLoading(false);
      }
    };

    const fetchProposals = async () => {
      try {
        const res = await axiosLocal.get(
          `/developer-proposals/${developer_id}`,
        );
        setProposals(res.data.proposals || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookmarkCount();
    fetchIdeas();
    fetchProposals();
  }, [developer_id]);

  const fetchBookmarkCount = async () => {
    try {
      const response = await axiosLocal.get(
        `/api/developer/${developer_id}/bookmarks/count`,
      );
      setCount(response.data.totalBookmarks);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (idea: Idea) => {
    try {
      // Optimistic UI update
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === idea.id ? { ...i, isBookmarked: !i.isBookmarked } : i,
        ),
      );

      const toggle = !idea.isBookmarked;

      await axiosLocal.post(
        "/api/developer-dashboard/bookmarks/toggle",
        { developer_id: developer_id, idea_id: idea.id, toggle },
      );
      fetchBookmarkCount();
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      // Rollback if error
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === idea.id ? { ...i, isBookmarked: idea.isBookmarked } : i,
        ),
      );
    }
  };

  const StatusBadge = ({
    status,
  }: {
    status: "Submitted" | "Accepted" | "Rejected" | "Under Review";
  }) => {
    const colors = {
      Submitted: "bg-blue-100 text-blue-800",
      Accepted: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      "Under Review": "bg-yellow-100 text-yellow-800",
    };

    const icons = {
      Submitted: <Send className="w-3 h-3" />,
      Accepted: <CheckCircle className="w-3 h-3" />,
      Rejected: <XCircle className="w-3 h-3" />,
      "Under Review": <Clock className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}
      >
        {icons[status]}
        <span>{status}</span>
      </span>
    );
  };

  const StageBadge = ({ stage }: { stage: "Idea" | "MVP" | "Beta" }) => {
    const colors = {
      Idea: "bg-purple-100 text-purple-800",
      MVP: "bg-blue-100 text-blue-800",
      Beta: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${colors[stage]}`}
      >
        {stage}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">Zero Fund</span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Developer Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to={`/notifications/${developer_id}`}
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Link>

              <Link
                to={`/settings/${developer_id}`}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <div
                
                className="w-8 h-8 bg-skyblue rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-navy transition-colors"
              >
                Profile
              </div>
            </div>
          </div>
        </div>
      </header> */}

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
                    setActiveTab("feed");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "feed"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <Lightbulb className={`w-5 h-5 transition-transform ${activeTab === "feed" ? "" : "group-hover:scale-110 group-hover:rotate-12"}`} />
                  <span className="font-medium">Idea Feed</span>
                  {activeTab === "feed" && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("bookmarks");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "bookmarks"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <Bookmark className={`w-5 h-5 transition-transform ${activeTab === "bookmarks" ? "" : "group-hover:scale-110 group-hover:rotate-12"}`} />
                  <span className="font-medium">Bookmarked</span>
                  <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                    activeTab === "bookmarks" ? "bg-white/20 text-white" : "bg-skyblue text-white"
                  }`}>
                    {count}
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
                  {proposals.length > 0 && (
                    <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold ${
                      activeTab === "proposals" ? "bg-white/20 text-white" : "bg-red-500 text-white animate-pulse"
                    }`}>
                      {proposals.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("contracts");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "contracts"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <Shield className={`w-5 h-5 transition-transform ${activeTab === "contracts" ? "" : "group-hover:scale-110"}`} />
                  <span className="font-medium">Contracts</span>
                  {collaborations.filter((c: any) => !c.signed_by_developer).length > 0 && (
                    <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold ${
                      activeTab === "contracts" ? "bg-white/20 text-white" : "bg-orange-500 text-white animate-pulse"
                    }`}>
                      {collaborations.filter((c: any) => !c.signed_by_developer).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("collaborations");
                    setIsSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
                    activeTab === "collaborations"
                      ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <Users className={`w-5 h-5 transition-transform ${activeTab === "collaborations" ? "" : "group-hover:scale-110"}`} />
                  <span className="font-medium">Collaborations</span>
                  {activeTab === "collaborations" && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("messages");
                    navigate("/developer-dashboard/message");
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
                    2
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
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center justify-between">
                <span>Quick Stats</span>
                {statsLoading && (
                  <div className="w-4 h-4 border-2 border-skyblue border-t-transparent rounded-full animate-spin"></div>
                )}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Pending Proposals
                  </span>
                  <span className="text-sm font-semibold text-orange-600">
                    {stats?.proposals?.pending || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {stats?.collaborations?.active || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Equity Earned
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats?.equity?.totalEarned || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {stats?.performance?.successRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Portfolio Value</span>
                  <span className="text-sm font-semibold text-navy">
                    ${(stats?.performance?.estimatedPortfolioValue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Complete</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-skyblue to-green-500 transition-all duration-500"
                        style={{ width: `${stats?.activity?.profileCompletion || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-skyblue">
                      {stats?.activity?.profileCompletion || 0}%
                    </span>
                  </div>
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
                    Track your proposals, collaborations and discover new opportunities
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Target className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Proposals</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {proposals.length}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Send className="w-3 h-3 mr-1" />
                      <span>Submitted applications</span>
                    </div>
                  </div>

                  <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                      {proposals.filter((p) => p.status === "Accepted").length > 0 && (
                        <div className="bg-green-100 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                          Success!
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Accepted Proposals</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {proposals.filter((p) => p.status === "Accepted").length}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      <span>Winning bids</span>
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
                      {collaborations.filter((c) => c.status === "Active").length}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      <span>Active projects</span>
                    </div>
                  </div>

                  <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-skyblue/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-skyblue to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                        <Bookmark className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-skyblue opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Star className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Bookmarked Ideas</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-skyblue transition-colors">
                      {stats?.activity?.bookmarksCount || count || 0}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      <span>Saved opportunities</span>
                    </div>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="group bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.performance?.avgResponseTime || 0} days
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      From proposal to feedback
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Equity</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats?.equity?.totalEarned || 0}%
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Avg {stats?.equity?.avgPerProject || 0}% per project
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Ideas Viewed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.activity?.ideasViewed || 0}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Opportunities explored
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center shadow-md">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Portfolio Value</p>
                    <p className="text-2xl font-bold text-amber-600">
                      ${((stats?.performance?.estimatedPortfolioValue || 0) / 1000).toFixed(0)}k
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Estimated equity value
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
                          <div>
                            <p className="font-medium text-gray-800">
                              {proposal.ideaTitle}
                            </p>
                            <p className="text-sm text-gray-600">
                              {proposal.founderName}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              proposal.status === "Accepted"
                                ? "bg-green-100 text-green-800"
                                : proposal.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {proposal.status}
                          </span>
                        </div>
                      ))}
                      {proposals.length === 0 && (
                        <p className="text-gray-500 text-sm">No proposals yet</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-navy mb-4">
                      Available Opportunities
                    </h3>
                    <div className="space-y-4">
                      {ideas.slice(0, 3).map((idea) => (
                        <div
                          key={idea.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {idea.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Equity: {idea.equity_offering}%
                            </p>
                          </div>
                          <Link
                            to={`/idea-details/${idea.id}`}
                            className="text-skyblue hover:text-navy transition-colors text-sm font-medium"
                          >
                            View
                          </Link>
                        </div>
                      ))}
                      {ideas.length === 0 && (
                        <p className="text-gray-500 text-sm">No ideas available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Idea Feed Tab */}
            {activeTab === "feed" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-navy mb-2">
                    Startup Ideas
                  </h1>
                  <p className="text-gray-600">
                    Discover exciting startup opportunities and earn equity for
                    your contributions
                  </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search startup ideas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4" />
                      <span>Filters</span>
                    </button>
                  </div>
                </div>

                {/* Ideas Grid */}
                <div className="grid gap-6">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {idea.founderAvatar}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-navy">
                              {idea.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              by {idea.fullName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StageBadge stage={idea.stage} />
                          {idea.isNDA && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                              NDA Required
                            </span>
                          )}
                          <button
                            onClick={() => toggleBookmark(idea)}
                            className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                          >
                            <Bookmark
                              className={`w-5 h-5 ${idea.isBookmarked ? "fill-current text-skyblue" : ""}`}
                            />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {idea.isNDA && !idea.hasAcceptedNDA
                          ? idea.shortDescription
                          : idea.fullDescription || idea.shortDescription}
                      </p>

                      {idea.isNDA && !idea.hasAcceptedNDA && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2 text-orange-800">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Full details available after NDA acceptance
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Equity: {idea.equity_offering}%</span>
                          <span>
                            {new Date(idea.created_at).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/idea-details/${idea.id}`}
                            className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>
                              {idea.isNDA && !idea.hasAcceptedNDA
                                ? "Sign NDA & View"
                                : "View Details"}
                            </span>
                          </Link>
                          {(!idea.isNDA || idea.hasAcceptedNDA) && (
                            <Link
                              to={`/proposal-submit?id=${idea.id}`}
                              className="flex items-center space-x-1 px-3 py-1 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                            >
                              <Send className="w-4 h-4" />
                              <span>Apply</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === "bookmarks" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-navy mb-2">
                    Bookmarked Ideas
                  </h1>
                  <p className="text-gray-600">
                    Ideas you've saved for later review
                  </p>
                </div>

                <div className="grid gap-6">
                  {ideas
                    .filter((idea) => idea.isBookmarked)
                    .map((idea) => (
                      <div
                        key={idea.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {idea.founderAvatar}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-navy">
                                {idea.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                by {idea.fullName}
                              </p>
                            </div>
                          </div>
                          <StageBadge stage={idea.stage} />
                        </div>

                        <p className="text-gray-600 mb-4">
                          {idea.isNDA && !idea.hasAcceptedNDA
                            ? idea.shortDescription
                            : idea.fullDescription || idea.shortDescription}
                        </p>

                        {idea.isNDA && !idea.hasAcceptedNDA && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center space-x-2 text-orange-800">
                              <Shield className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Full details available after NDA acceptance
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Equity: {idea.equity_offering}
                          </span>
                          <div className="flex space-x-2">
                            <Link
                            to={`/idea-details/${idea.id}`}
                              className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>
                                {idea.isNDA && !idea.hasAcceptedNDA
                                  ? "Sign NDA & View"
                                  : "View Details"}
                              </span>
                            </Link>
                            {(!idea.isNDA || idea.hasAcceptedNDA) && (
                              <Link
                                to={`/proposal-submit?id=${idea.id}`}
                                className="flex items-center space-x-1 px-3 py-1 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                              >
                                <Send className="w-4 h-4" />
                                <span>Apply</span>
                              </Link>
                            )}
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
                    My Proposals
                  </h1>
                  <p className="text-gray-600">
                    Track the status of your submitted proposals
                  </p>
                </div>

                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-navy">
                            {proposal.ideaTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Founder: {proposal.founderName}
                          </p>
                        </div>
                        <StatusBadge status={proposal.status} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">
                            Equity Proposed:
                          </span>
                          <p className="font-semibold text-skyblue">
                            {proposal.equityProposed}%
                          </p>
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
                        <div className="sm:col-span-2 lg:col-span-1 lg:text-right">
                          <button className="flex items-center space-x-1 text-skyblue hover:text-navy transition-colors lg:ml-auto">
                            <span>View Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contracts Tab */}
            {activeTab === "contracts" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-navy mb-2">
                    Pending Contracts
                  </h1>
                  <p className="text-gray-600">
                    Review and sign contracts sent by entrepreneurs
                  </p>
                </div>

                <div className="space-y-4">
                  {collaborations.filter((c: any) => !c.signed_by_developer).length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                      <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No Pending Contracts
                      </h3>
                      <p className="text-gray-500">
                        You'll see contracts here when entrepreneurs send them
                      </p>
                    </div>
                  ) : (
                    collaborations
                      .filter((c: any) => !c.signed_by_developer)
                      .map((c: any) => (
                        <div
                          key={c.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-navy">
                                  {c.project_title || "Untitled Project"}
                                </h3>
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                  Awaiting Your Signature
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <span className="text-gray-500 text-sm">Entrepreneur:</span>
                                  <p className="font-semibold">{c.entrepreneur_name || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-sm">Equity:</span>
                                  <p className="font-semibold text-green-600">
                                    {c.equity_percentage || "N/A"}%
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-sm">Timeline:</span>
                                  <p className="font-semibold">{c.timeline || "N/A"}</p>
                                </div>
                              </div>

                              <div className="text-sm text-gray-600">
                                <p><strong>Contract ID:</strong> {c.id}</p>
                                <p><strong>Status:</strong> {c.status}</p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => navigate("/contract-review")}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                              >
                                <Shield className="w-4 h-4" />
                                <span>Review & Sign</span>
                              </button>
                              <button
                                onClick={() => openModal(c)}
                                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => navigate("/developer-dashboard/message")}
                                className="flex items-center space-x-2 px-6 py-3 border border-skyblue text-skyblue rounded-lg hover:bg-skyblue/10 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>Chat</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

           {/* Collaborations Tab */}
{activeTab === "collaborations" && (
  <div className="space-y-3">
    {collaborations.filter((c: any) => c.signed_by_developer).length === 0 ? (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Active Collaborations
        </h3>
        <p className="text-gray-500">
          Sign contracts to start collaborating
        </p>
      </div>
    ) : (
      collaborations.filter((c: any) => c.signed_by_developer).map((c: any) => (
        <div
          key={c.id}
          className="p-3 border rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
        >
          <div>
            <p><strong>Contract ID:</strong> {c.id}</p>
            <p><strong>Project Title:</strong> {c.project_title || "N/A"}</p>
            <p><strong>Entrepreneur:</strong> {c.entrepreneur_name || "N/A"}</p>
            <p><strong>Status:</strong> {c.status}</p>
          </div>

          <div className="flex flex-col gap-2 mt-2 md:mt-0">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => openModal(c)}
            >
              View Details
            </button>

            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => navigate("/developer-dashboard/message")}
            >
              Chat
            </button>
          </div>
        </div>
      ))
    )}

    {/* Contract Details Modal */}
    {isModalOpen && selectedContract && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
            onClick={closeModal}
          >
            ✕
          </button>

          <h2 className="text-xl font-semibold mb-4">Contract Details</h2>

          <div className="space-y-3">
            <p><strong>Project Title:</strong> {selectedContract.project_title}</p>
            <p><strong>Entrepreneur:</strong> {selectedContract.entrepreneur_name}</p>
            <p><strong>Developer:</strong> {selectedContract.developer_name}</p>
            <p><strong>Timeline:</strong> {selectedContract.timeline}</p>
            <p><strong>Equity:</strong> {selectedContract.equity_percentage}</p>
            <p><strong>Status:</strong> {selectedContract.status}</p>
            <p><strong>IP Ownership:</strong> {selectedContract.ip_ownership}</p>
            <p><strong>Confidentiality:</strong> {selectedContract.confidentiality}</p>
            <p><strong>Termination Clause:</strong> {selectedContract.termination_clause}</p>
            <p><strong>Dispute Resolution:</strong> {selectedContract.dispute_resolution}</p>
            <p><strong>Governing Law:</strong> {selectedContract.governing_law}</p>
            <p><strong>Support Terms:</strong> {selectedContract.support_terms}</p>
            <p><strong>Project Description:</strong> {selectedContract.project_description}</p>
            <p><strong>Scope:</strong> {selectedContract.scope}</p>

            {/* Milestones */}
            {selectedContract.milestones && (
              <div>
                <strong>Milestones:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {(() => {
                    try {
                      const milestones = JSON.parse(selectedContract.milestones);
                      return milestones.map((milestone, index) => (
                        <li key={index}>{milestone}</li>
                      ));
                    } catch {
                      return <li className="text-red-500">Invalid milestone data</li>;
                    }
                  })()}
                </ul>
              </div>
            )}

            {/* Additional Clauses */}
            {selectedContract.additional_clauses && (
              <div>
                <strong>Additional Clauses:</strong>
                <p className="mt-1">
                  {(() => {
                    try {
                      const clauses = JSON.parse(selectedContract.additional_clauses);
                      if (Array.isArray(clauses)) {
                        return clauses.join(", ");
                      }
                      if (typeof clauses === "object") {
                        return Object.values(clauses).join(", ");
                      }
                      return clauses;
                    } catch {
                      return selectedContract.additional_clauses;
                    }
                  })()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
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
                    Communicate with founders and manage your collaborations
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Messages Yet
                    </h3>
                    <p className="text-gray-500">
                      Start applying to projects to begin conversations with
                      founders
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
