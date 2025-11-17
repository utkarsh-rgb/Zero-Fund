import { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Users,
  Globe,
  Lock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Send,
} from "lucide-react";

interface NDAControlsProps {
  visibility: "Public" | "Invite Only" | "NDA Required";
  onVisibilityChange: (visibility: string) => void;
  showNDAModal?: boolean;
  onNDAAccept?: () => void;
  onNDAReject?: () => void;
}

export function NDAControls({
  visibility,
  onVisibilityChange,
  showNDAModal = false,
  onNDAAccept,
  onNDAReject,
}: NDAControlsProps) {
  const [isNDAExpanded, setIsNDAExpanded] = useState(false);

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "NDA Required":
        return <Shield className="w-5 h-5 text-orange-600" />;
      case "Invite Only":
        return <Users className="w-5 h-5 text-blue-600" />;
      default:
        return <Globe className="w-5 h-5 text-green-600" />;
    }
  };

  const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
      case "NDA Required":
        return "Developers must sign an NDA before viewing full details";
      case "Invite Only":
        return "Only developers with your invite link can apply";
      default:
        return "Any developer can view and apply to your idea";
    }
  };

  return (
    <>
      {/* Visibility Control */}
      <div className="space-y-3">
        {[
          { value: "Public", label: "Public", icon: Globe },
          { value: "Invite Only", label: "Invite Only", icon: Users },
          { value: "NDA Required", label: "NDA Required", icon: Shield },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onVisibilityChange(option.value)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
              visibility === option.value
                ? "border-skyblue bg-skyblue/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-3">
              <option.icon className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-semibold text-gray-800">{option.label}</h4>
                <p className="text-sm text-gray-600">
                  {getVisibilityDescription(option.value)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* NDA Information */}
      {visibility === "NDA Required" && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">
                NDA Protection Enabled
              </h4>
              <p className="text-sm text-orange-700 mb-3">
                Developers will need to accept a non-disclosure agreement before
                they can view your full idea details. This helps protect your
                intellectual property.
              </p>
              <button
                onClick={() => setIsNDAExpanded(!isNDAExpanded)}
                className="text-sm text-orange-600 hover:text-orange-800 underline"
              >
                {isNDAExpanded ? "Hide" : "View"} NDA Template
              </button>

              {isNDAExpanded && (
                <div className="mt-3 p-3 bg-white border border-orange-200 rounded text-sm text-gray-700">
                  <h5 className="font-semibold mb-2">
                    Standard Non-Disclosure Agreement
                  </h5>
                  <p className="mb-2">
                    By accepting this NDA, the developer agrees to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Keep all shared information strictly confidential</li>
                    <li>Not disclose project details to third parties</li>
                    <li>Use information solely for proposal evaluation</li>
                    <li>Return or destroy materials upon request</li>
                    <li>Maintain confidentiality for 5 years</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NDA Acceptance Modal */}
      {showNDAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy mb-2">
                Non-Disclosure Agreement Required
              </h2>
              <p className="text-gray-600">
                This startup idea contains confidential information protected by
                an NDA
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Agreement Terms:
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  By accepting this Non-Disclosure Agreement, you agree to
                  maintain the confidentiality of all information shared about
                  this startup idea, including:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Business concepts, plans, and strategies</li>
                  <li>Technical specifications and implementation details</li>
                  <li>
                    Market research, financial projections, and business data
                  </li>
                  <li>
                    Any proprietary information, trade secrets, or intellectual
                    property
                  </li>
                </ul>
                <p className="mt-3">
                  <strong>Duration:</strong> This agreement remains in effect
                  for 5 years from the date of acceptance.
                </p>
                <p>
                  <strong>Consequences:</strong> Violation of this agreement may
                  result in legal action and monetary damages.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                id="nda-consent"
                className="w-4 h-4 text-skyblue mt-1"
              />
              <label htmlFor="nda-consent" className="text-sm text-gray-700">
                I have read, understood, and agree to the terms of this
                Non-Disclosure Agreement. I acknowledge that this is a legally
                binding agreement.
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={onNDAReject}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={onNDAAccept}
                className="flex-1 px-4 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors font-semibold"
              >
                Accept NDA & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Trust Badge Component
export function TrustBadge({
  type,
  verified = false,
  className = "",
}: {
  type: "kyc" | "email" | "phone" | "linkedin" | "github";
  verified: boolean;
  className?: string;
}) {
  const getBadgeInfo = (type: string) => {
    switch (type) {
      case "kyc":
        return {
          label: "KYC Verified",
          icon: <Shield className="w-3 h-3" />,
          color: verified
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-600",
        };
      case "email":
        return {
          label: "Email Verified",
          icon: <CheckCircle className="w-3 h-3" />,
          color: verified
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-600",
        };
      case "phone":
        return {
          label: "Phone Verified",
          icon: <CheckCircle className="w-3 h-3" />,
          color: verified
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-600",
        };
      default:
        return {
          label: "Verified",
          icon: <CheckCircle className="w-3 h-3" />,
          color: verified
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-600",
        };
    }
  };

  const badgeInfo = getBadgeInfo(type);

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${badgeInfo.color} ${className}`}
    >
      {badgeInfo.icon}
      <span>{badgeInfo.label}</span>
    </span>
  );
}

// Security Warning Component
export function SecurityWarning({
  level = "info",
  message,
  actions,
}: {
  level?: "info" | "warning" | "error";
  message: string;
  actions?: Array<{ label: string; onClick: () => void; primary?: boolean }>;
}) {
  const getColorClasses = () => {
    switch (level) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getIcon = () => {
    switch (level) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Shield className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getColorClasses()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
          {actions && actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1 text-xs rounded ${
                    action.primary
                      ? "bg-skyblue text-white hover:bg-navy"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  } transition-colors`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Verification Status Component
export function VerificationStatus({
  user,
  compact = false,
}: {
  user: {
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isKYCVerified?: boolean;
    linkedinVerified?: boolean;
    githubVerified?: boolean;
  };
  compact?: boolean;
}) {
  const verifications = [
    { type: "email", verified: user.isEmailVerified || false, label: "Email" },
    { type: "phone", verified: user.isPhoneVerified || false, label: "Phone" },
    { type: "kyc", verified: user.isKYCVerified || false, label: "Identity" },
  ];

  if (compact) {
    const verifiedCount = verifications.filter((v) => v.verified).length;
    return (
      <div className="flex items-center space-x-2">
        <Shield
          className={`w-4 h-4 ${verifiedCount > 1 ? "text-green-500" : "text-gray-400"}`}
        />
        <span className="text-sm text-gray-600">
          {verifiedCount}/{verifications.length} verified
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {verifications.map((verification) => (
        <div
          key={verification.type}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-gray-600">{verification.label}</span>
          <TrustBadge
            type={verification.type as any}
            verified={verification.verified}
          />
        </div>
      ))}
    </div>
  );
}
