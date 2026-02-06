interface ContractModalProps {
  contract: any;
  closeModal: () => void;
}

export default function ContractModal({ contract, closeModal }: ContractModalProps) {
  const parseMilestones = (milestones: string) => {
    try {
      return JSON.parse(milestones);
    } catch {
      return [];
    }
  };

  const parseAdditionalClauses = (clauses: string) => {
    try {
      const parsed = JSON.parse(clauses);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
      if (typeof parsed === "object") {
        return Object.values(parsed).join(", ");
      }
      return parsed;
    } catch {
      return clauses;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={closeModal}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Contract Details</h2>

        <div className="space-y-3">
          <DetailRow label="Project Title" value={contract.project_title} />
          <DetailRow label="Entrepreneur" value={contract.entrepreneur_name} />
          <DetailRow label="Developer" value={contract.developer_name} />
          <DetailRow label="Timeline" value={contract.timeline} />
          <DetailRow label="Equity" value={contract.equity_percentage} />
          <DetailRow label="Status" value={contract.status} />
          <DetailRow label="IP Ownership" value={contract.ip_ownership} />
          <DetailRow label="Confidentiality" value={contract.confidentiality} />
          <DetailRow label="Termination Clause" value={contract.termination_clause} />
          <DetailRow label="Dispute Resolution" value={contract.dispute_resolution} />
          <DetailRow label="Governing Law" value={contract.governing_law} />
          <DetailRow label="Support Terms" value={contract.support_terms} />
          <DetailRow label="Project Description" value={contract.project_description} />
          <DetailRow label="Scope" value={contract.scope} />

          {contract.milestones && (
            <div>
              <strong>Milestones:</strong>
              <ul className="list-disc pl-5 mt-1">
                {parseMilestones(contract.milestones).map((milestone, index) => (
                  <li key={index}>{milestone}</li>
                ))}
                {parseMilestones(contract.milestones).length === 0 && (
                  <li className="text-red-500">Invalid milestone data</li>
                )}
              </ul>
            </div>
          )}

          {contract.additional_clauses && (
            <div>
              <strong>Additional Clauses:</strong>
              <p className="mt-1">{parseAdditionalClauses(contract.additional_clauses)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );
}
