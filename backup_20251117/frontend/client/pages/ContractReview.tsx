import { useEffect, useState } from "react";
import axiosLocal from "../api/axiosLocal";
import { Link, redirect, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Download,
  CheckCircle,
  Shield,
  AlertCircle,
  User,
  Eye,
  Edit,
  Send,
  Clock,
  FileText,
} from "lucide-react";

interface ContractSection {
  id: string;
  title: string;
  content: string;
  isEditable?: boolean;
}

interface ContractData {
  id: string;
  title: string;
  createdDate: string;
  parties: {
    entrepreneur: {
      name: string;
      email: string;
      company: string;
      address: string;
    };
    developer: {
      name: string;
      email: string;
      skills: string[];
      address: string;
    };
  };
  projectDetails: {
    name: string;
    description: string;
    scope: string;
    timeline: string;
    equity: string;
    milestones: any[];
  };
  ip_ownership: string;
  confidentiality: string;
  support_terms: string;
  termination_clause: string;
  dispute_resolution: string;
  governing_law: string;
  additional_clauses: string[];
}

export default function ContractReview() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [agreedSections, setAgreedSections] = useState<Set<string>>(new Set());
  const [finalAgreement, setFinalAgreement] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [requestedChanges, setRequestedChanges] = useState("");
  const [signatureStep, setSignatureStep] = useState<
    "review" | "confirm" | "sign" | "complete"
  >("review");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [sections, setSections] = useState<ContractSection[]>([]);

  // Fetch contract data from backend
  useEffect(() => {
    const fetchContractDraft = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const developerId = userData?.id;

        if (!developerId) {
          setError("Developer ID not found");
          setLoading(false);
          return;
        }

        const response = await axiosLocal.get(
          `/developer-contract-draft?developerId=${developerId}`,
        );

        if (response.data.success) {
          setContractData(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch contract");
        }
      } catch (err) {
        console.error("Error fetching contract:", err);
        setError("Server error while fetching contract");
      } finally {
        setLoading(false);
      }
    };

    fetchContractDraft();
  }, []);

  // Build sections dynamically when contract data is loaded
  useEffect(() => {
    if (!contractData) return;

    const buildSections = (): ContractSection[] => [
      {
        id: "parties",
        title: "1. Parties to the Agreement",
        content: `This Collaboration Agreement is entered into between:

ENTREPRENEUR: ${contractData.parties.entrepreneur.name}
Email: ${contractData.parties.entrepreneur.email}
Company: ${contractData.parties.entrepreneur.company}
Address: ${contractData.parties.entrepreneur.address}

DEVELOPER: ${contractData.parties.developer.name}
Email: ${contractData.parties.developer.email}
Skills: ${contractData.parties.developer.skills.join(", ")}
Address: ${contractData.parties.developer.address}`,
      },
      {
        id: "scope",
        title: "2. Scope of Work & Project Description",
        content: `Project Name: ${contractData.projectDetails.name}

Description: ${contractData.projectDetails.description}

Scope of Work:
${contractData.projectDetails.scope}

Key Milestones:
${contractData.projectDetails.milestones.map((m: any, i: number) => `${i + 1}. ${m.title || m}`).join("\n")}

Timeline: ${contractData.projectDetails.timeline}`,
        isEditable: true,
      },
      {
        id: "equity",
        title: "3. Equity Compensation",
        content: `In consideration for the Developer's contributions, the Entrepreneur agrees to grant equity ownership of ${contractData.projectDetails.equity}.

Equity Details:
- Percentage: ${contractData.projectDetails.equity}
- Vesting Schedule: 25% after 1 year, remaining 75% vested monthly over 3 years
- Cliff Period: 12 months from the effective date
- Acceleration: Full vesting upon company acquisition or IPO

The equity shall be formalized through proper legal documentation upon successful completion of agreed milestones.`,
        isEditable: true,
      },
      {
        id: "ip",
        title: "4. Intellectual Property Rights",
        content: contractData.ip_ownership,
      },
      {
        id: "confidentiality",
        title: "5. Confidentiality & Non-Disclosure",
        content: contractData.confidentiality,
      },
      {
        id: "support",
        title: "6. Support & Performance Standards",
        content: contractData.support_terms,
        isEditable: true,
      },
      {
        id: "termination",
        title: "7. Termination Conditions",
        content: contractData.termination_clause,
      },
      {
        id: "dispute",
        title: "8. Dispute Resolution & Governing Law",
        content: `${contractData.dispute_resolution}

Governing Law: ${contractData.governing_law}

Jurisdiction: Courts of Bangalore, Karnataka shall have exclusive jurisdiction for any legal proceedings.`,
      },
      {
        id: "miscellaneous",
        title: "9. Additional Provisions",
        content: contractData.additional_clauses.join("\n\n"),
      },
    ];

    setSections(buildSections());
  }, [contractData]);

  const handleSectionAgreement = (sectionId: string) => {
    setAgreedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const canProceedToSign = () =>
    sections.length > 0 &&
    agreedSections.size === sections.length &&
    finalAgreement;

  const handleRequestChanges = () => {
    console.log("Requesting changes:", requestedChanges);
    alert("Change request sent to entrepreneur for review.");
    setRequestedChanges("");
    setIsEditMode(false);
  };

  const handleSignContract = async () => {
    try {
      // Get logged-in developer ID from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const developerId = userData?.id;
      if (!developerId) {
        alert("You must be logged in as a developer to sign the contract.");
        return;
      }

      const contractId = contractData?.id; // ensure contractData exists
      if (!contractId) {
        alert("Contract data not available.");
        return;
      }

      // Send POST request to backend
      const res = await axiosLocal.post("/developer-sign-contract", {
        contractId,
        developerId,
      });

      if (res.data.success) {
        alert("Contract signed successfully!");
        navigate("/developer-dashboard"); // ✅ use navigate instead of redirect
      } else {
        alert(res.data.message || "Failed to sign contract.");
      }
    } catch (err) {
      console.error("Error signing contract:", err);
      alert("Failed to sign contract. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Error
          </h2>
          <p className="text-gray-600 text-center">{error}</p>
          <Link
            to="/chat-collaboration"
            className="mt-6 block w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-center"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // No contract data
  if (!contractData) {
    return null;
  }

  // Success/Complete state
  if (signatureStep === "complete") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link
                to="/chat-collaboration"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Collaboration</span>
              </Link>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-900 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">
                  Zero Fund
                </span>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              Contract Successfully Signed!
            </h1>
            <h2 className="text-xl text-gray-800 mb-6">{contractData.title}</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Your collaboration agreement has been digitally signed and is now
              legally binding.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3">Next Steps:</h3>
              <ul className="text-left space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Contract copy sent to your email</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Project workspace activated</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>
                    First milestone:{" "}
                    {contractData.projectDetails.milestones[0]?.title || "TBD"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Contract</span>
              </button>
              <Link
                to="/chat-collaboration"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
              >
                Start Collaboration
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/chat-collaboration"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-900 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-900">Zero Fund</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Contract Sections
              </h3>
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentSection === index
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {section.title}
                      </span>
                      {agreedSections.has(section.id) && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(agreedSections.size / sections.length) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {agreedSections.size} of {sections.length} sections reviewed
                </p>

                {canProceedToSign() && (
                  <button
                    onClick={() => setSignatureStep("confirm")}
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Proceed to Sign
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {signatureStep === "review" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Collaboration Agreement
                      </h1>
                      <p className="text-gray-600">{contractData.title}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span>
                          Created:{" "}
                          {new Date(
                            contractData.createdDate,
                          ).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Shield className="w-4 h-4" />
                          <span>Legally Binding</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {sections[currentSection]?.title}
                      </h2>
                      {sections[currentSection]?.isEditable && (
                        <button
                          onClick={() => setIsEditMode(!isEditMode)}
                          className="flex items-center space-x-1 px-3 py-1 text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Request Changes</span>
                        </button>
                      )}
                    </div>

                    <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {sections[currentSection]?.content}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 mb-6">
                    <input
                      type="checkbox"
                      id={`agree-${sections[currentSection]?.id}`}
                      checked={agreedSections.has(sections[currentSection]?.id)}
                      onChange={() =>
                        handleSectionAgreement(sections[currentSection]?.id)
                      }
                      className="w-5 h-5 text-blue-500 mt-0.5"
                    />
                    <label
                      htmlFor={`agree-${sections[currentSection]?.id}`}
                      className="text-sm text-gray-700"
                    >
                      I have read and agree to the terms outlined in this
                      section.
                    </label>
                  </div>

                  {isEditMode && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-orange-800 mb-2">
                        Request Changes
                      </h4>
                      <textarea
                        value={requestedChanges}
                        onChange={(e) => setRequestedChanges(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg resize-none"
                        placeholder="Describe the changes you'd like..."
                      />
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={handleRequestChanges}
                          disabled={!requestedChanges.trim()}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300"
                        >
                          Send Request
                        </button>
                        <button
                          onClick={() => setIsEditMode(false)}
                          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(currentSection - 1)}
                      disabled={currentSection === 0}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      disabled={currentSection === sections.length - 1}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {currentSection === sections.length - 1 &&
                  agreedSections.size === sections.length && (
                    <div className="border-t p-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="final-agreement"
                            checked={finalAgreement}
                            onChange={(e) =>
                              setFinalAgreement(e.target.checked)
                            }
                            className="w-5 h-5 text-green-600 mt-0.5"
                          />
                          <label
                            htmlFor="final-agreement"
                            className="text-sm text-green-800"
                          >
                            <strong>Final Agreement:</strong> I have reviewed
                            all sections and agree to all terms.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            )}

            {signatureStep === "confirm" && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Ready to Sign
                  </h2>
                  <p className="text-gray-600">
                    Review final details before signing
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Project:</span>
                        <span>{contractData.projectDetails.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Equity:</span>
                        <span className="font-semibold text-blue-500">
                          {contractData.projectDetails.equity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Timeline:</span>
                        <span>{contractData.projectDetails.timeline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Legal Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Governed by:</span>
                        <span>{contractData.governing_law}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Jurisdiction:</span>
                        <span>Bangalore, Karnataka</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Effective:</span>
                        <span>Upon execution</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Important Notice</p>
                      <p>
                        By signing, you enter into a legally binding agreement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setSignatureStep("review")}
                    className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                  >
                    Review Again
                  </button>
                  <button
                    onClick={() => setSignatureStep("sign")}
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold flex items-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Sign Contract</span>
                  </button>
                </div>
              </div>
            )}

            {signatureStep === "sign" && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Digital Signature
                </h2>
                <p className="text-gray-600 mb-8">
                  Click below to apply your signature
                </p>

                <div className="border-2 border-dashed rounded-lg p-8 mb-6">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    <strong>{contractData.parties.developer.name}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={handleSignContract}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
                >
                  Apply Digital Signature
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  By clicking above, you confirm your digital signature.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
