import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosLocal from "../api/axiosLocal";
import {
  MapPin,
  Globe,
  BadgeCheck,
  Mail,
  Building2,
  Briefcase
} from "lucide-react";

export default function FounderProfile() {
  const { id } = useParams();
  const [founder, setFounder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosLocal.get(`/entrepreneur/${id}`).then((res) => {
      setFounder(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading founder profile…</p>;
  }

  if (!founder) {
    return <p className="text-center mt-10">Founder not found</p>;
  }

  const display = (value: any) => value || "—";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-8">

        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-6">
          <div className="w-20 h-20 rounded-full bg-navy text-white flex items-center justify-center text-3xl font-bold">
            {founder.fullName?.charAt(0)}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {display(founder.fullName)}
              {founder.is_verified === 1 && (
                <BadgeCheck className="w-5 h-5 text-blue-600" />
              )}
            </h1>

            <p className="text-gray-600">
              {display(founder.headline)}
            </p>

            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {display(founder.location)}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">

          <Info label="Company" value={founder.companyName} icon={Building2} />
          <Info label="Industry" value={founder.industry} icon={Briefcase} />
          <Info label="Email" value={founder.email} icon={Mail} />
          <Info label="Website" value={founder.website} icon={Globe} />

        </div>

        {/* Bio */}
        <Section title="About">
          {display(founder.bio)}
        </Section>

        {/* Vision */}
        <Section title="Vision">
          {display(founder.vision)}
        </Section>

      </div>
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

function Info({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-3 border rounded-lg p-4">
      <Icon className="w-5 h-5 text-blue-600" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
}
