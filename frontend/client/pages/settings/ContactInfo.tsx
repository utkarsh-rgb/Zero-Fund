import { Mail } from "lucide-react";
import { UserData } from "./types";

interface ContactInfoProps {
  user: UserData;
  setUser: (user: UserData) => void;
}

export default function ContactInfo({ user, setUser }: ContactInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>

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
  );
}
