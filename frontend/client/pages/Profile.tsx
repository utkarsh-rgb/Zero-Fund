import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { skillsList } from "./skills";
import DeveloperProfilePic from "./Developer_Profile_Pic";

interface DeveloperData {
  name: string;
  email: string;
  bio?: string;
  location?: string;
  skills?: string[];
  socialLinks?: { platform: string; url: string }[];
  projects?: {
    project_name: string;
    project_url: string;
    description: string;
  }[];
  profilePicture?: string;
}

export default function DeveloperProfile() {
  const [data, setData] = useState<DeveloperData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [newSkill, setNewSkill] = useState<string>("");

  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
const token = localStorage.getItem("jwt_token");
  // Fetch profile data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = routeId || userData.id;

    if (!userId) {
      setError("No developer ID found");
      setLoading(false);
      return;
    }

    console.log("Fetching developer with id:", userId);

   axios
  .get(`http://localhost:5000/developer-profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`, // <-- send token
    },
    withCredentials: true,
  })
  .then((response) => {
    console.log("API Response:", response.data);
    setData({
          name: response.data.fullName || response.data.name,
          email: response.data.email,
          bio: response.data.bio || "",
          location: response.data.location || "",
          skills: response.data.skills || [],
          socialLinks: response.data.socialLinks || [],
          profilePicture: response.data.profilePicture || "",
          projects: (response.data.projects || []).map((p: any) => ({
            project_name: p.project_name,
            project_url: p.project_url,
            description: p.description,
          })),
        });
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [routeId]);

  // Handle form updates
  const handleInputChange = (field: string, value: any) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Handle skills
  const addSkill = () => {
    if (newSkill.trim() && data && !data.skills?.includes(newSkill.trim())) {
      handleInputChange("skills", [...(data.skills || []), newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (data) {
      handleInputChange(
        "skills",
        data.skills?.filter((skill) => skill !== skillToRemove) || [],
      );
    }
  };

  // Handle social links
  const addSocialLink = () => {
    if (data) {
      handleInputChange("socialLinks", [
        ...(data.socialLinks || []),
        { platform: "", url: "" },
      ]);
    }
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    if (data && data.socialLinks) {
      const updated = data.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      );
      handleInputChange("socialLinks", updated);
    }
  };

  const removeSocialLink = (index: number) => {
    if (data && data.socialLinks) {
      handleInputChange(
        "socialLinks",
        data.socialLinks.filter((_, i) => i !== index),
      );
    }
  };

  // Handle projects
  const addProject = () => {
    if (data) {
      handleInputChange("projects", [
        ...(data.projects || []),
        { project_name: "", project_url: "", description: "" },
      ]);
    }
  };

  const updateProject = (index: number, field: string, value: string) => {
    if (data && data.projects) {
      const updated = data.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project,
      );
      handleInputChange("projects", updated);
    }
  };

  const removeProject = (index: number) => {
    if (data && data.projects) {
      handleInputChange(
        "projects",
        data.projects.filter((_, i) => i !== index),
      );
    }
  };

  // Handle Update

  const handleUpdate = async () => {
    if (!data) return;

    setSaving(true);

    try {
      // Get user ID from route or localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = routeId || userData.id;

      if (!userId) {
        alert("User ID not found");
        setSaving(false);
        return;
      }

      // Prepare payload
      const updatePayload = {
        fullName: data.name,
        email: data.email,
        bio: data.bio || "",
        location: data.location || "",
        skills: data.skills || [], // Array of strings
        socialLinks: data.socialLinks || [], // Array of {platform, url}
        profilePicture: data.profilePicture || "",
        projects:
          data.projects?.map((p: any) => ({
            project_name: p.project_name,
            project_url: p.project_url,
            description: p.description,
          })) || [],
      };

      console.log("Updating profile with payload:", updatePayload);
      console.log("Payload being sent:", updatePayload);

      const response = await axios.put(
        `http://localhost:5000/developer-profile/${userId}`,
        updatePayload,
        { withCredentials: true }, // If backend uses cookies for auth
      );

      console.log("Update response:", response.data);
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  console.log(error);
  if (!data) return <div className="p-6 text-center">No data found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-2xl font-bold">Edit Developer Profile</h1>
        </div>
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </div>

      {/* Profile Picture Section */}
      <DeveloperProfilePic
        currentPicture={data.profilePicture}
        userId={
          routeId || JSON.parse(localStorage.getItem("userData") || "{}").id
        }
        onPictureUpdate={(newUrl) =>
          handleInputChange("profilePicture", newUrl)
        }
      />
      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={data.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., New York, USA"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={data.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Skills */}

        {/* Skills */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Skills</h3>

          {/* Already Added Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {data.skills?.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          {/* Dropdown to add new skill */}
          <div className="flex gap-2">
            <select
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a skill</option>
              {skillsList
                .filter((skill) => !data.skills?.includes(skill)) // prevent duplicates
                .map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
            </select>
            <button
              onClick={addSkill}
              disabled={!newSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Social Links</h3>
            <button
              onClick={addSocialLink}
              className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Plus size={16} />
              Add Link
            </button>
          </div>
          <div className="space-y-3">
            {data.socialLinks?.map((link, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={link.platform}
                  onChange={(e) =>
                    updateSocialLink(index, "platform", e.target.value)
                  }
                  placeholder="Platform (e.g., GitHub)"
                  className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) =>
                    updateSocialLink(index, "url", e.target.value)
                  }
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => removeSocialLink(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Projects</h3>
            <button
              onClick={addProject}
              className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
          <div className="space-y-4">
            {data.projects?.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Project {index + 1}</h4>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={project.project_name}
                    onChange={(e) =>
                      updateProject(index, "project_name", e.target.value)
                    }
                    placeholder="Project name"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    value={project.project_url}
                    onChange={(e) =>
                      updateProject(index, "project_url", e.target.value)
                    }
                    placeholder="Project URL"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      updateProject(index, "description", e.target.value)
                    }
                    placeholder="Project description"
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Button */}
        <div className="pt-6 border-t">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
