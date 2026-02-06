import { Mail } from "lucide-react";
import { UserData } from "./types";

interface DeveloperContactInfoProps {
  user: UserData;
  setUser: (user: UserData) => void;
}

export default function DeveloperContactInfo({ user, setUser }: DeveloperContactInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
