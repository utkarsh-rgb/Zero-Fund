import { User, X } from "lucide-react";
import { UserData } from "./types";

interface SkillsSectionProps {
  user: UserData;
  setUser: (user: UserData) => void;
}

export default function SkillsSection({ user, setUser }: SkillsSectionProps) {
  const addSkill = () => {
    setUser({ ...user, skills: [...(user.skills || []), ""] });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...(user.skills || [])];
    newSkills[index] = value;
    setUser({ ...user, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    const newSkills = (user.skills || []).filter((_, i) => i !== index);
    setUser({ ...user, skills: newSkills });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <button
          onClick={addSkill}
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
              onChange={(e) => updateSkill(idx, e.target.value)}
              className="bg-transparent border-none focus:outline-none w-24 text-sm text-blue-700 font-medium"
              placeholder="Skill"
            />
            <button
              onClick={() => removeSkill(idx)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
