import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  FileText,
  UserPlus,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Settings,
  Filter,
  Code,
  Lightbulb,
  Send,
  Award,
  Calendar,
  DollarSign,
} from "lucide-react";

interface Notification {
  id: string;
  type:
    | "proposal"
    | "message"
    | "milestone"
    | "contract"
    | "system"
    | "achievement"
    | "reminder";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  actionUrl?: string;
  actionText?: string;
  avatar?: string;
  entityName?: string;
}

export default function Notifications() {
  // Determine user type from URL or context (in real app would come from auth)
  const userType =
    window.location.pathname.includes("entrepreneur") ||
    localStorage.getItem("userType") === "entrepreneur"
      ? "entrepreneur"
      : "developer";

  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "proposal",
      title: "New Proposal Received",
      message:
        userType === "entrepreneur"
          ? "John Developer submitted a proposal for your AI-Powered Education Platform project"
          : "Your proposal for AI-Powered Education Platform has been accepted",
      timestamp: "2 hours ago",
      isRead: false,
      isImportant: true,
      actionUrl: "/manage-proposals",
      actionText: "View Proposal",
      avatar: "JD",
      entityName: "John Developer",
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      message:
        userType === "entrepreneur"
          ? "Sarah Chen sent you a message about the FinTech project"
          : "Priya Sharma sent you a message about project requirements",
      timestamp: "4 hours ago",
      isRead: false,
      isImportant: false,
      actionUrl: "/entrepreneur-chat",
      actionText: "View Message",
      avatar: "SC",
      entityName: "Sarah Chen",
    },
    {
      id: "3",
      type: "milestone",
      title: "Milestone Completed",
      message:
        userType === "entrepreneur"
          ? "Payment Gateway Integration milestone has been completed by Vikram Singh"
          : "You've successfully completed the Payment Gateway Integration milestone",
      timestamp: "1 day ago",
      isRead: true,
      isImportant: false,
      actionUrl: "/collaboration-management",
      actionText: "View Progress",
      avatar: "VS",
      entityName: "FinTech for Rural India",
    },
    {
      id: "4",
      type: "contract",
      title: "Contract Signed",
      message:
        userType === "entrepreneur"
          ? "Contract for Health Monitoring App has been signed by all parties"
          : "Contract for Health Monitoring App is ready for your signature",
      timestamp: "2 days ago",
      isRead: true,
      isImportant: true,
      actionUrl: "/contract-review",
      actionText: "View Contract",
      entityName: "Health Monitoring App",
    },
    {
      id: "5",
      type: "achievement",
      title: "Achievement Unlocked",
      message:
        userType === "entrepreneur"
          ? "You've reached 10 successful collaborations milestone!"
          : "You've earned your first equity payout - ₹15,000 from completed project",
      timestamp: "3 days ago",
      isRead: false,
      isImportant: false,
      actionUrl: "/profile",
      actionText: "View Profile",
    },
    {
      id: "6",
      type: "reminder",
      title: "Project Deadline Reminder",
      message:
        userType === "entrepreneur"
          ? "Review pending contributions for AI-Powered Education Platform"
          : "Submit weekly progress report for Health Monitoring App project",
      timestamp: "5 days ago",
      isRead: true,
      isImportant: false,
      actionUrl: "/review-contributions",
      actionText: "Take Action",
    },
    {
      id: "7",
      type: "system",
      title: "System Update",
      message:
        "New features available: Enhanced contract builder and improved messaging system",
      timestamp: "1 week ago",
      isRead: true,
      isImportant: false,
      actionUrl: "/settings",
      actionText: "Learn More",
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "proposal":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      case "milestone":
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      case "contract":
        return <FileText className="w-5 h-5 text-orange-600" />;
      case "achievement":
        return <Award className="w-5 h-5 text-yellow-600" />;
      case "reminder":
        return <Clock className="w-5 h-5 text-red-600" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (showUnreadOnly && notif.isRead) return false;
    if (filter === "all") return true;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  {userType === "entrepreneur" ? (
                    <Lightbulb className="w-5 h-5 text-white" />
                  ) : (
                    <Code className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className="text-xl font-bold text-navy">
                  Zero Fund
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                to={`/${userType}-dashboard`}
                className="flex items-center space-x-2 text-gray-600 hover:text-navy transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-skyblue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userType === "entrepreneur" ? "PS" : "JD"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">Notifications</h1>
            <p className="text-gray-600">
              Stay updated with your projects and collaborations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{unreadCount} unread</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-skyblue hover:text-navy transition-colors text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filter:
                </span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-skyblue focus:border-transparent"
              >
                <option value="all">All Notifications</option>
                <option value="proposal">Proposals</option>
                <option value="message">Messages</option>
                <option value="milestone">Milestones</option>
                <option value="contract">Contracts</option>
                <option value="achievement">Achievements</option>
                <option value="reminder">Reminders</option>
                <option value="system">System Updates</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded border-gray-300 text-skyblue focus:ring-skyblue"
                />
                <span className="text-sm text-gray-700">Unread only</span>
              </label>
              <Link
                to="/settings"
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Notification Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                {showUnreadOnly
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${
                  notification.isImportant
                    ? "border-l-red-500"
                    : notification.isRead
                      ? "border-l-gray-200"
                      : "border-l-skyblue"
                } ${!notification.isRead ? "bg-blue-50/30" : ""}`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon/Avatar */}
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {notification.avatar}
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      {!notification.isRead && (
                        <div className="w-3 h-3 bg-skyblue rounded-full -mt-2 ml-7 border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3
                              className={`text-sm font-semibold ${
                                notification.isRead
                                  ? "text-gray-800"
                                  : "text-navy"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {notification.isImportant && (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{notification.timestamp}</span>
                            {notification.entityName && (
                              <>
                                <span>•</span>
                                <span>{notification.entityName}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-skyblue transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.actionUrl && notification.actionText && (
                        <div className="mt-3">
                          <Link
                            to={notification.actionUrl}
                            onClick={() => markAsRead(notification.id)}
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors text-sm"
                          >
                            <span>{notification.actionText}</span>
                            <Send className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">
              Notification Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-skyblue">
                  {notifications.filter((n) => n.type === "proposal").length}
                </div>
                <div className="text-sm text-gray-600">Proposals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {notifications.filter((n) => n.type === "message").length}
                </div>
                <div className="text-sm text-gray-600">Messages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {notifications.filter((n) => n.type === "milestone").length}
                </div>
                <div className="text-sm text-gray-600">Milestones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {notifications.filter((n) => n.type === "contract").length}
                </div>
                <div className="text-sm text-gray-600">Contracts</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
