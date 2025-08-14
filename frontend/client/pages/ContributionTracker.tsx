import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Plus,
  Upload,
  Calendar,
  Clock,
  CheckCircle,
  Send,
  Eye,
  Download,
  Edit,
  Trash2,
  FileText,
  Image,
  Play,
  Pause,
  AlertCircle,
} from "lucide-react";

interface TaskEntry {
  id: string;
  title: string;
  description: string;
  hours: number;
  date: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  attachments: TaskAttachment[];
  comments?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

interface TaskAttachment {
  id: string;
  name: string;
  type: "image" | "document" | "video" | "code";
  size: string;
  url?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "submitted" | "approved" | "rejected";
  totalHours: number;
  completedHours: number;
  tasks: TaskEntry[];
}

const MOCK_MILESTONES: Milestone[] = [
  {
    id: "1",
    title: "User Authentication System",
    description:
      "Complete user registration, login, password reset functionality with email verification",
    dueDate: "2024-01-22",
    status: "submitted",
    totalHours: 40,
    completedHours: 42,
    tasks: [
      {
        id: "1",
        title: "User Registration API",
        description: "Built REST API for user registration with validation",
        hours: 8,
        date: "2024-01-18",
        status: "approved",
        attachments: [
          {
            id: "1",
            name: "registration_api_code.zip",
            type: "code",
            size: "2.1 MB",
          },
        ],
        submittedAt: "2024-01-18T18:00:00",
        reviewedAt: "2024-01-19T10:00:00",
      },
      {
        id: "2",
        title: "Login UI Components",
        description: "Created responsive login and signup forms",
        hours: 12,
        date: "2024-01-19",
        status: "approved",
        attachments: [
          {
            id: "2",
            name: "login_ui_demo.mp4",
            type: "video",
            size: "5.3 MB",
          },
          {
            id: "3",
            name: "ui_screenshots.png",
            type: "image",
            size: "1.2 MB",
          },
        ],
        submittedAt: "2024-01-19T20:00:00",
        reviewedAt: "2024-01-20T09:00:00",
      },
    ],
  },
  {
    id: "2",
    title: "Dashboard Interface",
    description:
      "Build responsive dashboard with student/teacher views, navigation, and basic layouts",
    dueDate: "2024-02-05",
    status: "in_progress",
    totalHours: 60,
    completedHours: 18,
    tasks: [
      {
        id: "3",
        title: "Dashboard Layout Structure",
        description: "Created basic layout with sidebar and main content area",
        hours: 6,
        date: "2024-01-21",
        status: "approved",
        attachments: [
          {
            id: "4",
            name: "dashboard_wireframe.pdf",
            type: "document",
            size: "800 KB",
          },
        ],
        submittedAt: "2024-01-21T16:00:00",
        reviewedAt: "2024-01-22T11:00:00",
      },
      {
        id: "4",
        title: "Navigation Component",
        description: "Responsive navigation with user menu and breadcrumbs",
        hours: 8,
        date: "2024-01-22",
        status: "submitted",
        attachments: [
          {
            id: "5",
            name: "navigation_demo.mp4",
            type: "video",
            size: "3.7 MB",
          },
        ],
        submittedAt: "2024-01-22T19:00:00",
      },
      {
        id: "5",
        title: "Student Dashboard View",
        description: "Working on student-specific dashboard components",
        hours: 4,
        date: "2024-01-23",
        status: "draft",
        attachments: [],
      },
    ],
  },
];

const PROJECT_INFO = {
  title: "AI-Powered Education Platform",
  founderName: "Priya Sharma",
  totalEquity: "12%",
  startDate: "2024-01-15",
};

export default function ContributionTracker() {
  const [milestones] = useState<Milestone[]>(MOCK_MILESTONES);
  const [activeMilestone, setActiveMilestone] = useState(
    milestones.find((m) => m.status === "in_progress")?.id || milestones[0].id,
  );
  const [showAddTask, setShowAddTask] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentHours, setCurrentHours] = useState(0);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    hours: "",
    attachments: [] as File[],
  });

  const currentMilestone = milestones.find((m) => m.id === activeMilestone);

  const handleAddTask = () => {
    // TODO: Submit new task to backend
    console.log("Adding new task:", newTask);
    setNewTask({ title: "", description: "", hours: "", attachments: [] });
    setShowAddTask(false);
  };

  const handleSubmitMilestone = () => {
    // TODO: Submit milestone for review
    console.log("Submitting milestone for review:", activeMilestone);
    alert("Milestone submitted for review!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "submitted":
        return <Eye className="w-4 h-4" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Play className="w-4 h-4" />;
      case "code":
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/chat-collaboration"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Back to Collaboration</span>
              </Link>
              <span className="text-gray-400">|</span>
              <div>
                <h1 className="text-lg font-semibold text-navy">
                  Contribution Tracker
                </h1>
                <p className="text-sm text-gray-600">
                  {PROJECT_INFO.title} • {PROJECT_INFO.founderName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <p className="text-gray-500">Total Equity</p>
                <p className="font-semibold text-skyblue">
                  {PROJECT_INFO.totalEquity}
                </p>
              </div>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">
                  Skill Invest
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Milestones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-navy mb-4">
                Project Milestones
              </h3>

              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <button
                    key={milestone.id}
                    onClick={() => setActiveMilestone(milestone.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeMilestone === milestone.id
                        ? "bg-skyblue text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {milestone.title}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          activeMilestone === milestone.id
                            ? getStatusColor(milestone.status).replace(
                                "text-",
                                "text-white bg-white/20 border border-white/30 ",
                              )
                            : getStatusColor(milestone.status)
                        }`}
                      >
                        {milestone.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-xs opacity-75 mb-2">
                      Due: {formatDate(milestone.dueDate)}
                    </div>

                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div
                        className="bg-white h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((milestone.completedHours / milestone.totalHours) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {milestone.completedHours}h / {milestone.totalHours}h
                    </div>
                  </button>
                ))}
              </div>

              {/* Time Tracker */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Time Tracker
                </h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-navy mb-2">
                    {Math.floor(currentHours)}h{" "}
                    {Math.round((currentHours % 1) * 60)}m
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                      isTimerRunning
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Stop Timer</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Timer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Task List */}
          <div className="lg:col-span-3">
            {currentMilestone && (
              <div>
                {/* Milestone Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-navy mb-2">
                        {currentMilestone.title}
                      </h2>
                      <p className="text-gray-600 mb-3">
                        {currentMilestone.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Due: {formatDate(currentMilestone.dueDate)}</span>
                        <span>•</span>
                        <span>
                          {currentMilestone.tasks.length} tasks logged
                        </span>
                        <span>•</span>
                        <span>{currentMilestone.completedHours}h total</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowAddTask(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Task</span>
                      </button>
                      {currentMilestone.status === "in_progress" && (
                        <button
                          onClick={handleSubmitMilestone}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit for Review</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">
                        {Math.round(
                          (currentMilestone.completedHours /
                            currentMilestone.totalHours) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-skyblue h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((currentMilestone.completedHours / currentMilestone.totalHours) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Task List */}
                <div className="space-y-4">
                  {currentMilestone.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-navy">
                              {task.title}
                            </h3>
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}
                            >
                              {getStatusIcon(task.status)}
                              <span>{task.status.replace("_", " ")}</span>
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(task.date)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{task.hours}h logged</span>
                            </span>
                            {task.submittedAt && (
                              <span>
                                Submitted: {formatDateTime(task.submittedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {task.status === "draft" && (
                            <>
                              <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Attachments */}
                      {task.attachments.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Attachments ({task.attachments.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {task.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="w-8 h-8 bg-skyblue/10 rounded-lg flex items-center justify-center">
                                  {getAttachmentIcon(attachment.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {attachment.type} • {attachment.size}
                                  </p>
                                </div>
                                <button className="p-1 text-gray-400 hover:text-skyblue transition-colors">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comments/Feedback */}
                      {task.comments && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Feedback:
                          </h4>
                          <p className="text-sm text-gray-600">
                            {task.comments}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {task.status === "draft" && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                            <Send className="w-4 h-4" />
                            <span>Submit Task</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Task Modal */}
                {showAddTask && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                      <h2 className="text-2xl font-bold text-navy mb-6">
                        Log New Task
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Title
                          </label>
                          <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) =>
                              setNewTask({ ...newTask, title: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                            placeholder="e.g., Created user registration form"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={newTask.description}
                            onChange={(e) =>
                              setNewTask({
                                ...newTask,
                                description: e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                            placeholder="Describe what you accomplished in this task..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hours Spent
                          </label>
                          <input
                            type="number"
                            value={newTask.hours}
                            onChange={(e) =>
                              setNewTask({ ...newTask, hours: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                            placeholder="e.g., 4.5"
                            step="0.5"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attachments (Optional)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-skyblue transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 mb-2">
                              Upload files to demonstrate your work
                            </p>
                            <label className="inline-block bg-skyblue text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-navy transition-colors">
                              Choose Files
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) =>
                                  setNewTask({
                                    ...newTask,
                                    attachments: Array.from(
                                      e.target.files || [],
                                    ),
                                  })
                                }
                              />
                            </label>
                            {newTask.attachments.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm text-green-600">
                                  ✓ {newTask.attachments.length} file(s)
                                  selected
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4 mt-8">
                        <button
                          onClick={() => setShowAddTask(false)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddTask}
                          disabled={
                            !newTask.title ||
                            !newTask.description ||
                            !newTask.hours
                          }
                          className="flex-1 px-4 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Save Task
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
