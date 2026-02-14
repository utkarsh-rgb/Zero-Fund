import { NavigateFunction } from "react-router-dom";
import { Collaboration } from "./types";

interface CollaborationTabProps {
  collaboration: Collaboration[];
  navigate: NavigateFunction;
}

export default function CollaborationTab({
  collaboration,
  navigate,
}: CollaborationTabProps) {
  if (collaboration.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-600">No signed collaborations yet.</p>
      </div>
    );
  }
return (
  <div className="space-y-5">
    {collaboration.map((c) => (
      <div
        key={c.id}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 
                   hover:shadow-lg transition-all duration-300"
      >
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          
          {/* LEFT SECTION */}
          <div className="space-y-3 flex-1">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {c.project_title || "Untitled Project"}
              </h2>

              <span
  className={`px-3 py-1 text-xs font-medium rounded-full ${
    c.signed_by_entrepreneur && c.signed_by_developer
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700"
  }`}
>
  {c.signed_by_entrepreneur && c.signed_by_developer
    ? "Signed by Both Parties"
    : c.signed_by_entrepreneur
    ? "Waiting for Developer Signature"
    : c.signed_by_developer
    ? "Waiting for Entrepreneur Signature"
    : "Not Signed Yet"}
</span>

            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Contract ID:</span>{" "}
                #{c.id}
              </p>
              <p>
                <span className="font-medium text-gray-800">Developer:</span>{" "}
                {c.developer_name || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-800">Timeline:</span>{" "}
                {c.timeline || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-800">Equity:</span>{" "}
                {c.equity_percentage || "N/A"}%
              </p>
            </div>

            {/* Signatures */}
            <div className="flex gap-4 pt-2 text-sm">
              <div
                className={`px-3 py-1 rounded-full ${
                  c.signed_by_entrepreneur
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Entrepreneur {c.signed_by_entrepreneur ? "✓ Signed" : "✗ Pending"}
              </div>

              <div
                className={`px-3 py-1 rounded-full ${
                  c.signed_by_developer
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Developer {c.signed_by_developer ? "✓ Signed" : "✗ Pending"}
              </div>
            </div>

            {/* Legal Info */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p><strong>IP:</strong> {c.ip_ownership || "N/A"}</p>
              <p><strong>Confidentiality:</strong> {c.confidentiality || "N/A"}</p>
            </div>
          </div>

          {/* RIGHT SECTION - ACTIONS */}
          <div className="flex lg:flex-col gap-3 justify-end">
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white 
                         hover:bg-blue-700 transition font-medium"
              onClick={() => console.log("View full contract", c)}
            >
              View Details
            </button>

            <button
              className="px-4 py-2 rounded-lg bg-gray-900 text-white 
                         hover:bg-black transition font-medium"
              onClick={() => navigate(`/entrepreneur-dashboard/message/${c.id}`)}

            >
              Chat
            </button>
          </div>

        </div>
      </div>
    ))}
  </div>
);

}
