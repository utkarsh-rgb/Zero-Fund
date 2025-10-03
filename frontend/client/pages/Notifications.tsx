import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";

import {
  ArrowLeft,
  Bell,
  MessageCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Settings,
  Filter,
  Send,
  Award,
  Lightbulb,
  Code,
} from "lucide-react";

interface Notification {
  id: number;
  proposal_id?: number;
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
  const userType = localStorage.getItem("userType") || "developer";
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const developerId = userData.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axiosLocal.get(
        `/notifications/${developerId}`,
      );
      const data: Notification[] = res.data.map((n: any) => ({
        id: n.id,
        proposal_id: n.proposal_id,
        type: "proposal",
        title: "Proposal Update",
        message: n.message,
        timestamp: new Date(n.created_at).toLocaleString(),
        isRead: n.is_read === 1,
        isImportant: false,
      }));
      console.log(res.data);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 10s
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await axiosLocal.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

 const markAllAsRead = async () => {
  try {
    await axiosLocal.patch(`/notifications/read-all/${developerId}`);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  } catch (err) {
    console.error("Failed to mark all notifications as read", err);
  }
};

const deleteNotification = async (id: number) => {
  try {
    await axiosLocal.delete(`/notifications/${id}`);
    setNotifications(prev => prev.filter(n => n.id !== id));
  } catch (err) {
    console.error("Failed to delete notification", err);
  }
};


  const filteredNotifications = notifications.filter((n) => {
    if (showUnreadOnly && n.isRead) return false;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  return (
    <div className="min-h-screen bg-gray-50">
    

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span>Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
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
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="rounded"
            />
            <span>Unread only</span>
          </label>
          <div className="flex items-center space-x-4">
            <span>{unreadCount} unread</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-skyblue hover:text-navy"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-lg shadow-sm">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3>No notifications</h3>
              <p>
                {showUnreadOnly
                  ? "You're all caught up!"
                  : "No notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${!n.isRead ? "border-l-skyblue bg-blue-50/30" : "border-l-gray-200"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3
                        className={`${n.isRead ? "text-gray-800" : "text-navy font-semibold"}`}
                      >
                        {n.title}
                      </h3>
                      {n.isImportant && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-gray-600">{n.message}</p>
                    <span className="text-xs text-gray-400">{n.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!n.isRead && (
                      <button onClick={() => markAsRead(n.id)}>
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {n.actionUrl && n.actionText && (
                  <Link
                    to={n.actionUrl}
                    onClick={() => markAsRead(n.id)}
                    className="inline-flex items-center space-x-2 mt-3 px-3 py-1 bg-skyblue text-white rounded-lg"
                  >
                    <span>{n.actionText}</span>
                    <Send className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
