import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  CreditCard,
  Globe,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Save,
  Edit,
  Trash2,
  Download,
  Upload,
  Lock,
  CheckCircle,
  AlertCircle,
  Phone,
  Code,
  Lightbulb,
  Settings as SettingsIcon,
  ChevronRight,
} from "lucide-react";



interface SecuritySettings {
  twoFactor: boolean;
  loginAlerts: boolean;
  passwordExpiry: boolean;
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    loginAlerts: true,
    passwordExpiry: false,
  });

  
const userDataString = localStorage.getItem("userData");
const userData = userDataString ? JSON.parse(userDataString) : {};
const userType = userData.userType;
console.log(userType);
  const handleLogout = () => {
  localStorage.removeItem("jwt_token");
    localStorage.removeItem("userType");
    window.location.href = "/";
  };

  const sections = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Shield },
   ];

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
                {userInitials}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-navy mb-4">Settings</h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-skyblue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{section.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-navy">
                    Profile Settings
                  </h1>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-skyblue rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {userInitials}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-navy mb-2">
                        Profile Photo
                      </h3>
                      <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>Upload New</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={userName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          defaultValue={userEmail}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        />
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+91 98765 43210"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        defaultValue="Mumbai, India"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      defaultValue={
                        userType === "entrepreneur"
                          ? "Passionate entrepreneur with 5+ years of experience in ed-tech. Looking to build innovative solutions that make education accessible to everyone."
                          : "Full-stack developer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable solutions and contributing to innovative startups."
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-navy mb-6">
                  Security Settings
                </h1>

                <div className="space-y-8">
                  {/* Password */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-4">
                      Password
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent pr-10"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                      Update Password
                    </button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium">SMS Authentication</p>
                            <p className="text-sm text-gray-500">
                              Receive codes via SMS
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={security.twoFactor}
                            onChange={(e) =>
                              setSecurity({
                                ...security,
                                twoFactor: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-skyblue"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Login Alerts */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-4">
                      Login Alerts
                    </h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            Email notifications for new logins
                          </p>
                          <p className="text-sm text-gray-500">
                            Get alerted when someone logs into your account
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.loginAlerts}
                          onChange={(e) =>
                            setSecurity({
                              ...security,
                              loginAlerts: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-skyblue"></div>
                      </label>
                    </div>
                  </div>

                  {/* Connected Apps */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-4">
                      Connected Apps
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">GitHub</p>
                            <p className="text-sm text-gray-500">
                              Connected 2 days ago
                            </p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-800 transition-colors">
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
