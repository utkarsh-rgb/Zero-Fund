import { Shield, Eye, MessageCircle } from "lucide-react";
import ContractModal from "./ContractModal";

interface ContractsTabProps {
  collaborations: any[];
  collaborationsLoading: boolean;
  openModal: (contract: any) => void;
  closeModal: () => void;
  isModalOpen: boolean;
  selectedContract: any;
  navigate: any;
}

export default function ContractsTab({
  collaborations,
  collaborationsLoading,
  openModal,
  closeModal,
  isModalOpen,
  selectedContract,
  navigate,
}: ContractsTabProps) {
  const pendingContracts = collaborations.filter((c: any) => !c.signed_by_developer);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Pending Contracts</h1>
        <p className="text-gray-600">Review and sign contracts sent by entrepreneurs</p>
      </div>

      {collaborationsLoading ? (
        <LoadingState message="Loading Contracts..." />
      ) : pendingContracts.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No Pending Contracts"
          message="You'll see contracts here when entrepreneurs send them"
        />
      ) : (
        <div className="space-y-4">
          {pendingContracts.map((c: any) => (
            <ContractCard
              key={c.id}
              contract={c}
              openModal={openModal}
              navigate={navigate}
            />
          ))}
        </div>
      )}

      {isModalOpen && selectedContract && (
        <ContractModal contract={selectedContract} closeModal={closeModal} />
      )}
    </div>
  );
}

interface ContractCardProps {
  contract: any;
  openModal: (contract: any) => void;
  navigate: any;
}

function ContractCard({ contract, openModal, navigate }: ContractCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-navy">
              {contract.project_title || "Untitled Project"}
            </h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              Awaiting Your Signature
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-gray-500 text-sm">Entrepreneur:</span>
              <p className="font-semibold">{contract.entrepreneur_name || "N/A"}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Equity:</span>
              <p className="font-semibold text-green-600">
                {contract.equity_percentage || "N/A"}%
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Timeline:</span>
              <p className="font-semibold">{contract.timeline || "N/A"}</p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Contract ID:</strong> {contract.id}
            </p>
            <p>
              <strong>Status:</strong> {contract.status}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/contract-review")}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Shield className="w-4 h-4" />
            <span>Review & Sign</span>
          </button>
          <button
            onClick={() => openModal(contract)}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          <button
            onClick={() =>
              navigate(`/developer-chat?entrepreneur=${contract.entrepreneur_id}`)
            }
            className="flex items-center space-x-2 px-6 py-3 border border-skyblue text-skyblue rounded-lg hover:bg-skyblue/10 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Entrepreneur</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skyblue mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">{message}</h3>
        <p className="text-gray-500">Please wait while we fetch your pending contracts</p>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon: any;
  title: string;
  message: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
