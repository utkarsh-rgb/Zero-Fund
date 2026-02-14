import { Link } from "react-router-dom";
import { CheckCircle, MessageCircle, FileText } from "lucide-react";
import { Proposal } from "./types";
import { getStatusColor } from "./utils";

interface ProposalsTabProps {
  proposals: Proposal[];
  handleProposalAction: (id: number, action: "accept" | "reject") => void;
}

export default function ProposalsTab({
  proposals,
  handleProposalAction,
}: ProposalsTabProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-2">
            Developer Proposals
          </h1>
          <p className="text-gray-600">
            Review and manage proposals submitted for your ideas
          </p>
        </div>
        <div className="text-sm font-medium text-gray-600">
          Total Proposals: {proposals.length}
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {/* Developer Info Row */}
            <div className="flex justify-between items-start mb-4">
              <Link
                to={`/entrepreneur-dashboard/developer-profile/${proposal.developerId}`}
                className="flex items-start space-x-4 hover:opacity-90"
              >
                <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                  {proposal.developerName[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy hover:underline">
                    {proposal.developerName}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Applied for: {proposal.ideaTitle}
                  </p>
                </div>
              </Link>

              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  proposal.status
                )}`}
              >
                {proposal.status}
              </span>
            </div>

            {/* Proposal Details */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Equity Requested:</span>
                <p className="font-semibold text-skyblue">
                  {proposal.equityRequested}%
                </p>
              </div>
              <div>
                <span className="text-gray-500">Timeline:</span>
                <p className="font-semibold">{proposal.timeline}</p>
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
            </div>

            {/* Action Buttons */}
            {proposal.status === "Pending" && (
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    handleProposalAction(Number(proposal.id), "accept")
                  }
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() =>
                    handleProposalAction(Number(proposal.id), "reject")
                  }
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reject
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>
              </div>
            )}

            {(proposal.status === "Accepted" ||
              proposal.status === "Approved") && (
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>

                {proposal.contract_status === "generated" ? (
                  <button
                    onClick={() =>
                      alert(
                        "This contract is already generated and cannot be modified."
                      )
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-80"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generated</span>
                  </button>
                ) : (
                  <Link
                    to={`/contract-builder?proposalId=${proposal.id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generate Contract</span>
                  </Link>
                )}
              </div>
            )}

            {proposal.status === "Rejected" && (
              <p className="text-red-500 font-medium">
                This proposal has been rejected.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
