import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";
import {
  Mail,
  MapPin,
  Code,
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";

interface Project {
  project_name: string;
  project_url: string;
  description: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface Developer {
  id: number;
  fullName: string;
  email: string;
  bio: string;
  location: string;
  profile_pic: string | null;
  skills: string[];
  socialLinks: SocialLink[];
  projects: Project[];
}

export default function DeveloperProfile() {
  const { id } = useParams<{ id: string }>();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeveloperProfile = async () => {
      try {
        const response = await axiosLocal.get(`/developer/${id}`);
        setDeveloper(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load developer profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDeveloperProfile();
  }, [id]);

  /* =======================
     Loading State
  ======================= */
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white border shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-skyblue to-navy flex items-center justify-center mb-6">
            <Code className="w-7 h-7 text-white animate-pulse" />
          </div>

          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto mb-6 animate-pulse" />

          <div className="flex justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-navy animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-skyblue animate-bounce delay-150" />
            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-300" />
          </div>

          <p className="text-sm text-gray-500">
            Loading developer profile…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!developer) return null;

  /* =======================
     Profile UI
  ======================= */
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
          {/* Avatar */}
          {developer.profile_pic ? (
            <img
              src={developer.profile_pic}
              alt={developer.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto sm:mx-0"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-navy text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto sm:mx-0">
              {developer.fullName.charAt(0)}
            </div>
          )}

          {/* Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-navy">
              {developer.fullName}
            </h1>

            {developer.location && (
              <p className="flex items-center justify-center sm:justify-start text-gray-600 mt-1 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {developer.location}
              </p>
            )}

            <p className="flex items-center justify-center sm:justify-start text-gray-600 mt-1 text-sm break-all">
              <Mail className="w-4 h-4 mr-1" />
              {developer.email}
            </p>
          </div>
        </div>

        {/* Bio */}
        {developer.bio && (
          <p className="mt-4 text-gray-700 leading-relaxed text-sm sm:text-base">
            {developer.bio}
          </p>
        )}
      </div>

      {/* Skills */}
      {developer.skills?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {developer.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-skyblue/10 text-skyblue rounded-full text-xs sm:text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {developer.projects?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-navy mb-4">
            Projects
          </h2>

          <div className="space-y-4">
            {developer.projects.map((project, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h3 className="font-semibold text-navy text-sm sm:text-base">
                  {project.project_name}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  {project.description}
                </p>

                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs sm:text-sm text-skyblue mt-2"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {developer.socialLinks?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">
            Social Links
          </h2>

          <div className="flex flex-wrap gap-4">
            {developer.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:text-navy text-sm"
              >
                {link.platform === "GitHub" && <Github className="w-5 h-5" />}
                {link.platform === "LinkedIn" && (
                  <Linkedin className="w-5 h-5" />
                )}
                <span>{link.platform}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
