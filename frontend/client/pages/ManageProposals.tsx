import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import {
  ArrowLeft,
  Lightbulb,
  Star,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Github,
  Linkedin,
  ExternalLink,
  Filter,
  Search,
  Users,
  FileText,
  Shield,
  AlertCircle,
  Send,
} from "lucide-react";

interface Developer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  location: string;
  timezone: string;
  rating: number;
  completedProjects: number;

  skills: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  isVerified: boolean;
  responseTime: string;
}

interface Proposal {
  id: string;
  developer: Developer;
  ideaId: string;
  ideaTitle: string;
  submittedAt: string;
  status: "Pending" | "Reviewed" | "Approved" | "Rejected" | "Withdrawn";
  equityRequested: string;
  proposedTimeline: string;
  scope: string;
  milestones: {
    title: string;
    duration: string;
    description: string;
  }[];
  additionalNotes?: string;
  attachments?: {
    name: string;
    type: string;
    size: string;
  }[];
  lastActivity: string;
}

export default function ManageProposals() {
  const { id } = useParams();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredProposals = proposals.filter((proposal) => {
    const matchesIdea =
      selectedIdea === "all" || proposal.ideaId === selectedIdea;
    const matchesStatus =
      statusFilter === "all" || proposal.status === statusFilter;
    const matchesSearch =
      proposal.developer.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      proposal.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIdea && matchesStatus && matchesSearch;
  });

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError("");

        // Make API call to backend
        const response = await axios.get(
          `http://localhost:5000/manage-proposals/${id}`,
        );
        console.log(response.data.data);
        if (response.data.success) {
          const fetchedProposals: Proposal[] = response.data.data.map(
            (p: any) => ({
              id: p.proposal_id.toString(),
              developer: {
                id: "dev" + p.proposal_id, // or you can use actual developer ID if available
                name: p.developer_name,
                email: p.developer_email,
                avatar: "", // optional
                location: "", // optional
                timezone: "", // optional
                rating: 0, // optional
                completedProjects: 0, // optional
                skills: [], // optional
                github: "",
                linkedin: "",
                portfolio: "",
                isVerified: true, // optional
                responseTime: "",
              },
              ideaId: id,
              ideaTitle: p.ideaTitle, // optional, or pass idea title from backend
              submittedAt: p.created_at || new Date().toISOString(),
              status: p.proposal_status as Proposal["status"],
              equityRequested: p.equity_requested,
              proposedTimeline: p.timeline,
              scope: p.scope,
              milestones: [], // if backend provides milestones, map them here
              additionalNotes: p.additional_notes,
              attachments: [], // optional
              lastActivity: p.created_at || new Date().toISOString(),
            }),
          );

          setProposals(fetchedProposals);
        } else {
          setError("Failed to fetch proposals.");
        }
      } catch (err: any) {
        console.error(err);
        setError("An error occurred while fetching proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [id]);

  const handleAcceptProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "Approved" as const } : p,
      ),
    );
    // Store Approved proposal data for contract creation
    const ApprovedProposal = proposals.find((p) => p.id === proposalId);
    if (ApprovedProposal) {
      localStorage.setItem(
        "pendingContract",
        JSON.stringify({
          proposalId,
          developerName: ApprovedProposal.developer.name,
          developerEmail: ApprovedProposal.developer.email,
          ideaTitle: ApprovedProposal.ideaTitle,
          equityRequested: ApprovedProposal.equityRequested,
          timeline: ApprovedProposal.proposedTimeline,
          scope: ApprovedProposal.scope,
          milestones: ApprovedProposal.milestones,
        }),
      );
    }
  };

  const handleRejectProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "Rejected" as const } : p,
      ),
    );
    setShowRejectModal(false);
    setRejectReason("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Reviewed":
        return "bg-blue-100 text-blue-800";
      case "Withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Reviewed":
        return <Eye className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const uniqueIdeas = Array.from(
    new Set(proposals.map((p) => ({ id: p.ideaId, title: p.ideaTitle }))),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/entrepreneur-dashboard"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Back to Dashboard</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy">Zero Fund</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-navy mb-2">
                Manage Proposals
              </h1>
              <p className="text-gray-600">
                Review and manage proposals from talented developers
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search developers or ideas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    />
                  </div>
                </div>

                <select
                  value={selectedIdea}
                  onChange={(e) => setSelectedIdea(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                >
                  <option value="all">All Ideas</option>
                  {uniqueIdeas.map((idea) => (
                    <option key={idea.id} value={idea.id}>
                      {idea.title}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Proposals List */}
            <div className="space-y-6">
              {filteredProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                          {proposal.developer.avatar}
                        </div>
                        {proposal.developer.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-navy">
                          {proposal.developer.name}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          Applied for: {proposal.ideaTitle}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{proposal.developer.rating}</span>
                            <span>
                              ({proposal.developer.completedProjects} projects)
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{proposal.developer.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Responds {proposal.developer.responseTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(proposal.status)}`}
                      >
                        {getStatusIcon(proposal.status)}
                        <span>{proposal.status}</span>
                      </span>
                      <button
                        onClick={() => setSelectedProposal(proposal)}
                        className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proposal.developer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-skyblue/10 text-skyblue text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Proposal Details */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Equity Requested:</span>
                      <p className="font-semibold text-skyblue">
                        {proposal.equityRequested}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Timeline:</span>
                      <p className="font-semibold">
                        {proposal.proposedTimeline}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <p className="font-semibold">
                        {formatDate(proposal.submittedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Scope Preview */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Scope of Work:
                    </h4>
                    <p className="text-gray-700 line-clamp-2">
                      {proposal.scope}
                    </p>
                  </div>

                  {/* Actions */}
                  {proposal.status === "Pending" && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedProposal(proposal)}
                        className="flex items-center space-x-2 px-4 py-2 border border-skyblue text-skyblue rounded-lg hover:bg-skyblue/10 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <Link
                        to={`/entrepreneur-chat?developer=${proposal.developer.id}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </Link>
                      <button
                        onClick={() => handleAcceptProposal(proposal.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setShowRejectModal(true);
                        }}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {proposal.status === "Reviewed" && (
                    <div className="flex space-x-3">
                      <Link
                        to={`/entrepreneur-chat?developer=${proposal.developer.id}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Continue Chat</span>
                      </Link>
                      <button
                        onClick={() => handleAcceptProposal(proposal.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Proposal</span>
                      </button>
                    </div>
                  )}

                  {(proposal.status === "Approved" ||
                    proposal.status === "Rejected") && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedProposal(proposal)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      {proposal.status === "Approved" && (
                        <>
                          <Link
                            to={`/contract-builder?proposalId=${proposal.id}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-skyblue transition-colors"
                            onClick={() => {
                              localStorage.setItem(
                                "pendingContract",
                                JSON.stringify({
                                  proposalId: proposal.id,
                                  developerName: proposal.developer.name,
                                  developerEmail: proposal.developer.email,
                                  ideaTitle: proposal.ideaTitle,
                                  equityRequested: proposal.equityRequested,
                                  timeline: proposal.proposedTimeline,
                                  scope: proposal.scope,
                                  milestones: proposal.milestones,
                                }),
                              );
                            }}
                          >
                            <FileText className="w-4 h-4" />
                            <span>Generate Contract</span>
                          </Link>
                          <Link
                            to={`/entrepreneur-chat?developer=${proposal.developer.id}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Open Chat</span>
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {filteredProposals.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Proposals Found
                  </h3>
                  <p className="text-gray-500">
                    No proposals match your current filters. Try adjusting your
                    search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-navy mb-4">Proposal Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Proposals</span>
                  <span className="font-semibold">{proposals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Review</span>
                  <span className="font-semibold text-yellow-600">
                    {proposals.filter((p) => p.status === "Pending").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved</span>
                  <span className="font-semibold text-green-600">
                    {proposals.filter((p) => p.status === "Approved").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold">
                    {(
                      proposals.reduce(
                        (sum, p) => sum + p.developer.rating,
                        0,
                      ) / proposals.length
                    ).toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Link
                    to="/post-idea"
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Post New Idea</span>
                  </Link>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Export Proposals</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {selectedProposal.developer.avatar}
                    </div>
                    {selectedProposal.developer.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      {selectedProposal.developer.name}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      Applied for: {selectedProposal.ideaTitle}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{selectedProposal.developer.rating} rating</span>
                      </div>
                      <span>
                        {selectedProposal.developer.completedProjects} projects
                        completed
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Developer Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Email:</span>{" "}
                      {selectedProposal.developer.email}
                    </p>
                    <p>
                      <span className="text-gray-500">Location:</span>{" "}
                      {selectedProposal.developer.location}
                    </p>
                    <p>
                      <span className="text-gray-500">Timezone:</span>{" "}
                      {selectedProposal.developer.timezone}
                    </p>
                    <p>
                      <span className="text-gray-500">Response Time:</span>{" "}
                      {selectedProposal.developer.responseTime}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Links & Portfolio
                  </h3>
                  <div className="space-y-2">
                    {selectedProposal.developer.github && (
                      <a
                        href={selectedProposal.developer.github}
                        className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedProposal.developer.linkedin && (
                      <a
                        href={selectedProposal.developer.linkedin}
                        className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedProposal.developer.portfolio && (
                      <a
                        href={selectedProposal.developer.portfolio}
                        className="flex items-center space-x-2 text-skyblue hover:text-navy transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Portfolio Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProposal.developer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-skyblue/10 text-skyblue rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proposal Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Proposal Details
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Equity Requested:</span>
                    <p className="font-semibold text-skyblue text-lg">
                      {selectedProposal.equityRequested}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Timeline:</span>
                    <p className="font-semibold text-lg">
                      {selectedProposal.proposedTimeline}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <p className="font-semibold">
                      {formatDate(selectedProposal.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Scope of Work:
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedProposal.scope}
                  </p>
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Proposed Milestones
                </h3>
                <div className="space-y-3">
                  {selectedProposal.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {milestone.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {milestone.duration}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {milestone.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedProposal.additionalNotes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Additional Notes
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedProposal.additionalNotes}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {selectedProposal.attachments &&
                selectedProposal.attachments.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {selectedProposal.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-skyblue/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-skyblue" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {attachment.type} • {attachment.size}
                              </p>
                            </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Actions */}
              {selectedProposal.status === "Pending" && (
                <div className="flex space-x-4">
                  <Link
                    to={`/entrepreneur-chat?developer=${selectedProposal.developer.id}`}
                    className="flex items-center space-x-2 px-6 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Start Chat</span>
                  </Link>
                  <button
                    onClick={() => handleAcceptProposal(selectedProposal.id)}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept Proposal</span>
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">
                Reject Proposal
              </h2>
              <p className="text-gray-600">
                Are you sure you want to reject this proposal from{" "}
                {selectedProposal.developer.name}?
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                placeholder="Provide feedback to help the developer improve..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectProposal(selectedProposal.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
