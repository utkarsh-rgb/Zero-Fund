import { NavigateFunction } from "react-router-dom";
import {
  TrendingUp,
  Lightbulb,
  FileText,
  Shield,
  Users,
  MessageCircle,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Idea, Proposal } from "./types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsSidebarOpen: (open: boolean) => void;
  navigate: NavigateFunction;
  ideas: Idea[];
  proposals: Proposal[];
}

const NAV_ITEM_BASE =
  "group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform";
const NAV_ITEM_ACTIVE =
  "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105";
const NAV_ITEM_INACTIVE =
  "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md";

export default function Sidebar({
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
  navigate,
  ideas,
  proposals,
}: SidebarProps) {
  const go = (tab: string, path?: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    if (path) navigate(path);
  };

  const active = (tab: string) =>
    `${NAV_ITEM_BASE} ${activeTab === tab ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE}`;

  const badgeBase = "ml-auto text-xs px-2.5 py-1 rounded-full font-semibold";
  const badgeOnActive = `${badgeBase} bg-white/20 text-white`;
  const badgeOff = (color: string) => `${badgeBase} ${color} text-white`;

  return (
    <nav className="bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-2">
        {/* Overview */}
        <button onClick={() => go("overview")} className={active("overview")}>
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Overview</span>
          {activeTab === "overview" && (
            <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />
          )}
        </button>

        {/* My Ideas */}
        <button onClick={() => go("ideas")} className={active("ideas")}>
          <Lightbulb
            className={`w-5 h-5 transition-transform ${activeTab !== "ideas" ? "group-hover:rotate-12" : ""}`}
          />
          <span className="font-medium">My Ideas</span>
          <span
            className={
              activeTab === "ideas" ? badgeOnActive : badgeOff("bg-skyblue")
            }
          >
            {ideas.length}
          </span>
        </button>

        {/* Proposals */}
        <button
          onClick={() => go("proposals")}
          className={active("proposals")}
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Proposals</span>
          {proposals.filter((p) => p.status === "Pending").length > 0 && (
            <span
              className={`${badgeBase} animate-pulse ${activeTab === "proposals" ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}
            >
              {proposals.filter((p) => p.status === "Pending").length}
            </span>
          )}
        </button>

        {/* Contracts (approved) */}
        <button
          onClick={() => go("contracts")}
          className={active("contracts")}
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Contracts</span>
          {proposals.filter((p) => p.status === "Approved").length > 0 && (
            <span
              className={`${badgeBase} ${activeTab === "contracts" ? "bg-white/20 text-white" : "bg-green-500 text-white"}`}
            >
              {proposals.filter((p) => p.status === "Approved").length}
            </span>
          )}
        </button>

        {/* Collaborations */}
        <button
          onClick={() => go("collaboration")}
          className={active("collaboration")}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Collaborations</span>
          {activeTab === "collaboration" && (
            <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />
          )}
        </button>

        {/* Messages */}
        <button
          onClick={() => go("messages", "/entrepreneur-dashboard/message")}
          className={active("messages")}
        >
          <MessageCircle
            className={`w-5 h-5 transition-transform ${activeTab !== "messages" ? "group-hover:rotate-12" : ""}`}
          />
          <span className="font-medium">Messages</span>
          <span
            className={`${badgeBase} animate-pulse ${activeTab === "messages" ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}
          >
            3
          </span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => go("analytics", "/analytics")}
          className={active("analytics")}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="font-medium">Analytics</span>
          {activeTab === "analytics" && (
            <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />
          )}
        </button>

        {/* Pending Contracts (from developers) */}
        <button
          onClick={() => go("contract")}
          className={active("contract")}
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Pending Contracts</span>
          {activeTab === "contract" && (
            <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />
          )}
        </button>
      </div>
    </nav>
  );
}
