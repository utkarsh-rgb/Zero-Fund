import { Contract } from "./types";
import { capitalizeWords } from "./utils";

interface PendingContractsTabProps {
  pendingContracts: Contract[];
  handleAcceptContract: (id: number) => void;
  handleRejectContract: (id: number) => void;
}

export default function PendingContractsTab({
  pendingContracts,
  handleAcceptContract,
  handleRejectContract,
}: PendingContractsTabProps) {
  if (pendingContracts.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-600">No pending contracts from developers.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {pendingContracts.map((contract) => (
        <div
          key={contract.id}
          className="p-4 border rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
        >
          <div>
            <p>
              <strong>Contract ID:</strong> {contract.id}
            </p>
            <p>
              <strong>Title:</strong>{" "}
              {contract.project_title
                ? capitalizeWords(contract.project_title)
                : "N/A"}
            </p>
            <p>
              <strong>Developer:</strong>{" "}
              {contract.developer_name
                ? capitalizeWords(contract.developer_name)
                : "N/A"}
            </p>
            <p className="mt-2 text-gray-700">
              This contract has been signed by the developer. By clicking{" "}
              <strong>Accept</strong>, you also agree and sign the contract.
              After accepting, you can view the details in the{" "}
              <strong>Collaborations</strong> tab. If you click{" "}
              <strong>Reject</strong>, you can't undo this decision.
            </p>
          </div>

          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              onClick={() => handleAcceptContract(contract.id)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Accept
            </button>
            <button
              onClick={() => handleRejectContract(contract.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
