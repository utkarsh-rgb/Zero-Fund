import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosLocal from "../../api/axiosLocal";
import Sidebar from "./Sidebar";
import OverviewTab from "./OverviewTab";
import IdeaFeedTab from "./IdeaFeedTab";
import BookmarksTab from "./BookmarksTab";
import ProposalsTab from "./ProposalsTab";
import ContractsTab from "./ContractsTab";
import CollaborationsTab from "./CollaborationsTab";
import MessagesTab from "./MessagesTab";
import { Idea, Proposal } from "./types";
import { Menu, X } from "lucide-react";

export default function DeveloperDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [collaborations, setCollaborations] = useState([]);
  const [collaborationsLoading, setCollaborationsLoading] = useState<boolean>(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("latest");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
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
        const response = await axiosLocal.get("/analytics/overview", {
          params: {
            userId: developer_id,
            userType: "developer",
          },
        });
        setAnalytics(response.data.stats);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    if (developer_id) {
      fetchAnalytics();
    }
  }, [developer_id]);

  useEffect(() => {
    if (activeTab !== "collaborations" && activeTab !== "contracts") return;

    const fetchDeveloperCollaborations = async () => {
      try {
        setCollaborationsLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const developerId = userData?.id;

        if (!developerId) return;

        const response = await axiosLocal.get(`/developer-collaboration/${developerId}`);
        setCollaborations(response.data.contracts || []);
      } catch (err) {
        console.error("Failed to fetch developer collaborations:", err);
      } finally {
        setCollaborationsLoading(false);
      }
    };

    fetchDeveloperCollaborations();
  }, [activeTab]);

  const openModal = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContract(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!userData?.id || userData.userType !== "developer") return;

    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await axiosLocal.get(`/developer-dashboard/${developer_id}`);

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
        const res = await axiosLocal.get(`/developer-proposals/${developer_id}`);
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
      const response = await axiosLocal.get(`/api/developer/${developer_id}/bookmarks/count`);
      setCount(response.data.totalBookmarks);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (idea: Idea) => {
    try {
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === idea.id ? { ...i, isBookmarked: !i.isBookmarked } : i
        )
      );

      const toggle = !idea.isBookmarked;

      await axiosLocal.post("/api/developer-dashboard/bookmarks/toggle", {
        developer_id: developer_id,
        idea_id: idea.id,
        toggle,
      });
      fetchBookmarkCount();
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === idea.id ? { ...i, isBookmarked: idea.isBookmarked } : i
        )
      );
    }
  };

  const sortedIdeas = [...ideas].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "equityHigh":
        return parseFloat(b.equity_offering) - parseFloat(a.equity_offering);
      case "equityLow":
        return parseFloat(a.equity_offering) - parseFloat(b.equity_offering);
      case "stage":
        return a.stage.localeCompare(b.stage);
      default:
        return 0;
    }
  });

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
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            count={count}
            proposals={proposals}
            collaborations={collaborations}
            stats={stats}
            statsLoading={statsLoading}
            navigate={navigate}
          />

          {/* Backdrop overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <OverviewTab
                analytics={analytics}
                stats={stats}
                proposals={proposals}
                ideas={ideas}
              />
            )}

            {activeTab === "feed" && (
              <IdeaFeedTab
                ideas={sortedIdeas}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                toggleBookmark={toggleBookmark}
                loading={loading}   
              />
            )}

            {activeTab === "bookmarks" && (
              <BookmarksTab ideas={ideas} toggleBookmark={toggleBookmark} />
            )}

            {activeTab === "proposals" && <ProposalsTab proposals={proposals} />}

            {activeTab === "contracts" && (
              <ContractsTab
                collaborations={collaborations}
                collaborationsLoading={collaborationsLoading}
                openModal={openModal}
                closeModal={closeModal}
                isModalOpen={isModalOpen}
                selectedContract={selectedContract}
                navigate={navigate}
              />
            )}

            {activeTab === "collaborations" && (
              <CollaborationsTab
                collaborations={collaborations}
                collaborationsLoading={collaborationsLoading}
                openModal={openModal}
                closeModal={closeModal}
                isModalOpen={isModalOpen}
                selectedContract={selectedContract}
                navigate={navigate}
              />
            )}

            {activeTab === "messages" && <MessagesTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
