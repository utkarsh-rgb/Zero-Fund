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
  const [activeTab, setActiveTab] = useState("feed");
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

  const developer_id = userData.id;
    const navigate = useNavigate();
  useEffect(() => {
    if (activeTab !="collaborations") return;

    const fetchDeveloperCollaborations = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const developerId = userData?.id;

        if (!developerId) return;

        const response = await axios.get(
          `http://localhost:5000/developer-collaboration/${developerId}`
        );

        console.log("Developer collaborations:", response.data);
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
        const res = await axios.get(
          `http://localhost:5000/developer-dashboard/${developer_id}`,
        );
        console.log(res.data);
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
        const res = await axios.get(
          `http://localhost:5000/developer-proposals/${developer_id}`,
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
      const response = await axios.get(
        `http://localhost:5000/api/developer/${developer_id}/bookmarks/count`,
      );
      setCount(response.data.totalBookmarks);
      console.log("Total bookmarks:", response.data.totalBookmarks); // ✅ correct value
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

      await axios.post(
        "http://localhost:5000/api/developer-dashboard/bookmarks/toggle",
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
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {count}
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
      onClick={() => {
        setActiveTab("messages");
        navigate("/developer-dashboard/message");
      }}
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

                {/* <Link
                  to="/notifications"
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    5
                  </span>
                </Link> */}

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
                 
                 
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Total Equity Earned
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
  <div className="space-y-3">
    {collaborations.length === 0 ? (
      <p>No signed collaborations yet.</p>
    ) : (
      collaborations.map((c) => (
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto p-6 relative">
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
