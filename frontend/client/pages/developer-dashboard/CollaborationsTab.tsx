import { Users } from "lucide-react";
import ContractModal from "./ContractModal";

interface CollaborationsTabProps {
  collaborations: any[];
  collaborationsLoading: boolean;
  openModal: (contract: any) => void;
  closeModal: () => void;
  isModalOpen: boolean;
  selectedContract: any;
  navigate: any;
}

export default function CollaborationsTab({
  collaborations,
  collaborationsLoading,
  openModal,
  closeModal,
  isModalOpen,
  selectedContract,
  navigate,
}: CollaborationsTabProps) {
  const activeCollaborations = collaborations.filter(
    (c: any) => c.signed_by_developer && c.signed_by_entrepreneur
  );

  return (
    <div className="space-y-3">
      {collaborationsLoading ? (
        <LoadingState />
      ) : activeCollaborations.length === 0 ? (
        <EmptyState />
      ) : (
        activeCollaborations.map((c: any) => (
          <CollaborationCard
            key={c.id}
            collaboration={c}
            openModal={openModal}
            navigate={navigate}
          />
        ))
      )}

      {isModalOpen && selectedContract && (
        <ContractModal contract={selectedContract} closeModal={closeModal} />
      )}
    </div>
  );
}

interface CollaborationCardProps {
  collaboration: any;
  openModal: (contract: any) => void;
  navigate: any;
}

function CollaborationCard({ collaboration, openModal, navigate }: CollaborationCardProps) {
  return (
    <div className="p-3 border rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      <div>
        <p>
          <strong>Contract ID:</strong> {collaboration.id}
        </p>
        <p>
          <strong>Project Title:</strong> {collaboration.project_title || "N/A"}
        </p>
        <p>
          <strong>Entrepreneur:</strong> {collaboration.entrepreneur_name || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {collaboration.status}
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-2 md:mt-0">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => openModal(collaboration)}
        >
          View Details
        </button>

        <button
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() =>
            navigate(`/developer-chat?entrepreneur=${collaboration.entrepreneur_id}`)
          }
        >
          Chat with Entrepreneur
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skyblue mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Loading Collaborations...
        </h3>
        <p className="text-gray-500">Please wait while we fetch your active collaborations</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">
        No Active Collaborations
      </h3>
      <p className="text-gray-500">Sign contracts to start collaborating</p>
    </div>
  );
}
