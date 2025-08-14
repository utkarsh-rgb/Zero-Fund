import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Lightbulb,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Shield,
  Bell,
  CreditCard,
  Key,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface ProfileData {
  // Basic Info
  fullName: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  timezone: string;
  startupRole: string;
  linkedin: string;
  website: string;
  bio: string;

  // Verification
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isKYCVerified: boolean;
  kycDocument?: string;

  // Stats
  ideasPosted: number;
  totalProposals: number;
  activeCollaborations: number;
  completedProjects: number;
  totalEquityOffered: number;
}

const INITIAL_PROFILE: ProfileData = {
  fullName: "Priya Sharma",
  email: "priya.sharma@example.com",
  phone: "+91 98765 43210",
  company: "EduTech Innovations Pvt Ltd",
  location: "Bangalore, Karnataka, India",
  timezone: "UTC+5:30",
  startupRole: "CEO/Founder",
  linkedin: "https://linkedin.com/in/priyasharma",
  website: "https://edutechinnovations.com",
  bio: "Passionate entrepreneur with 8+ years in EdTech. Former Education Director at Byju's. MBA from IIM Bangalore. Building the future of personalized education through AI.",

  isEmailVerified: true,
  isPhoneVerified: false,
  isKYCVerified: true,
  kycDocument: "Government_ID_Verified.pdf",

  ideasPosted: 3,
  totalProposals: 18,
  activeCollaborations: 2,
  completedProjects: 1,
  totalEquityOffered: 5.5,
};

const NOTIFICATION_SETTINGS = [
  {
    id: "new_proposals",
    label: "New Proposals",
    description: "Get notified when developers submit proposals",
    enabled: true,
  },
  {
    id: "messages",
    label: "Messages",
    description: "Notifications for new chat messages",
    enabled: true,
  },
  {
    id: "milestones",
    label: "Milestone Updates",
    description: "Updates when developers submit work",
    enabled: true,
  },
  {
    id: "contract_updates",
    label: "Contract Updates",
    description: "Contract signatures and modifications",
    enabled: true,
  },
  {
    id: "weekly_summary",
    label: "Weekly Summary",
    description: "Weekly summary of all activity",
    enabled: false,
  },
  {
    id: "marketing",
    label: "Marketing Updates",
    description: "Product updates and new features",
    enabled: false,
  },
];

export default function EntrepreneurProfile() {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<
    "profile" | "account" | "notifications" | "privacy"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATION_SETTINGS);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    // TODO: Save to backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleNotificationToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif,
      ),
    );
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // TODO: Change password
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password changed successfully");
  };

  const handleDeleteAccount = () => {
    // TODO: Delete account
    alert(
      "Account deletion initiated. You will receive an email confirmation.",
    );
    setShowDeleteModal(false);
  };

  const handleVerifyPhone = () => {
    // TODO: Send verification SMS
    alert("Verification SMS sent to your phone number");
  };

  const handleKYCUpload = (files: FileList | null) => {
    if (files && files[0]) {
      // TODO: Upload KYC document
      setProfile((prev) => ({
        ...prev,
        kycDocument: files[0].name,
        isKYCVerified: false, // Pending verification
      }));
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

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
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-skyblue rounded-full flex items-center justify-center mx-auto mb-4 text-white font-semibold text-xl">
                  PS
                </div>
                <h3 className="font-semibold text-gray-800">
                  {profile.fullName}
                </h3>
                <p className="text-gray-600 text-sm">{profile.startupRole}</p>
                <p className="text-gray-500 text-sm">{profile.company}</p>
              </div>

              {/* Verification Status */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email</span>
                  {profile.isEmailVerified ? (
                    <span className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-red-600">Unverified</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phone</span>
                  {profile.isPhoneVerified ? (
                    <span className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-red-600">Unverified</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">KYC</span>
                  {profile.isKYCVerified ? (
                    <span className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ideas Posted</span>
                  <span className="font-semibold">{profile.ideasPosted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Proposals</span>
                  <span className="font-semibold">
                    {profile.totalProposals}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold">
                    {profile.activeCollaborations}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold">
                    {profile.completedProjects}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Equity</span>
                  <span className="font-semibold text-skyblue">
                    {profile.totalEquityOffered}%
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-6 pt-6 border-t border-gray-200 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-skyblue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-navy">
                        Profile Information
                      </h2>
                      <p className="text-gray-600">
                        Manage your personal information and public profile
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        isEditing ? handleProfileUpdate() : setIsEditing(true)
                      }
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors disabled:opacity-50"
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-gray-50"
                          />
                          {profile.isEmailVerified && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent disabled:bg-gray-50"
                          />
                          {!profile.isPhoneVerified && (
                            <button
                              onClick={handleVerifyPhone}
                              className="px-3 py-2 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors text-sm"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={profile.company}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={profile.startupRole}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              startupRole: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          value={profile.linkedin}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              linkedin: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={profile.website}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent disabled:bg-gray-50 resize-none"
                        placeholder="Tell developers about your background and startup experience..."
                      />
                    </div>

                    {/* KYC Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Identity Verification
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              KYC Document
                            </p>
                            <p className="text-sm text-gray-600">
                              {profile.kycDocument || "No document uploaded"}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {profile.kycDocument && (
                              <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                                <Download className="w-5 h-5" />
                              </button>
                            )}
                            <label className="p-2 text-gray-400 hover:text-skyblue transition-colors cursor-pointer">
                              <Upload className="w-5 h-5" />
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) =>
                                  handleKYCUpload(e.target.files)
                                }
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-navy">
                      Account Settings
                    </h2>
                    <p className="text-gray-600">
                      Manage your account security and preferences
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Password Change */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Change Password
                      </h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          disabled={
                            !currentPassword ||
                            !newPassword ||
                            newPassword !== confirmPassword
                          }
                          className="px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Data Export */}
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Data Export
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Download all your data including ideas, proposals, and
                        contracts.
                      </p>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export Data</span>
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">
                        Delete Account
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-navy">
                      Notification Preferences
                    </h2>
                    <p className="text-gray-600">
                      Choose which notifications you want to receive
                    </p>
                  </div>

                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {notification.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {notification.description}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleNotificationToggle(notification.id)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notification.enabled ? "bg-skyblue" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notification.enabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-navy">
                      Privacy Settings
                    </h2>
                    <p className="text-gray-600">
                      Control your privacy and data sharing preferences
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Profile Visibility
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Control who can see your profile information
                      </p>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Public - Visible to all developers</option>
                        <option>Limited - Only verified developers</option>
                        <option>Private - Only invited developers</option>
                      </select>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Contact Information
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Choose which contact details to share with developers
                      </p>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Share email address</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Share phone number</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">
                            Share LinkedIn profile
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Data Sharing
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Control how your data is used
                      </p>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">
                            Allow analytics for platform improvement
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">
                            Share anonymized data for research
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">
                Delete Account
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete your account? This action cannot
                be undone and you will lose all your data.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
