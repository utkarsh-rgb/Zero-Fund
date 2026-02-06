import { Globe } from "lucide-react";
import { UserData } from "./types";

interface ProfileHeaderProps {
  user: UserData;
  setUser: (user: UserData) => void;
}

export default function ProfileHeader({ user, setUser }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>

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
          onChange={(e) => setUser({ ...user, location: e.target.value })}
          className="bg-transparent focus:outline-none border-b border-transparent focus:border-blue-600"
        />
      </div>
    </div>
  );
}
