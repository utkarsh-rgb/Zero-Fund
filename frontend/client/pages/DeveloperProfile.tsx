import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";
import {
  Mail,
  MapPin,
  Code,
  Github,
  Linkedin,
  ArrowLeft,
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
      console.log("Developer ID:", id);
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

if (loading) {
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

        {/* Text */}
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

  return (
    <div className="max-w-5xl mx-auto p-6">
     

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          {developer.profile_pic ? (
            <img
              src={developer.profile_pic}
              alt={developer.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-navy text-white flex items-center justify-center text-2xl font-bold">
              {developer.fullName[0]}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-navy">
              {developer.fullName}
            </h1>

            {developer.location && (
              <p className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {developer.location}
              </p>
            )}

            <p className="flex items-center text-gray-600 mt-1">
              <Mail className="w-4 h-4 mr-1" />
              {developer.email}
            </p>
          </div>
        </div>

        {/* Bio */}
        {developer.bio && (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {developer.bio}
          </p>
        )}
      </div>

      {/* Skills */}
      {developer.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-navy mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {developer.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-skyblue/10 text-skyblue rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {developer.projects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-navy mb-4">
            Projects
          </h2>

          <div className="space-y-4">
            {developer.projects.map((project, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h3 className="font-semibold text-navy">
                  {project.project_name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {project.description}
                </p>

                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-skyblue mt-2"
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
      {developer.socialLinks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">
            Social Links
          </h2>

          <div className="flex space-x-4">
            {developer.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:text-navy"
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
