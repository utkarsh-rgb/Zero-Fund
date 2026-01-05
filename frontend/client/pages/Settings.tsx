import { useState, useEffect } from "react";
import axiosLocal from "../api/axiosLocal";
import {
  User,
  Shield,
  Globe,
  Mail,
  Save,
  Trash2,
  Upload,
  Settings as SettingsIcon,
  Menu,
  X,
} from "lucide-react";
import { Code } from "lucide-react";
import { Loader2 } from "lucide-react";

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



export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<any>(null); // renamed from user
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  // Fetch user data dynamically based on type
  useEffect(() => {
    if (!id || !userType) return;

    const fetchUserData = async () => {
      try {
        const endpoint =
          userType === "developer" ? `/developer/${id}` : `/entrepreneur/${id}`;

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

  // Save changes dynamically based on userType
  const handleSave = async () => {
    if (!id || !jwt_token) return;

    setIsSaving(true);

    try {
      const endpoint =
        userType === "developer" ? `/developer/${id}` : `/entrepreneur/${id}`;

      await axiosLocal.put(endpoint, user, {
        headers: { Authorization: `Bearer ${jwt_token}` },
      });

      console.log(user);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false); // ✅ ALWAYS stop loader
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="w-[360px] rounded-3xl bg-white border border-gray-100 shadow-xl p-10 text-center">
          {/* Logo */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-skyblue to-navy flex items-center justify-center shadow-md mb-6">
            <Code className="w-7 h-7 text-white animate-pulse" />
          </div>

          {/* Skeleton Title */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto mb-6 animate-pulse" />

          {/* Loading Dots */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-navy animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-skyblue animate-bounce delay-150" />
            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-300" />
          </div>

          <p className="text-sm text-gray-500">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Section */}
        {activeSection === "profile" && userType === "entrepreneur" && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.fullName}
              </h2>

              <input
                type="text"
                placeholder="Founder & CEO at Startup Name"
                value={user.headline || ""}
                onChange={(e) => setUser({ ...user, headline: e.target.value })}
                className="mt-1 w-full text-gray-600 border-b border-transparent focus:border-blue-600 focus:outline-none bg-transparent"
              />

              <div className="flex items-center text-gray-500 mt-2 text-sm">
                <Globe className="w-4 h-4 mr-1" />
                <input
                  type="text"
                  placeholder="Location"
                  value={user.location || ""}
                  onChange={(e) =>
                    setUser({ ...user, location: e.target.value })
                  }
                  className="bg-transparent focus:outline-none border-b border-transparent focus:border-blue-600"
                />
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Company Information
              </h3>

              <input
                type="text"
                placeholder="Startup / Company Name"
                value={user.companyName || ""}
                onChange={(e) =>
                  setUser({ ...user, companyName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Industry (e.g. FinTech, EdTech)"
                value={user.industry || ""}
                onChange={(e) => setUser({ ...user, industry: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="url"
                placeholder="Company Website"
                value={user.website || ""}
                onChange={(e) => setUser({ ...user, website: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Vision / Pitch */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vision / Pitch
              </h3>

              <textarea
                rows={4}
                placeholder="Briefly describe your startup vision or problem you are solving..."
                value={user.vision || ""}
                onChange={(e) => setUser({ ...user, vision: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact
              </h3>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2 rounded-full text-white transition
          ${isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}

        {activeSection === "profile" && userType === "developer" && (
          <div className="space-y-4">
            {/* Profile Header Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Cover Photo */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

              {/* Profile Info */}
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5 -mt-16 mb-4">
                  {/* Profile Picture - Developer Only */}
                  {userType === "developer" && (
                    <div className="relative">
                     <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg relative">
  {(isUploading || isImageLoading) && (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}

  {user?.profile_pic ? (
    <img
      src={user.profile_pic}
      alt="Profile"
      className={`w-full h-full object-cover transition-opacity duration-300 ${
        isImageLoading ? "opacity-0" : "opacity-100"
      }`}
      onLoad={() => setIsImageLoading(false)}
      onError={() => setIsImageLoading(false)}
      onLoadStart={() => setIsImageLoading(true)}
    />
  ) : (
    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
      <span className="text-white font-bold text-4xl">
        {user?.fullName?.charAt(0).toUpperCase()}
      </span>
    </div>
  )}
</div>

                      <label
                        htmlFor="uploadProfile"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 shadow-lg"
                      >
                        <Upload className="w-5 h-5 text-gray-600" />
                        <input
                          type="file"
                          id="uploadProfile"
                          hidden
                          accept="image/*"
                          onChange={async (e) => {
                            if (!e.target.files?.[0]) return;
                            const file = e.target.files[0];
                            const tempUrl = URL.createObjectURL(file);
                            setUser({ ...user, profile_pic: tempUrl });
                            setIsUploading(true);

                            const formData = new FormData();
                            formData.append("profile_pic", file);

                            try {
                              const token = localStorage.getItem("jwt_token");
                              const res = await axiosLocal.post(
                                `/developer/${id}/upload`,
                                formData,
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": undefined,
                                  },
                                },
                              );
                              setUser({
                                ...user,
                                profile_pic: res.data.profile_pic,
                              });
                            } catch (err) {
                              console.error(err);
                              alert("Upload failed");
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {/* Name and Location */}
                  <div className="flex-1 mt-4 sm:mt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <input
                          type="text"
                          value={user.fullName || ""}
                          onChange={(e) =>
                            setUser({ ...user, fullName: e.target.value })
                          }
                          className="text-2xl font-bold text-gray-900 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600 focus:outline-none mb-1 bg-transparent"
                        />
                        <div className="flex items-center text-gray-600 mt-1">
                          <Globe className="w-4 h-4 mr-1" />
                          <input
                            type="text"
                            value={user.location || ""}
                            onChange={(e) =>
                              setUser({ ...user, location: e.target.value })
                            }
                            placeholder="Add location"
                            className="border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full mt-4 sm:mt-0 transition-all
    ${
      isSaving
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }
    text-white`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-4">
                  <textarea
                    value={user.bio || ""}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    rows={3}
                    placeholder="Add a bio to tell people about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={user.email || ""}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills - Developer Only */}
            {userType === "developer" && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Skills
                  </h2>
                  <button
                    onClick={() =>
                      setUser({ ...user, skills: [...user.skills, ""] })
                    }
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <User className="w-4 h-4" />
                    <span>Add skill</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-1 bg-blue-50 border border-blue-200 rounded-full px-3 py-1"
                    >
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...user.skills];
                          newSkills[idx] = e.target.value;
                          setUser({ ...user, skills: newSkills });
                        }}
                        className="bg-transparent border-none focus:outline-none w-24 text-sm text-blue-700 font-medium"
                      />
                      <button
                        onClick={() => {
                          const newSkills = user.skills.filter(
                            (_, i) => i !== idx,
                          );
                          setUser({ ...user, skills: newSkills });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects - Developer Only */}
            {userType === "developer" && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Projects
                  </h2>
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
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <User className="w-4 h-4" />
                    <span>Add project</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {user.projects?.map((project, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <input
                        type="text"
                        value={project.project_name}
                        onChange={(e) => {
                          const newProjects = [...user.projects];
                          newProjects[idx].project_name = e.target.value;
                          setUser({ ...user, projects: newProjects });
                        }}
                        placeholder="Project name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
                      />
                      <input
                        type="text"
                        value={project.project_url}
                        onChange={(e) => {
                          const newProjects = [...user.projects];
                          newProjects[idx].project_url = e.target.value;
                          setUser({ ...user, projects: newProjects });
                        }}
                        placeholder="Project URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const newProjects = [...user.projects];
                          newProjects[idx].description = e.target.value;
                          setUser({ ...user, projects: newProjects });
                        }}
                        placeholder="Description"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newProjects = user.projects.filter(
                            (_, i) => i !== idx,
                          );
                          setUser({ ...user, projects: newProjects });
                        }}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove project</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links - Developer Only */}
            {userType === "developer" && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Social Links
                  </h2>
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
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <User className="w-4 h-4" />
                    <span>Add link</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {user.socialLinks?.map((link, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => {
                          const newLinks = [...user.socialLinks];
                          newLinks[idx].platform = e.target.value;
                          setUser({ ...user, socialLinks: newLinks });
                        }}
                        placeholder="Platform (e.g., GitHub)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...user.socialLinks];
                          newLinks[idx].url = e.target.value;
                          setUser({ ...user, socialLinks: newLinks });
                        }}
                        placeholder="URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newLinks = user.socialLinks.filter(
                            (_, i) => i !== idx,
                          );
                          setUser({ ...user, socialLinks: newLinks });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
