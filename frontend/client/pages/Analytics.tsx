import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, Users, Lightbulb, FileText,
  Handshake, Award, Activity, RefreshCw, Bookmark
} from "lucide-react";
import axiosLocal from "../api/axiosLocal";

interface OverviewStats {
  totalIdeas?: number;
  totalProposals: number;
  acceptedProposals: number;
  rejectedProposals?: number;
  activeCollaborations: number;
  uniqueDevelopers?: number;
  bookmarkedIdeas?: number;
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
  const [topList, setTopList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const type = userData.userType || "";
    const id = userData.id || "";

    setUserType(type);
    setUserId(id);

    if (id && type) {
      fetchAnalytics(id, type);
    }
  }, []);

  const fetchAnalytics = async (uid: string, utype: string) => {
    setLoading(true);
    try {
      const params = { userId: uid, userType: utype };

      const [overview, categories, trends, equity] = await Promise.all([
        axiosLocal.get("/analytics/overview", { params }),
        axiosLocal.get("/analytics/ideas-by-category", { params }),
        axiosLocal.get("/analytics/proposal-trends", { params }),
        axiosLocal.get("/analytics/equity-analytics", { params })
      ]);

      setOverviewStats(overview.data.stats);
      setCategoryData(categories.data.categories);
      setProposalTrends(trends.data.trends);
      setEquityData(equity.data);

      // Fetch top developers for entrepreneurs or top entrepreneurs for developers
      if (utype === 'entrepreneur') {
        const topDevs = await axiosLocal.get("/analytics/top-developers", { params });
        setTopList(topDevs.data.developers);
      } else {
        const topEntrs = await axiosLocal.get("/analytics/top-entrepreneurs", { params });
        setTopList(topEntrs.data.entrepreneurs);
      }
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
          <p className="text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            My Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            {userType === 'entrepreneur'
              ? 'Your entrepreneurial journey insights'
              : 'Your development portfolio analytics'}
          </p>
        </div>

        {/* Overview Stats Grid - Different for Entrepreneur vs Developer */}
        {userType === 'entrepreneur' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Lightbulb className="w-6 h-6" />}
              title="My Ideas"
              value={overviewStats?.totalIdeas || 0}
              color="bg-blue-500"
            />
            <StatCard
              icon={<FileText className="w-6 h-6" />}
              title="Proposals Received"
              value={overviewStats?.totalProposals || 0}
              color="bg-yellow-500"
            />
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Unique Developers"
              value={overviewStats?.uniqueDevelopers || 0}
              color="bg-green-500"
            />
            <StatCard
              icon={<Handshake className="w-6 h-6" />}
              title="Active Contracts"
              value={overviewStats?.activeCollaborations || 0}
              color="bg-purple-500"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<FileText className="w-6 h-6" />}
              title="Proposals Submitted"
              value={overviewStats?.totalProposals || 0}
              color="bg-blue-500"
            />
            <StatCard
              icon={<Award className="w-6 h-6" />}
              title="Accepted"
              value={overviewStats?.acceptedProposals || 0}
              color="bg-green-500"
            />
            <StatCard
              icon={<Bookmark className="w-6 h-6" />}
              title="Bookmarked Ideas"
              value={overviewStats?.bookmarkedIdeas || 0}
              color="bg-yellow-500"
            />
            <StatCard
              icon={<Handshake className="w-6 h-6" />}
              title="Active Contracts"
              value={overviewStats?.activeCollaborations || 0}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Acceptance Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-skyblue to-navy rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {userType === 'entrepreneur' ? 'Proposal Approval Rate' : 'My Success Rate'}
                </p>
                <p className="text-3xl font-bold text-navy">
                  {overviewStats?.proposalAcceptanceRate || 0}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {userType === 'entrepreneur' ? 'Approved' : 'Accepted Proposals'}
              </p>
              <p className="text-2xl font-semibold text-green-600">
                {overviewStats?.acceptedProposals || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ideas/Proposals by Stage */}
          {categoryData.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-navy mb-4">
                {userType === 'entrepreneur' ? 'My Ideas by Stage' : 'Proposals by Idea Stage'}
              </h2>
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
          )}

          {/* Proposal Trends */}
          {proposalTrends.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-navy mb-4">
                {userType === 'entrepreneur' ? 'Received Proposals Trends' : 'My Proposal Trends'} (Last 6 Months)
              </h2>
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
          )}
        </div>

        {/* Equity Analytics */}
        {equityData?.overall && equityData.overall.totalIdeas > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-navy mb-4">
              {userType === 'entrepreneur' ? 'My Equity Offering Analytics' : 'Equity Requested Analytics'}
            </h2>
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

            {/* Equity by Stage */}
            {equityData.byCategory && equityData.byCategory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-navy mb-3">Average Equity by Stage</h3>
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

        {/* Top Developers/Entrepreneurs List */}
        {topList.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-navy mb-4">
              {userType === 'entrepreneur' ? 'Top Developers' : 'Entrepreneurs I Work With'}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proposals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accepted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topList.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.proposalCount || item.ideaCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.acceptedCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-skyblue to-navy rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-6 h-6" />
            <h2 className="text-xl font-bold">
              {userType === 'entrepreneur' ? 'Your Entrepreneurial Impact' : 'Your Development Journey'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">
                {userType === 'entrepreneur' ? 'Total Ideas Posted' : 'Total Proposals'}
              </p>
              <p className="text-3xl font-bold">
                {userType === 'entrepreneur' ? overviewStats?.totalIdeas : overviewStats?.totalProposals || 0}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Accepted/Approved</p>
              <p className="text-3xl font-bold">{overviewStats?.acceptedProposals || 0}</p>
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
