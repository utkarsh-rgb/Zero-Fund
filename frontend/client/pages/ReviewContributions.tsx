import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Lightbulb,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Image,
  Video,
  Code,
  Calendar,
  User,
  MessageCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Play,
  Star,
  Filter,
  Search,
} from "lucide-react";

interface TaskSubmission {
  id: string;
  milestoneId: string;
  milestoneTitle: string;
  taskTitle: string;
  description: string;
  submittedBy: string;
  developerAvatar: string;
  submittedAt: string;
  hoursLogged: number;
  status:
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "revision_requested";
  attachments: Attachment[];
  comments: string;
  reviewComments?: string;
  reviewedAt?: string;
  priority: "high" | "medium" | "low";
  projectTitle: string;
}

interface Attachment {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "code" | "other";
  size: string;
  url?: string;
  thumbnailUrl?: string;
}

const MOCK_SUBMISSIONS: TaskSubmission[] = [
  {
    id: "1",
    milestoneId: "m1",
    milestoneTitle: "User Authentication System",
    taskTitle: "User Registration API",
    description:
      "Implemented complete user registration API with email verification, input validation, and security measures. The API handles user creation, duplicate email checking, and sends verification emails.",
    submittedBy: "John Developer",
    developerAvatar: "JD",
    submittedAt: "2024-01-20T14:30:00Z",
    hoursLogged: 8,
    status: "submitted",
    attachments: [
      {
        id: "1",
        name: "registration_api_code.zip",
        type: "code",
        size: "2.1 MB",
      },
      {
        id: "2",
        name: "api_documentation.pdf",
        type: "document",
        size: "850 KB",
      },
      {
        id: "3",
        name: "test_results_screenshot.png",
        type: "image",
        size: "450 KB",
      },
    ],
    comments:
      "All tests are passing. I've implemented extra security measures including rate limiting and password hashing with bcrypt. The API is fully documented and ready for integration.",
    priority: "high",
    projectTitle: "AI-Powered Education Platform",
  },
  {
    id: "2",
    milestoneId: "m1",
    milestoneTitle: "User Authentication System",
    taskTitle: "Login UI Components",
    description:
      "Created responsive login and signup forms with proper validation, error handling, and loading states. Implemented modern design with accessibility features.",
    submittedBy: "John Developer",
    developerAvatar: "JD",
    submittedAt: "2024-01-19T16:45:00Z",
    hoursLogged: 12,
    status: "approved",
    attachments: [
      {
        id: "4",
        name: "login_form_demo.mp4",
        type: "video",
        size: "8.2 MB",
      },
      {
        id: "5",
        name: "responsive_design_screenshots.zip",
        type: "image",
        size: "3.1 MB",
      },
      {
        id: "6",
        name: "component_source_code.zip",
        type: "code",
        size: "1.8 MB",
      },
    ],
    comments:
      "The forms include proper validation, loading states, and error messages. All accessibility standards are met. Ready for production use.",
    reviewComments:
      "Excellent work! The UI is clean and professional. Approved for integration.",
    reviewedAt: "2024-01-20T09:15:00Z",
    priority: "medium",
    projectTitle: "AI-Powered Education Platform",
  },
  {
    id: "3",
    milestoneId: "m2",
    milestoneTitle: "Dashboard Interface",
    taskTitle: "Basic Dashboard Layout",
    description:
      "Working on the main dashboard layout with sidebar navigation, header, and content areas. Still implementing the responsive breakpoints.",
    submittedBy: "John Developer",
    developerAvatar: "JD",
    submittedAt: "2024-01-18T11:20:00Z",
    hoursLogged: 6,
    status: "revision_requested",
    attachments: [
      {
        id: "7",
        name: "dashboard_preview.png",
        type: "image",
        size: "1.2 MB",
      },
      {
        id: "8",
        name: "layout_components.zip",
        type: "code",
        size: "950 KB",
      },
    ],
    comments:
      "Initial layout is complete but needs some adjustments for mobile responsiveness. The sidebar navigation works well on desktop.",
    reviewComments:
      "Good start! Please ensure the sidebar collapses properly on mobile devices and add proper spacing between content sections.",
    reviewedAt: "2024-01-19T08:30:00Z",
    priority: "medium",
    projectTitle: "AI-Powered Education Platform",
  },
];

export default function ReviewContributions() {
  const [submissions, setSubmissions] =
    useState<TaskSubmission[]>(MOCK_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] =
    useState<TaskSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<
    "approve" | "reject" | "request_revision" | null
  >(null);

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesStatus =
      filterStatus === "all" || submission.status === filterStatus;
    const matchesSearch =
      submission.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.submittedBy
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      submission.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleReviewSubmission = (
    action: "approve" | "reject" | "request_revision",
  ) => {
    if (!selectedSubmission) return;

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              status:
                action === "approve"
                  ? "approved"
                  : action === "reject"
                    ? "rejected"
                    : "revision_requested",
              reviewComments: reviewComment,
              reviewedAt: new Date().toISOString(),
            }
          : sub,
      ),
    );

    setShowReviewModal(false);
    setSelectedSubmission(null);
    setReviewComment("");
    setReviewAction(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "revision_requested":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "revision_requested":
        return <AlertCircle className="w-4 h-4" />;
      case "under_review":
        return <Eye className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "code":
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
              <span className="text-xl font-bold text-navy">Skill Invest</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy mb-2">
            Review Contributions
          </h1>
          <p className="text-gray-600">
            Review and approve developer work submissions and milestones
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
                  placeholder="Search tasks or developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="submitted">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="revision_requested">Revision Requested</option>
            </select>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {submission.developerAvatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy">
                      {submission.taskTitle}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      {submission.milestoneTitle} • {submission.projectTitle}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>by {submission.submittedBy}</span>
                      <span>•</span>
                      <span>{submission.hoursLogged}h logged</span>
                      <span>•</span>
                      <span>{formatDate(submission.submittedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(submission.priority)}`}
                  >
                    {submission.priority} priority
                  </span>
                  <span
                    className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submission.status)}`}
                  >
                    {getStatusIcon(submission.status)}
                    <span>{submission.status.replace("_", " ")}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {submission.description}
                </p>
              </div>

              {/* Developer Comments */}
              <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Developer Notes:
                </h4>
                <p className="text-gray-700 text-sm">{submission.comments}</p>
              </div>

              {/* Review Comments */}
              {submission.reviewComments && (
                <div className="mb-4 bg-skyblue/10 border border-skyblue/20 rounded-lg p-4">
                  <h4 className="font-semibold text-navy mb-2">Your Review:</h4>
                  <p className="text-gray-700 text-sm">
                    {submission.reviewComments}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed on {formatDate(submission.reviewedAt!)}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {submission.attachments.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Attachments ({submission.attachments.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {submission.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-skyblue/10 rounded-lg flex items-center justify-center">
                          {getFileIcon(attachment.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attachment.type} • {attachment.size}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 hover:text-skyblue transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-skyblue transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Link
                    to={`/entrepreneur-chat?developer=${submission.submittedBy}`}
                    className="flex items-center space-x-2 px-3 py-2 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message Developer</span>
                  </Link>
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>

                {submission.status === "submitted" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setReviewAction("request_revision");
                        setShowReviewModal(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Request Changes</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setReviewAction("reject");
                        setShowReviewModal(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setReviewAction("approve");
                        setShowReviewModal(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredSubmissions.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Submissions Found
              </h3>
              <p className="text-gray-500">
                No task submissions match your current filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && reviewAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  reviewAction === "approve"
                    ? "bg-green-100"
                    : reviewAction === "reject"
                      ? "bg-red-100"
                      : "bg-yellow-100"
                }`}
              >
                {reviewAction === "approve" ? (
                  <ThumbsUp className="w-8 h-8 text-green-600" />
                ) : reviewAction === "reject" ? (
                  <ThumbsDown className="w-8 h-8 text-red-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">
                {reviewAction === "approve"
                  ? "Approve Submission"
                  : reviewAction === "reject"
                    ? "Reject Submission"
                    : "Request Revision"}
              </h2>
              <p className="text-gray-600">
                {selectedSubmission.taskTitle} by{" "}
                {selectedSubmission.submittedBy}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {reviewAction === "approve"
                  ? "Approval Comments (Optional)"
                  : reviewAction === "reject"
                    ? "Reason for Rejection"
                    : "Changes Requested"}
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                placeholder={
                  reviewAction === "approve"
                    ? "Great work! The submission meets all requirements..."
                    : reviewAction === "reject"
                      ? "Please explain why this submission doesn't meet requirements..."
                      : "Please describe the specific changes needed..."
                }
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewComment("");
                  setReviewAction(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewSubmission(reviewAction)}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  reviewAction === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : reviewAction === "reject"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-yellow-600 hover:bg-yellow-700 text-white"
                }`}
              >
                {reviewAction === "approve"
                  ? "Approve"
                  : reviewAction === "reject"
                    ? "Reject"
                    : "Request Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
