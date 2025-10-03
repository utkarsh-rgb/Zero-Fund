import { useState, useEffect } from "react";
import axiosLocal from "../api/axiosLocal";
import {
  User,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Save,
  Trash2,
  Upload,
  CheckCircle,
  Settings as SettingsIcon,
} from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface Project {
  project_name: string;
  project_url: string;
  description: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  bio: string;
  location: string;
  skills: string[];
  socialLinks: SocialLink[];
  projects: Project[];
}

interface SecuritySettings {
  twoFactor: boolean;
  loginAlerts: boolean;
  passwordExpiry: boolean;
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<any>(null); // renamed from user

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    loginAlerts: true,
    passwordExpiry: false,
  });

  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : {};
  const userType = userData.userType;
  const jwt_token = localStorage.getItem("jwt_token");

  // Choose ID dynamically based on userType
  const id =
    userType === "user"
      ? userData.user_id || userData.id
      : userData.entrepreneur_id || userData.id;

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("userType");
    window.location.href = "/";
  };

  // Fetch user data dynamically based on type
  useEffect(() => {
    if (!id || !userType) return;

    const fetchUserData = async () => {
      try {
        const endpoint =
          userType === "developer"
            ? `/developer/${id}`
            : `/entrepreneur/${id}`;

        const res = await axiosLocal.get(endpoint, {
          headers: { Authorization: `Bearer ${jwt_token}` },
        });
        console.log(res.data);
        setUser({
          ...res.data,
          skills: res.data.skills || [],
          socialLinks: res.data.socialLinks || [],
          projects: res.data.projects || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id, userType, jwt_token]);

  const sections = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Shield },
  ];

  // Save changes dynamically based on userType
  const handleSave = async () => {
    if (!id || !jwt_token) return;

    try {
      const endpoint =
        userType === "developer"
          ? `/developer/${id}`
          : `/entrepreneur/${id}`;

      await axiosLocal.put(endpoint, user, {
        headers: { Authorization: `Bearer ${jwt_token}` },
      });

      console.log(user);
      alert("Profile updated successfully!");
    } catch (error) {
      
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Profile Picture */}

                  {userType === "developer" && (
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-skyblue rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                        {user?.profile_pic ? (
                          <img
                            src={user.profile_pic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user?.fullName?.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-navy mb-2">
                          Profile Photo
                        </h3>
                        <div className="flex space-x-3">
                          <input
                            type="file"
                            id="uploadProfile"
                            hidden
                            accept="image/*"
                            onChange={async (e) => {
                              if (!e.target.files?.[0]) return;

                              const file = e.target.files[0];
                              const tempUrl = URL.createObjectURL(file); // create temporary URL for preview
                              setUser({ ...user, profile_pic: tempUrl }); // show immediately in UI

                              const formData = new FormData();
                              formData.append("profile_pic", file);

                              try {
                                const token = localStorage.getItem("jwt_token");
                                await axiosLocal.post(
                                  `/developer/${user.id}/upload`,
                                  formData,
                                  {
                                    headers: {
                                      "Content-Type": "multipart/form-data",
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                );
                              } catch (err) {
                                console.error(err);
                                alert("Upload failed");
                              }
                            }}
                          />
                          <label
                            htmlFor="uploadProfile"
                            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload New</span>
                          </label>

                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("jwt_token");
                                await axiosLocal.delete(
                                  `/developer/${user.id}/remove`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                );
                                setUser({ ...user, profile_pic: null });
                              } catch (err) {
                                console.error(err);
                                alert("Remove failed");
                              }
                            }}
                            className="flex items-center space-x-2 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user.fullName ?? ""}
                        onChange={(e) =>
                          setUser({ ...user, fullName: e.target.value })
                        }
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
                          value={user.email ?? ""}
                          onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        />
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={user.location ?? ""}
                        onChange={(e) =>
                          setUser({ ...user, location: e.target.value })
                        }
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
                      value={user.bio ?? ""}
                      onChange={(e) =>
                        setUser({ ...user, bio: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    />
                  </div>

                  {/* Skills */}
                  {userType === "developer" && (
                    <div>
                      <h3 className="font-semibold text-navy mb-2">Skills</h3>
                      {user.skills?.map((skill, idx) => (
                        <div key={idx} className="flex mb-2 space-x-2">
                          <input
                            type="text"
                            value={skill ?? ""}
                            onChange={(e) => {
                              const newSkills = [...user.skills];
                              newSkills[idx] = e.target.value;
                              setUser({ ...user, skills: newSkills });
                            }}
                            className="flex-1 px-2 py-1 border rounded"
                          />
                          <button
                            onClick={() => {
                              const newSkills = user.skills.filter(
                                (_, i) => i !== idx,
                              );
                              setUser({ ...user, skills: newSkills });
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setUser({ ...user, skills: [...user.skills, ""] })
                        }
                        className="px-3 py-1 bg-skyblue text-white rounded"
                      >
                        Add Skill
                      </button>
                    </div>
                  )}
                  {/* Social Links */}
                  {userType === "developer" && (
                    <div>
                      <h3 className="font-semibold text-navy mb-2">
                        Social Links
                      </h3>
                      {user.socialLinks?.map((link, idx) => (
                        <div key={idx} className="flex mb-2 space-x-2">
                          <input
                            type="text"
                            placeholder="Platform"
                            value={link.platform ?? ""}
                            onChange={(e) => {
                              const newLinks = [...user.socialLinks];
                              newLinks[idx].platform = e.target.value;
                              setUser({ ...user, socialLinks: newLinks });
                            }}
                            className="flex-1 px-2 py-1 border rounded"
                          />
                          <input
                            type="text"
                            placeholder="URL"
                            value={link.url ?? ""}
                            onChange={(e) => {
                              const newLinks = [...user.socialLinks];
                              newLinks[idx].url = e.target.value;
                              setUser({ ...user, socialLinks: newLinks });
                            }}
                            className="flex-1 px-2 py-1 border rounded"
                          />
                          <button
                            onClick={() => {
                              const newLinks = user.socialLinks.filter(
                                (_, i) => i !== idx,
                              );
                              setUser({ ...user, socialLinks: newLinks });
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setUser({
                            ...user,
                            socialLinks: [
                              ...user.socialLinks,
                              { platform: "", url: "" },
                            ],
                          })
                        }
                        className="px-3 py-1 bg-skyblue text-white rounded"
                      >
                        Add Link
                      </button>
                    </div>
                  )}
                  {/* Projects */}
                  {userType === "developer" && (
                    <div>
                      <h3 className="font-semibold text-navy mb-2">Projects</h3>
                      {user.projects?.map((p, idx) => (
                        <div
                          key={idx}
                          className="mb-2 space-y-1 border p-2 rounded"
                        >
                          <input
                            type="text"
                            placeholder="Project Name"
                            value={p.project_name ?? ""}
                            onChange={(e) => {
                              const newProjects = [...user.projects];
                              newProjects[idx].project_name = e.target.value;
                              setUser({ ...user, projects: newProjects });
                            }}
                            className="w-full px-2 py-1 border rounded"
                          />
                          <input
                            type="text"
                            placeholder="Project URL"
                            value={p.project_url ?? ""}
                            onChange={(e) => {
                              const newProjects = [...user.projects];
                              newProjects[idx].project_url = e.target.value;
                              setUser({ ...user, projects: newProjects });
                            }}
                            className="w-full px-2 py-1 border rounded"
                          />
                          <textarea
                            placeholder="Description"
                            value={p.description ?? ""}
                            onChange={(e) => {
                              const newProjects = [...user.projects];
                              newProjects[idx].description = e.target.value;
                              setUser({ ...user, projects: newProjects });
                            }}
                            className="w-full px-2 py-1 border rounded"
                          />
                          <button
                            onClick={() => {
                              const newProjects = user.projects.filter(
                                (_, i) => i !== idx,
                              );
                              setUser({ ...user, projects: newProjects });
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setUser({
                            ...user,
                            projects: [
                              ...user.projects,
                              {
                                project_name: "",
                                project_url: "",
                                description: "",
                              },
                            ],
                          })
                        }
                        className="px-3 py-1 bg-skyblue text-white rounded"
                      >
                        Add Project
                      </button>
                    </div>
                  )}
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
