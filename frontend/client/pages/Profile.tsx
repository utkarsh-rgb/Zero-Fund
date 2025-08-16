import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Mail, Edit } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

interface DeveloperData {
  id: number;
  name: string;
  email: string;
}

export default function DeveloperProfile() {
  const [data, setData] = useState<DeveloperData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
      withCredentials: true,
    })
    .then((response) => {
      console.log("API Response:", response.data);

      setData({
        id: response.data.id,
        name: response.data.fullName || response.data.name, // handle backend field
        email: response.data.email,
      });
    })
    .catch((err) => {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    })
    .finally(() => setLoading(false));
}, [routeId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">No data found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-2xl font-bold">Developer Profile</h1>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Edit size={16} /> Edit
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold">{data.name}</h2>
        <div className="mt-4 flex items-center gap-2">
          <Mail size={16} />
          <span>{data.email}</span>
        </div>
      </div>
    </div>
  );
}
