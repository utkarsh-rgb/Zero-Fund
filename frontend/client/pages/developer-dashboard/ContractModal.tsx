import { X, FileText, Users, Calendar, Shield, TrendingUp, AlertCircle, CheckCircle, Clock, Briefcase, Scale, Lock, FileCheck } from "lucide-react";
import removeMarkdown from "remove-markdown";


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
  const milestones = parseMilestones(contract.milestones);

const parseTextToPlainText = (input?: string): string => {
  if (!input || typeof input !== "string") return "";

  let text = removeMarkdown(input, {
    stripListLeaders: true,
    useImgAltText: false
  });

  text = text
    .replace(/[#>*_`~\-]/g, "")          // remove markdown symbols
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")  // links → text
    .replace(/\n{3,}/g, "\n\n")          // normalize newlines
    .replace(/[ ]{2,}/g, " ")            // extra spaces
    .trim();

  return text;
};


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3 sm:p-4 md:p-6"
      onClick={closeModal}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-blue-600 px-4 sm:px-6 md:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                  {contract.project_title || "Contract Details"}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">Contract ID: {contract.id}</p>
              </div>
            </div>
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
              onClick={closeModal}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-160px)]">
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-6">
            
            {/* Project Overview */}
            <Section title="Project Overview" icon={<Briefcase className="w-5 h-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="Project Title" value={contract.project_title} icon={<FileCheck className="w-4 h-4 text-blue-600" />} />
                <InfoCard label="Timeline" value={contract.timeline} icon={<Calendar className="w-4 h-4 text-purple-600" />} />
                <InfoCard label="Equity Percentage" value={contract.equity_percentage} icon={<TrendingUp className="w-4 h-4 text-green-600" />} highlight />
                <InfoCard label="Status" value={contract.status} icon={<CheckCircle className="w-4 h-4 text-green-600" />} />
              </div>

              <DescriptionCard label="Project Description" value={parseTextToPlainText(contract.project_description)} />
              <DescriptionCard label="Scope" value={contract.scope} />
            </Section>

            {/* Parties */}
            <Section title="Parties Involved" icon={<Users className="w-5 h-5" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PartyCard label="Entrepreneur" name={contract.entrepreneur_name} role="Project Owner" color="purple" />
                <PartyCard label="Developer" name={contract.developer_name} role="Technical Lead" color="blue" />
              </div>
            </Section>

            {/* Milestones */}
            {contract.milestones && milestones.length > 0 && (
              <Section title="Project Milestones" icon={<Clock className="w-5 h-5" />}>
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <MilestoneCard key={index} milestone={milestone} index={index} />
                  ))}
                </div>
              </Section>
            )}

            {/* Legal Terms */}
            <Section title="Legal Terms" icon={<Scale className="w-5 h-5" />}>
              <div className="grid grid-cols-1 gap-3">
                <LegalCard label="IP Ownership" value={contract.ip_ownership} icon={<Shield className="w-4 h-4 text-gray-600" />} />
                <LegalCard label="Confidentiality" value={contract.confidentiality} icon={<Lock className="w-4 h-4 text-gray-600" />} />
                <LegalCard label="Termination Clause" value={contract.termination_clause} icon={<AlertCircle className="w-4 h-4 text-gray-600" />} />
                <LegalCard label="Dispute Resolution" value={contract.dispute_resolution} icon={<Scale className="w-4 h-4 text-gray-600" />} />
                <LegalCard label="Governing Law" value={contract.governing_law} icon={<FileCheck className="w-4 h-4 text-gray-600" />} />
                <LegalCard label="Support Terms" value={contract.support_terms} icon={<CheckCircle className="w-4 h-4 text-gray-600" />} />
              </div>
            </Section>

            {/* Additional Clauses */}
            {contract.additional_clauses && (
              <Section title="Additional Clauses" icon={<FileText className="w-5 h-5" />}>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {parseAdditionalClauses(contract.additional_clauses)}
                  </p>
                </div>
              </Section>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 md:px-8 py-4 border-t border-gray-200">
          <button
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm sm:text-base transition-colors"
            onClick={closeModal}
          >
            Close Contract
          </button>
        </div>
      </div>
    </div>
  );
}

// Components

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoCard({ label, value, icon, highlight }: { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg border ${highlight ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">{label}</p>
          <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">{value || 'N/A'}</p>
        </div>
        <div className="flex-shrink-0">{icon}</div>
      </div>
    </div>
  );
}

function DescriptionCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed break-words">{value || 'N/A'}</p>
    </div>
  );
}

function PartyCard({ label, name, role, color }: { label: string; name: string; role: string; color: string }) {
  const colorClasses = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
  };

  return (
    <div className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colorClasses[color]} rounded-full flex items-center justify-center flex-shrink-0`}>
          <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-base sm:text-lg font-bold text-gray-900 truncate">{name || 'N/A'}</p>
          <p className="text-xs sm:text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, index }: { milestone: string; index: number }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        {index + 1}
      </div>
      <p className="text-sm text-gray-700 flex-1 pt-1 break-words">{milestone}</p>
    </div>
  );
}

function LegalCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
          <p className="text-sm text-gray-600 leading-relaxed break-words">{value || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}