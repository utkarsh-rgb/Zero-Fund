import { Link } from "react-router-dom";
import {
  Plus,
  Lightbulb,
  Eye,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Target,
  Zap,
  Sparkles,
} from "lucide-react";
import { Proposal } from "./types";
import { getStatusColor } from "./utils";

interface OverviewTabProps {
  stats: any;
  statsLoading: boolean;
  proposals: Proposal[];
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  hoverBorder,
  hoverText,
  extra,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
  sub: React.ReactNode;
  hoverBorder: string;
  hoverText: string;
  extra?: React.ReactNode;
}) {
  return (
    <div
      className={`group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent ${hoverBorder}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}
        >
          {icon}
        </div>
        <div className={`${hoverText} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
          {extra}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold text-gray-900 group-hover:${hoverText.replace("text-", "text-")} transition-colors`}>
        {value}
      </p>
      <div className="mt-2 text-xs text-gray-500 flex items-center">{sub}</div>
    </div>
  );
}

export default function OverviewTab({
  stats,
  statsLoading,
  proposals,
}: OverviewTabProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Dashboard Overview</h1>
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
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="w-14 h-14 bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-8 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Ideas */}
          <StatCard
            icon={<Lightbulb className="w-7 h-7 text-white" />}
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
            label="Total Ideas"
            value={stats.ideas?.total ?? 0}
            hoverBorder="hover:border-blue-200"
            hoverText="text-blue-600"
            extra={<Target className="w-5 h-5" />}
            sub={
              <>
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{stats.ideas?.active ?? 0} active</span>
              </>
            }
          />

          {/* Pending Proposals */}
          <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              {(stats.proposals?.pending ?? 0) > 0 && (
                <div className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                  New!
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending Proposals</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
              {stats.proposals?.pending ?? 0}
            </p>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{stats.proposals?.total ?? 0} total received</span>
            </div>
          </div>

          {/* Total Proposals */}
          <StatCard
            icon={<FileText className="w-7 h-7 text-white" />}
            iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
            label="Total Proposals"
            value={stats.proposals?.total ?? 0}
            hoverBorder="hover:border-purple-200"
            hoverText="text-purple-600"
            extra={<Zap className="w-5 h-5" />}
            sub={
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>{stats.proposals?.avgPerIdea ?? 0} avg per idea</span>
              </>
            }
          />

          {/* Total Views */}
          <StatCard
            icon={<Eye className="w-7 h-7 text-white" />}
            iconBg="bg-gradient-to-br from-skyblue to-blue-500"
            label="Total Views"
            value={stats.activity?.totalViews ?? 0}
            hoverBorder="hover:border-skyblue/30"
            hoverText="text-skyblue"
            extra={<TrendingUp className="w-5 h-5" />}
            sub={
              <>
                <Eye className="w-3 h-3 mr-1" />
                <span>Across all ideas</span>
              </>
            }
          />

          {/* Equity Offered */}
          <StatCard
            icon={<TrendingUp className="w-7 h-7 text-white" />}
            iconBg="bg-gradient-to-br from-amber-500 to-amber-600"
            label="Total Equity Offered"
            value={`${stats.equity?.totalOffered ?? 0}%`}
            hoverBorder="hover:border-amber-200"
            hoverText="text-amber-600"
            extra={<Target className="w-5 h-5" />}
            sub={
              <>
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{stats.equity?.remaining ?? 0}% remaining</span>
              </>
            }
          />

          {/* Hiring Rate */}
          <StatCard
            icon={<Users className="w-7 h-7 text-white" />}
            iconBg="bg-gradient-to-br from-emerald-500 to-emerald-600"
            label="Hiring Rate"
            value={`${stats.performance?.hiringRate ?? 0}%`}
            hoverBorder="hover:border-emerald-200"
            hoverText="text-emerald-600"
            extra={<CheckCircle className="w-5 h-5" />}
            sub={
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>{stats.proposals?.accepted ?? 0} accepted</span>
              </>
            }
          />

          {/* Review Rate */}
          <StatCard
            icon={<Clock className="w-7 h-7 text-white" />}
            iconBg="bg-gradient-to-br from-indigo-500 to-indigo-600"
            label="Review Rate"
            value={`${stats.performance?.reviewRate ?? 0}%`}
            hoverBorder="hover:border-indigo-200"
            hoverText="text-indigo-600"
            extra={<Sparkles className="w-5 h-5" />}
            sub={
              <>
                <Clock className="w-3 h-3 mr-1" />
                <span>Proposal responses</span>
              </>
            }
          />

          {/* Profile Completion */}
          <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-transparent hover:border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div className="text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Profile Completion</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
              {stats.activity?.profileCompletion ?? 0}%
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.activity?.profileCompletion ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No stats available</p>
        </div>
      )}

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
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {proposal.developerAvatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{proposal.developerName}</p>
                    <p className="text-sm text-gray-600">{proposal.ideaTitle}</p>
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
          <h3 className="text-lg font-semibold text-navy mb-4">Active Developers</h3>
        </div>
      </div>
    </div>
  );
}
