import { UserData } from "./types";

interface CompanyInfoProps {
  user: UserData;
  setUser: (user: UserData) => void;
}

export default function CompanyInfo({ user, setUser }: CompanyInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>

      <input
        type="text"
        placeholder="Startup / Company Name"
        value={user.companyName || ""}
        onChange={(e) => setUser({ ...user, companyName: e.target.value })}
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
  );
}
