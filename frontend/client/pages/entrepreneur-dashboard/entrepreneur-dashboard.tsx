import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import axiosLocal from "../../api/axiosLocal";

// Sub-components
import Sidebar from "./Sidebar";
import QuickStats from "./QuickStats";
import OverviewTab from "./OverviewTab";
import IdeasTab from "./IdeasTab";
import ProposalsTab from "./ProposalsTab";
import ContractsTab from "./ContractsTab";
import PendingContractsTab from "./PendingContractsTab";
import CollaborationTab from "./CollaborationTab";
import MessagesTab from "./MessagesTab";
import AttachmentPreviewModal from "./AttachmentPreviewModal";

// Types
import { Idea, Proposal, Collaboration, Contract } from "./types";

export default function EntrepreneurDashboard() {
  const navigate = useNavigate();

  // ─── UI state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIdea, setPreviewIdea] = useState<Idea | null>(null);

  // ─── Data state ────────────────────────────────────────────────────────────
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pendingContracts, setPendingContracts] = useState<Contract[]>([]);
  const [collaboration, setCollaboration] = useState<Collaboration[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const getEntrepreneurId = (): number | null => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    return userData?.id ?? null;
  };

  // ─── Effects ───────────────────────────────────────────────────────────────

  // Auth + fetch ideas
  useEffect(() => {
    const init = async () => {
      const userData = JSON.parse(localStorage.getItem("userData") || "null");
      if (!userData) { navigate("/login"); return; }
      if (userData.userType !== "entrepreneur") { navigate("/developer-dashboard"); return; }

      try {
        const res = await axiosLocal.get(`/entrepreneur-dashboard/${userData.id}`);
        setIdeas(res.data);
      } catch (err) {
        console.error("Error fetching ideas:", err);
      }
    };
    init();
  }, [navigate]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      const id = getEntrepreneurId();
      if (!id) { setStatsLoading(false); return; }
      try {
        const res = await axiosLocal.get(`/entrepreneur-stats/${id}`);
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      const id = getEntrepreneurId();
      if (!id) return;
      try {
        const res = await axiosLocal.get(`/entrepreneur-proposals/${id}`);
        setProposals(res.data.proposals);
      } catch (err) {
        console.error("Failed to fetch proposals:", err);
      }
    };
    fetchProposals();
  }, []);

  // Fetch pending contracts (only when that tab is active)
  useEffect(() => {
    if (activeTab !== "contract") return;
    const fetchPendingContracts = async () => {
      const id = getEntrepreneurId();
      if (!id) return;
      try {
        const res = await axiosLocal.post<{ success: boolean; contracts: Contract[] }>(
          "/entrepreneur/pending-contracts",
          { entrepreneurId: id }
        );
        if (res.data.success) setPendingContracts(res.data.contracts);
      } catch (err) {
        console.error("Failed to fetch pending contracts:", err);
      }
    };
    fetchPendingContracts();
  }, [activeTab]);

  // Fetch collaborations (only when that tab is active)
  useEffect(() => {
    if (activeTab !== "collaboration") return;
    const fetchCollaboration = async () => {
      const id = getEntrepreneurId();
      if (!id) return;
      try {
        const res = await axiosLocal.get(`/entrepreneur-collaboration/${id}`);
        console.log(res.data.contracts)
        setCollaboration(res.data.contracts || []);
      } catch (err) {
        console.error("Failed to fetch collaborations:", err);
      }
    };
    fetchCollaboration();
  }, [activeTab]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
    try {
      await axiosLocal.delete(`/entrepreneur-dashboard/ideas/${id}`);
      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
      alert("Idea deleted successfully");
    } catch (err) {
      console.error("Error deleting idea:", err);
      alert("Failed to delete idea");
    }
  };

  const handleEdit = (id: number) => navigate(`/edit-idea/${id}`);

  const handleProposalAction = async (
    proposalId: number,
    action: "accept" | "reject"
  ) => {
    const newStatus: Proposal["status"] = action === "accept" ? "Accepted" : "Rejected";

    // Optimistic update
    setProposals((prev) =>
      prev.map((p) => (Number(p.id) === proposalId ? { ...p, status: newStatus } : p))
    );

    try {
      const res = await axiosLocal.post(`/proposal/${proposalId}/status`, { action });
      const updatedStatus: Proposal["status"] =
        ["Accepted", "Rejected", "Pending", "Reviewed"].includes(res.data.status)
          ? res.data.status
          : newStatus;

      setProposals((prev) =>
        prev.map((p) =>
          Number(p.id) === proposalId ? { ...p, status: updatedStatus } : p
        )
      );
    } catch (err) {
      console.error("Failed to update proposal:", err);
    }
  };

  const handleAcceptContract = async (contractId: number) => {
    try {
      const res = await axiosLocal.post<{ success: boolean; message?: string }>(
        "/entrepreneur-accept-contract",
        { contractId }
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
        { contractId }
      );
      if (res.data.success) {
        alert("Contract rejected!");
        setPendingContracts((prev) => prev.filter((c) => c.id !== contractId));
      } else {
        alert(res.data.message || "Failed to reject contract.");
      }
    } catch (err) {
      console.error("Error rejecting contract:", err);
      alert("Failed to reject contract. Try again.");
    }
  };

  const updateLevel = async (ideaId: number, flag: number) => {
    try {
      const id = getEntrepreneurId();
      await axiosLocal.put("/entrepreneur/update-level/flag", {
        ideaId,
        flag,
        entrepreneurId: id,
      });
      setIdeas((prev) =>
        prev.map((idea) => (idea.id === ideaId ? { ...idea, flag } : idea))
      );
    } catch (err) {
      console.error("Failed to update idea level:", err);
      alert("Failed to update idea level");
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
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
          {/* ── Sidebar ── */}
          <div
            className={`
              fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <div className="h-full lg:h-auto overflow-y-auto bg-gray-50 lg:bg-transparent pt-6 lg:pt-0">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsSidebarOpen={setIsSidebarOpen}
                navigate={navigate}
                ideas={ideas}
                proposals={proposals}
              />
              <QuickStats stats={stats} statsLoading={statsLoading} />
            </div>
          </div>

          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* ── Main Content ── */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <OverviewTab
                stats={stats}
                statsLoading={statsLoading}
                proposals={proposals}
              />
            )}

            {activeTab === "ideas" && (
              <IdeasTab
                ideas={ideas}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                updateLevel={updateLevel}
                setPreviewIdea={setPreviewIdea}
                setIsPreviewOpen={setIsPreviewOpen}
              />
            )}

            {activeTab === "proposals" && (
              <ProposalsTab
                proposals={proposals}
                handleProposalAction={handleProposalAction}
              />
            )}

            {activeTab === "contracts" && (
              <ContractsTab proposals={proposals} />
            )}

            {activeTab === "contract" && (
              <PendingContractsTab
                pendingContracts={pendingContracts}
                handleAcceptContract={handleAcceptContract}
                handleRejectContract={handleRejectContract}
              />
            )}

            {activeTab === "collaboration" && (
              <CollaborationTab
                collaboration={collaboration}
                navigate={navigate}
              />
            )}

            {activeTab === "messages" && <MessagesTab />}
          </div>
        </div>
      </div>

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        isOpen={isPreviewOpen}
        idea={previewIdea}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
