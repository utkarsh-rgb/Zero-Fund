import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  Users,
  Bookmark,
  Send,
  Star,
  Briefcase,
  Target,
  Zap,
  Sparkles,
  Clock,
  TrendingUp,
  Eye,
  BarChart3,
} from "lucide-react";

interface OverviewTabProps {
  analytics: any;
  stats: any;
  proposals: any[];
  ideas: any[];
}

export default function OverviewTab({ analytics, stats, proposals, ideas }: OverviewTabProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">
          Track your proposals, collaborations and discover new opportunities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FileText}
          title="Total Proposals"
          value={analytics?.totalProposals ?? 0}
          subtitle="Submitted applications"
          color="blue"
          iconBadge={Target}
          subIcon={Send}
        />

        <StatCard
          icon={CheckCircle}
          title="Accepted Proposals"
          value={analytics?.acceptedProposals ?? 0}
          subtitle="Winning bids"
          color="green"
          badge={analytics?.acceptedProposals > 0 ? "Success!" : undefined}
          subIcon={Star}
        />

        <StatCard
          icon={Users}
          title="Active Collaborations"
          value={analytics?.activeCollaborations ?? 0}
          subtitle="Active projects"
          color="purple"
          iconBadge={Zap}
          subIcon={Briefcase}
        />

        <StatCard
          icon={Bookmark}
          title="Bookmarked Ideas"
          value={analytics?.bookmarkedIdeas ?? 0}
          subtitle="Saved opportunities"
          color="skyblue"
          iconBadge={Star}
          subIcon={Sparkles}
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MiniStatCard
          icon={Clock}
          title="Avg Response Time"
          value={`${stats?.performance?.avgResponseTime || 0} days`}
          subtitle="From proposal to feedback"
          gradient="from-orange-50 to-white"
          iconBg="bg-orange-500"
          border="border-orange-100"
        />

        <MiniStatCard
          icon={TrendingUp}
          title="Total Equity"
          value={`${stats?.equity?.totalEarned || 0}%`}
          subtitle={`Avg ${stats?.equity?.avgPerProject || 0}% per project`}
          gradient="from-green-50 to-white"
          iconBg="bg-green-500"
          border="border-green-100"
          valueColor="text-green-600"
        />

        <MiniStatCard
          icon={Eye}
          title="Ideas Viewed"
          value={stats?.activity?.ideasViewed || 0}
          subtitle="Opportunities explored"
          gradient="from-indigo-50 to-white"
          iconBg="bg-indigo-500"
          border="border-indigo-100"
        />

        <MiniStatCard
          icon={BarChart3}
          title="Portfolio Value"
          value={`$${((stats?.performance?.estimatedPortfolioValue || 0) / 1000).toFixed(0)}k`}
          subtitle="Estimated equity value"
          gradient="from-amber-50 to-white"
          iconBg="bg-amber-500"
          border="border-amber-100"
          valueColor="text-amber-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Recent Proposals</h3>
          <div className="space-y-4">
            {proposals.slice(0, 3).map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{proposal.ideaTitle}</p>
                  <p className="text-sm text-gray-600">{proposal.founderName}</p>
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
            {proposals.length === 0 && <p className="text-gray-500 text-sm">No proposals yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Available Opportunities</h3>
          <div className="space-y-4">
            {ideas.slice(0, 3).map((idea) => (
              <div
                key={idea.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{idea.title}</p>
                  <p className="text-sm text-gray-600">Equity: {idea.equity_offering}%</p>
                </div>
                <Link
                  to={`/idea-details/${idea.id}`}
                  className="text-skyblue hover:text-navy transition-colors text-sm font-medium"
                >
                  View
                </Link>
              </div>
            ))}
            {ideas.length === 0 && <p className="text-gray-500 text-sm">No ideas available</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: any;
  title: string;
  value: number;
  subtitle: string;
  color: string;
  badge?: string;
  iconBadge?: any;
  subIcon: any;
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  badge,
  iconBadge: IconBadge,
  subIcon: SubIcon,
}: StatCardProps) {
  const colors = {
    blue: "from-blue-500 to-blue-600 hover:border-blue-200",
    green: "from-green-500 to-green-600 hover:border-green-200",
    purple: "from-purple-500 to-purple-600 hover:border-purple-200",
    skyblue: "from-skyblue to-blue-500 hover:border-skyblue/30",
  };

  const textColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    skyblue: "text-skyblue",
  };

  return (
    <div className={`group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent ${colors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-14 h-14 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {badge ? (
          <div className="bg-green-100 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
            {badge}
          </div>
        ) : IconBadge ? (
          <div className={`${textColors[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
            <IconBadge className="w-5 h-5" />
          </div>
        ) : null}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold text-gray-900 group-hover:${textColors[color]} transition-colors`}>
        {value}
      </p>
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <SubIcon className="w-3 h-3 mr-1" />
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

interface MiniStatCardProps {
  icon: any;
  title: string;
  value: string | number;
  subtitle: string;
  gradient: string;
  iconBg: string;
  border: string;
  valueColor?: string;
}

function MiniStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  gradient,
  iconBg,
  border,
  valueColor,
}: MiniStatCardProps) {
  return (
    <div className={`group bg-gradient-to-br ${gradient} rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${valueColor || "text-gray-900"}`}>{value}</p>
      <div className="mt-2 text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}
