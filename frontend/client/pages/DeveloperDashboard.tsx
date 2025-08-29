import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "lucide-react";

interface Idea {
  id: string;

  title: string;
  stage: "Idea" | "MVP" | "Beta";
  name: string;
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
  status: "Active" | "Completed" | "On Hold";
  progress: number;
  nextMilestone: string;
  equity: string;
}

// const MOCK_PROPOSALS: Proposal[] = [
//   {
//     id: "1",
//     ideaTitle: "AI-Powered Education Platform",
//     status: "Under Review",
//     equityProposed: "12%",
//     submittedAt: "2024-01-16",
//     founderName: "Priya Sharma",
//   },
//   {
//     id: "2",
//     ideaTitle: "FinTech for Rural India",
//     status: "Accepted",
//     equityProposed: "10%",
//     submittedAt: "2024-01-10",
//     founderName: "Vikram Singh",
//   },
//   {
//     id: "3",
//     ideaTitle: "Health Monitoring App",
//     status: "Rejected",
//     equityProposed: "14%",
//     submittedAt: "2024-01-08",
//     founderName: "Dr. Sarah Chen",
//   },
// ];

const MOCK_COLLABORATIONS: Collaboration[] = [
  {
    id: "1",
    projectTitle: "FinTech for Rural India",
    founderName: "Vikram Singh",
    status: "Active",
    progress: 65,
    nextMilestone: "Complete API Integration",
    equity: "10%",
  },
  {
    id: "2",
    projectTitle: "E-commerce Analytics",
    founderName: "Lisa Wang",
    status: "Completed",
    progress: 100,
    nextMilestone: "Project Delivered",
    equity: "8%",
  },
];

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (!userData?.userType) {
      navigate("/login");
      return;
    }
    if (!userData?.id) {
      navigate("/login");
      return;
    }
    if (userData.userType !== "developer") {
      navigate("/entrepreneur-dashboard");
      return;
    }

    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/developer-dashboard",
        );
        if (response.data.success) {
          setIdeas(response.data.data);
        } else {
          setError("Failed to fetch ideas");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching ideas");
      } finally {
        setLoading(false);
      }
    };

    const fetchProposals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/developer-proposals/${userData.id}`,
        );
        setProposals(response.data.proposals || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIdeas();
    //  fetchProposals();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token"); // remove stored user data
    localStorage.removeItem("userData"); // remove stored user data
    navigate("/login"); // redirect to login page
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
      {/* Header */}
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
                to="/developer-profile"
                className="w-8 h-8 bg-skyblue rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-navy transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
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
                  onClick={() => setActiveTab("feed")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "feed"
                      ? "bg-skyblue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Idea Feed</span>
                </button>

                <button
                  onClick={() => setActiveTab("bookmarks")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "bookmarks"
                      ? "bg-skyblue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  <span>Bookmarked Ideas</span>
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
                  <span>My Proposals</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {proposals.length}
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
                  <Briefcase className="w-5 h-5" />
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
                    2
                  </span>
                </button>

                <Link
                  to="/notifications"
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    5
                  </span>
                </Link>

                <Link
                  to="/contract-review"
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
                    {
                      proposals.filter((p) => p.status === "Under Review")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="text-sm font-semibold text-green-600">
                    {
                      MOCK_COLLABORATIONS.filter((c) => c.status === "Active")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Total Equity Earned
                  </span>
                  <span className="text-sm font-semibold text-skyblue">
                    {MOCK_COLLABORATIONS.reduce(
                      (total, c) =>
                        total + parseFloat(c.equity.replace("%", "")),
                      0,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {Math.round(
                      (proposals.filter((p) => p.status === "Accepted").length /
                        proposals.length) *
                        100,
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
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
                              by {idea.name}
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
                          <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                            <Bookmark
                              className={`w-5 h-5 ${
                                idea.isBookmarked
                                  ? "fill-current text-skyblue"
                                  : ""
                              }`}
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
                                by {idea.name}
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
                              to={`/idea-details?id=${idea.id}`}
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

                      <div className="grid grid-cols-3 gap-4 text-sm">
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
                        <div className="text-right">
                          <button className="flex items-center space-x-1 text-skyblue hover:text-navy transition-colors ml-auto">
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

            {/* Collaborations Tab */}
            {activeTab === "collaborations" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-navy mb-2">
                    Active Collaborations
                  </h1>
                  <p className="text-gray-600">
                    Projects you're currently working on
                  </p>
                </div>

                <div className="space-y-6">
                  {MOCK_COLLABORATIONS.map((collab) => (
                    <div
                      key={collab.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-navy">
                            {collab.projectTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            with {collab.founderName}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            collab.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : collab.status === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
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
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-skyblue h-2 rounded-full transition-all duration-300"
                            style={{ width: `${collab.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Next Milestone:</span>
                          <p className="font-semibold">
                            {collab.nextMilestone}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Equity Earned:</span>
                          <p className="font-semibold text-skyblue">
                            {collab.equity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex space-x-2 justify-end">
                            <button className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span>Chat</span>
                            </button>
                            <Link
                              to="/contract-review"
                              className="flex items-center space-x-1 px-3 py-1 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Contract</span>
                            </Link>
                            <button className="flex items-center space-x-1 px-3 py-1 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                              <FileText className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </div>
                        </div>
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
