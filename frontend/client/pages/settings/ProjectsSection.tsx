import { User, Trash2 } from "lucide-react";
import { UserData, Project } from "./types";

interface ProjectsSectionProps {
  user: UserData;
  setUser: (user: UserData) => void;
}

export default function ProjectsSection({ user, setUser }: ProjectsSectionProps) {
  const addProject = () => {
    setUser({
      ...user,
      projects: [
        ...(user.projects || []),
        { project_name: "", project_url: "", description: "" },
      ],
    });
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...(user.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setUser({ ...user, projects: newProjects });
  };

  const removeProject = (index: number) => {
    const newProjects = (user.projects || []).filter((_, i) => i !== index);
    setUser({ ...user, projects: newProjects });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        <button
          onClick={addProject}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
        >
          <User className="w-4 h-4" />
          <span>Add project</span>
        </button>
      </div>
      <div className="space-y-4">
        {user.projects?.map((project, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <input
              type="text"
              value={project.project_name}
              onChange={(e) => updateProject(idx, "project_name", e.target.value)}
              placeholder="Project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
            />
            <input
              type="text"
              value={project.project_url}
              onChange={(e) => updateProject(idx, "project_url", e.target.value)}
              placeholder="Project URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={project.description}
              onChange={(e) => updateProject(idx, "description", e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeProject(idx)}
              className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove project</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
