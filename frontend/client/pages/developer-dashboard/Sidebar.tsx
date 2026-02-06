import {
  TrendingUp,
  Lightbulb,
  Bookmark,
  FileText,
  Shield,
  Users,
  MessageCircle,
  BarChart3,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  count: number | null;
  proposals: any[];
  collaborations: any[];
  stats: any;
  statsLoading: boolean;
  navigate: any;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  count,
  proposals,
  collaborations,
  stats,
  statsLoading,
  navigate,
}: SidebarProps) {
  const handleTabClick = (tab: string, route?: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    if (route) {
      navigate(route);
    }
  };

  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="h-full lg:h-auto overflow-y-auto bg-gray-50 lg:bg-transparent pt-6 lg:pt-0">
        <nav className="bg-white rounded-lg shadow-sm p-4">
          <div className="space-y-2">
            <NavButton
              icon={TrendingUp}
              label="Overview"
              isActive={activeTab === "overview"}
              onClick={() => handleTabClick("overview")}
            />

            <NavButton
              icon={Lightbulb}
              label="Idea Feed"
              isActive={activeTab === "feed"}
              onClick={() => handleTabClick("feed")}
              iconRotate
            />

            <NavButton
              icon={Bookmark}
              label="Bookmarked"
              isActive={activeTab === "bookmarks"}
              onClick={() => handleTabClick("bookmarks")}
              badge={count}
              iconRotate
            />

            <NavButton
              icon={FileText}
              label="Proposals"
              isActive={activeTab === "proposals"}
              onClick={() => handleTabClick("proposals")}
              badge={proposals.length > 0 ? proposals.length : undefined}
              badgeColor={proposals.length > 0 ? "red" : undefined}
            />

            <NavButton
              icon={Shield}
              label="Contracts"
              isActive={activeTab === "contracts"}
              onClick={() => handleTabClick("contracts")}
              badge={
                collaborations.filter((c: any) => !c.signed_by_developer).length > 0
                  ? collaborations.filter((c: any) => !c.signed_by_developer).length
                  : undefined
              }
              badgeColor="orange"
            />

            <NavButton
              icon={Users}
              label="Collaborations"
              isActive={activeTab === "collaborations"}
              onClick={() => handleTabClick("collaborations")}
            />

            <NavButton
              icon={MessageCircle}
              label="Messages"
              isActive={activeTab === "messages"}
              onClick={() => handleTabClick("messages", "/developer-dashboard/message")}
              badge={2}
              badgeColor="red"
              badgePulse
              iconRotate
            />

            <NavButton
              icon={BarChart3}
              label="Analytics"
              isActive={activeTab === "analytics"}
              onClick={() => handleTabClick("analytics", "/analytics")}
            />
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
            <StatItem label="Pending Proposals" value={stats?.proposals?.pending || 0} color="orange" />
            <StatItem label="Active Projects" value={stats?.collaborations?.active || 0} color="purple" />
            <StatItem label="Total Equity Earned" value={`${stats?.equity?.totalEarned || 0}%`} color="green" />
            <StatItem label="Success Rate" value={`${stats?.performance?.successRate || 0}%`} color="purple" />
            <StatItem
              label="Portfolio Value"
              value={`$${(stats?.performance?.estimatedPortfolioValue || 0).toLocaleString()}`}
              color="navy"
              border
            />
            <ProgressItem
              label="Profile Complete"
              progress={stats?.activity?.profileCompletion || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavButtonProps {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number | null;
  badgeColor?: "red" | "orange" | "blue";
  badgePulse?: boolean;
  iconRotate?: boolean;
}

function NavButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  badge,
  badgeColor = "blue",
  badgePulse,
  iconRotate,
}: NavButtonProps) {
  const badgeColors = {
    red: "bg-red-500 text-white",
    orange: "bg-orange-500 text-white",
    blue: "bg-skyblue text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 transform ${
        isActive
          ? "bg-gradient-to-r from-skyblue to-blue-600 text-white shadow-lg scale-105"
          : "text-gray-700 hover:bg-gradient-to-r hover:from-skyblue/10 hover:to-blue-50 hover:scale-102 hover:shadow-md"
      }`}
    >
      <Icon
        className={`w-5 h-5 transition-transform ${isActive ? "" : `group-hover:scale-110 ${iconRotate ? "group-hover:rotate-12" : ""}`}`}
      />
      <span className="font-medium">{label}</span>
      {badge !== undefined && badge !== null && (
        <span
          className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold ${
            isActive
              ? "bg-white/20 text-white"
              : `${badgeColors[badgeColor]} ${badgePulse ? "animate-pulse" : ""}`
          }`}
        >
          {badge}
        </span>
      )}
      {isActive && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
    </button>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
  color: string;
  border?: boolean;
}

function StatItem({ label, value, color, border }: StatItemProps) {
  const colors = {
    orange: "text-orange-600",
    purple: "text-purple-600",
    green: "text-green-600",
    navy: "text-navy",
  };

  return (
    <div className={`flex justify-between items-center ${border ? "pt-2 border-t border-gray-100" : ""}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${colors[color]}`}>{value}</span>
    </div>
  );
}

interface ProgressItemProps {
  label: string;
  progress: number;
}

function ProgressItem({ label, progress }: ProgressItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-skyblue to-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs font-semibold text-skyblue">{progress}%</span>
      </div>
    </div>
  );
}
