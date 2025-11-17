import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, Users, Lightbulb, FileText,
  Handshake, Award, Activity, RefreshCw
} from "lucide-react";
import axiosLocal from "../api/axiosLocal";

interface OverviewStats {
  totalIdeas: number;
  totalDevelopers: number;
  totalEntrepreneurs: number;
  totalProposals: number;
  acceptedProposals: number;
  activeCollaborations: number;
  proposalAcceptanceRate: string;
}

interface CategoryData {
  category: string;
  count: number;
}

interface ProposalTrend {
  month: string;
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
}

const Analytics: React.FC = () => {
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [proposalTrends, setProposalTrends] = useState<ProposalTrend[]>([]);
  const [equityData, setEquityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [overview, categories, trends, equity] = await Promise.all([
        axiosLocal.get("/analytics/overview"),
        axiosLocal.get("/analytics/ideas-by-category"),
        axiosLocal.get("/analytics/proposal-trends"),
        axiosLocal.get("/analytics/equity-analytics")
      ]);

      setOverviewStats(overview.data.stats);
      setCategoryData(categories.data.categories);
      setProposalTrends(trends.data.trends);
      setEquityData(equity.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-skyblue animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights and metrics for Zero Fund Venture</p>
        </div>

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Lightbulb className="w-6 h-6" />}
            title="Total Ideas"
            value={overviewStats?.totalIdeas || 0}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Developers"
            value={overviewStats?.totalDevelopers || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            title="Proposals"
            value={overviewStats?.totalProposals || 0}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<Handshake className="w-6 h-6" />}
            title="Active Collaborations"
            value={overviewStats?.activeCollaborations || 0}
            color="bg-purple-500"
          />
        </div>

        {/* Acceptance Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-skyblue to-navy rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Proposal Acceptance Rate</p>
                <p className="text-3xl font-bold text-navy">
                  {overviewStats?.proposalAcceptanceRate || 0}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Accepted Proposals</p>
              <p className="text-2xl font-semibold text-green-600">
                {overviewStats?.acceptedProposals || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ideas by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-navy mb-4">Ideas by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.category}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Proposal Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-navy mb-4">Proposal Trends (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={proposalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
                <Line type="monotone" dataKey="accepted" stroke="#82ca9d" name="Accepted" />
                <Line type="monotone" dataKey="rejected" stroke="#ff8042" name="Rejected" />
                <Line type="monotone" dataKey="pending" stroke="#ffc658" name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equity Analytics */}
        {equityData?.overall && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-navy mb-4">Equity Distribution Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Average Equity</p>
                <p className="text-2xl font-bold text-blue-600">
                  {parseFloat(equityData.overall.avgEquity).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Minimum Equity</p>
                <p className="text-2xl font-bold text-green-600">
                  {equityData.overall.minEquity}%
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Maximum Equity</p>
                <p className="text-2xl font-bold text-purple-600">
                  {equityData.overall.maxEquity}%
                </p>
              </div>
            </div>

            {/* Equity by Category */}
            {equityData.byCategory && equityData.byCategory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-navy mb-3">Average Equity by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={equityData.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgEquity" fill="#0088FE" name="Avg Equity %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Platform Activity */}
        <div className="bg-gradient-to-br from-skyblue to-navy rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-6 h-6" />
            <h2 className="text-xl font-bold">Platform Activity Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Total Users</p>
              <p className="text-3xl font-bold">
                {(overviewStats?.totalDevelopers || 0) + (overviewStats?.totalEntrepreneurs || 0)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Entrepreneurs</p>
              <p className="text-3xl font-bold">{overviewStats?.totalEntrepreneurs || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Success Rate</p>
              <p className="text-3xl font-bold">{overviewStats?.proposalAcceptanceRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-navy">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
