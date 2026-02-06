import { Users, FileText, CheckCircle2, Briefcase, Eye, Calendar, Award } from "lucide-react";
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
    <div className="space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Collaborations</h2>
          <p className="text-sm text-gray-600 mt-1">
            {activeCollaborations.length} active project{activeCollaborations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      {collaborationsLoading ? (
        <LoadingState />
      ) : activeCollaborations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {activeCollaborations.map((c: any, index: number) => (
            <CollaborationCard
              key={c.id}
              collaboration={c}
              openModal={openModal}
              index={index}
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

interface CollaborationCardProps {
  collaboration: any;
  openModal: (contract: any) => void;
  index: number;
}

function CollaborationCard({ collaboration, openModal, index }: CollaborationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
      style={{
        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
      }}
      onClick={() => openModal(collaboration)}
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {collaboration.project_title || "Untitled Project"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">ID: {collaboration.id}</p>
            </div>
          </div>
          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collaboration.status)}`}>
            {collaboration.status || 'Active'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Entrepreneur */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600">Collaborating with</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {collaboration.entrepreneur_name || "Entrepreneur"}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Timeline */}
          {collaboration.timeline && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-blue-700 truncate">{collaboration.timeline}</span>
            </div>
          )}

          {/* Equity */}
          {collaboration.equity_percentage && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-xs text-green-700 truncate">{collaboration.equity_percentage}</span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-700 font-medium">Contract Signed</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100">
        <button
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            openModal(collaboration);
          }}
        >
          <Eye className="w-4 h-4" />
          <span>View Contract Details</span>
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
          Loading Collaborations...
        </h3>
        <p className="text-sm text-gray-600">Please wait while we fetch your data</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-16 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          No Active Collaborations Yet
        </h3>
        <p className="text-gray-600 max-w-md mb-8">
          Start your journey by signing contracts and collaborating with entrepreneurs on exciting projects!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm font-medium text-gray-700">Review Contracts</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">✍️</div>
            <p className="text-sm font-medium text-gray-700">Sign Agreements</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">🚀</div>
            <p className="text-sm font-medium text-gray-700">Start Building</p>
          </div>
        </div>
      </div>
    </div>
  );
}