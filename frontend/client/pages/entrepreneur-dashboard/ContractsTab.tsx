import { Link } from "react-router-dom";
import { Shield, MessageCircle } from "lucide-react";
import { Proposal } from "./types";

interface ContractsTabProps {
  proposals: Proposal[];
}

export default function ContractsTab({ proposals }: ContractsTabProps) {
  const approved = proposals.filter((p) => p.status === "Approved");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Contracts</h1>
        <p className="text-gray-600">
          Generate and manage contracts for accepted proposals
        </p>
      </div>

      <div className="space-y-4">
        {approved.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Contracts Ready
            </h3>
            <p className="text-gray-500">
              Accept proposals first to generate contracts
            </p>
          </div>
        ) : (
          approved.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-navy">
                      {proposal.ideaTitle}
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Proposal Approved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-gray-500 text-sm">Developer:</span>
                      <p className="font-semibold">{proposal.developerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Equity:</span>
                      <p className="font-semibold text-green-600">
                        {proposal.equityRequested}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Timeline:</span>
                      <p className="font-semibold">{proposal.timeline}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-gray-500 text-sm">Scope:</span>
                    <p className="text-gray-700 line-clamp-2">{proposal.scope}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {proposal.contract_status === "generated" ? (
                    <button
                      disabled
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-80"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">Contract Generated</span>
                    </button>
                  ) : (
                    <Link
                      to={`/contract-builder?proposalId=${proposal.id}`}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-skyblue to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">Generate Contract</span>
                    </Link>
                  )}

                  <Link
                    to={`/entrepreneur-chat?developer=${proposal.developerId}`}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat with Developer</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
