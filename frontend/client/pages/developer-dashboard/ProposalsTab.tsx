import { ChevronRight } from "lucide-react";
import { Proposal } from "./types";
import { StatusBadge } from "./Badges";

interface ProposalsTabProps {
  proposals: Proposal[];
}

export default function ProposalsTab({ proposals }: ProposalsTabProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">My Proposals</h1>
        <p className="text-gray-600">Track the status of your submitted proposals</p>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-navy">{proposal.ideaTitle}</h3>
                <p className="text-sm text-gray-600">Founder: {proposal.founderName}</p>
              </div>
              <StatusBadge status={proposal.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Equity Proposed:</span>
                <p className="font-semibold text-skyblue">{proposal.equityProposed}%</p>
              </div>
              <div>
                <span className="text-gray-500">Submitted:</span>
                <p className="font-semibold">
                  {new Date(proposal.submittedAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1 lg:text-right">
                <button className="flex items-center space-x-1 text-skyblue hover:text-navy transition-colors lg:ml-auto">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
