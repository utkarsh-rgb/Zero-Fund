import { User, Trash2 } from "lucide-react";
import { UserData, SocialLink } from "./types";

interface SocialLinksSectionProps {
  user: UserData;
  setUser: (user: UserData) => void;
}

export default function SocialLinksSection({ user, setUser }: SocialLinksSectionProps) {
  const addSocialLink = () => {
    setUser({
      ...user,
      socialLinks: [...(user.socialLinks || []), { platform: "", url: "" }],
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...(user.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setUser({ ...user, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = (user.socialLinks || []).filter((_, i) => i !== index);
    setUser({ ...user, socialLinks: newLinks });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
        <button
          onClick={addSocialLink}
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
              onChange={(e) => updateSocialLink(idx, "platform", e.target.value)}
              placeholder="Platform (e.g., GitHub)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
              placeholder="URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeSocialLink(idx)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
