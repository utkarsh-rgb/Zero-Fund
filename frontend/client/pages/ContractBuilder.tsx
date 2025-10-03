import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ContractPDF from "./ContractPDF";
import axiosLocal from "../api/axiosLocal";

import {
  ArrowLeft,
  Lightbulb,
  FileText,
  Edit,
  Eye,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  Shield,
  Scale,
  Clock,
  Save,
} from "lucide-react";

interface Milestone {
  id: number;
  title: string;
  description: string;
  duration: string;
  created_at: string;
  deliverables: string[];
}

interface ContractData {
  developer_id : number,
  entrepreneurName: string;
  entrepreneurEmail: string;
  entrepreneurCompany: string | null;
  developerName: string;
  developerEmail: string;
  projectTitle: string;
  projectDescription: string;
  scope: string;
  timeline: string;
  milestones: Milestone[];
  equityPercentage: string;
  ipOwnership: string;
  confidentiality: string;
  terminationClause: string;
  disputeResolution: string;
  governingLaw: string;
  additionalClauses: string[];
  revisions: string;
  supportTerms: string;
}

const GOVERNING_LAW_OPTIONS = [
  "The laws of India",
  "The laws of the United States of America",
  "The laws of the United Kingdom",
  "The laws of Singapore",
];


export default function ContractBuilder() {
  const [contractData, setContractData] = useState<ContractData>({
    developer_id: 0,
    entrepreneurName: "",
    entrepreneurEmail: "",
    entrepreneurCompany: null,
    developerName: "",
    developerEmail: "",
    projectTitle: "",
    projectDescription: "",
    scope: "",
    timeline: "",
    milestones: [],
    equityPercentage: "",
    ipOwnership: "",
    confidentiality: "",
    terminationClause: "",
    disputeResolution: "",
    governingLaw: "",
    additionalClauses: [],
    revisions: "",
    supportTerms: "",
  });

  const [activeSection, setActiveSection] = useState("parties");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposalId");

  useEffect(() => {
    if (!proposalId) {
      console.error("❌ Proposal ID is missing");
      return;
    }

    const fetchContractData = async () => {
      try {
        const response = await axiosLocal.get(
          `/contract-builder?proposalId=${proposalId}`,
        );
        console.log(response.data);
        if (response.data.success) {
          setContractData(response.data.data);
        } else {
          console.error("Failed to fetch contract data");
        }
      } catch (err) {
        console.error("❌ Error fetching contract data:", err);
      }
    };

    fetchContractData();
  }, [proposalId]);

  if (!contractData) return <div>Loading contract...</div>;

  const handleInputChange = (
    field: keyof ContractData,
    value: string | Milestone[],
  ) => {
    setContractData((prev) => ({ ...prev, [field]: value }));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now(),
      title: "",
      description: "",
      duration: "",
      created_at: new Date().toISOString(),
      deliverables: [""],
    };
    setContractData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
    }));
  };

  const updateMilestone = (
    id: string,
    field: keyof Milestone,
    value: string | string[],
  ) => {
    setContractData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id.toString() === id ? { ...m, [field]: value } : m,
      ),
    }));
  };

  const removeMilestone = (id: string) => {
    setContractData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id.toString() !== id),
    }));
  };

  const addDeliverable = (milestoneId: string) => {
    setContractData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id.toString() === milestoneId
          ? { ...m, deliverables: [...m.deliverables, ""] }
          : m,
      ),
    }));
  };

  const updateDeliverable = (
    milestoneId: string,
    index: number,
    value: string,
  ) => {
    setContractData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id.toString() === milestoneId
          ? {
              ...m,
              deliverables: m.deliverables.map((d, i) =>
                i === index ? value : d,
              ),
            }
          : m,
      ),
    }));
  };

  const removeDeliverable = (milestoneId: string, index: number) => {
    setContractData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id.toString() === milestoneId
          ? {
              ...m,
              deliverables: m.deliverables.filter((_, i) => i !== index),
            }
          : m,
      ),
    }));
  };

  const addAdditionalClause = () => {
    setContractData((prev) => ({
      ...prev,
      additionalClauses: [...prev.additionalClauses, ""],
    }));
  };

  const updateAdditionalClause = (index: number, value: string) => {
    setContractData((prev) => ({
      ...prev,
      additionalClauses: prev.additionalClauses.map((clause, i) =>
        i === index ? value : clause,
      ),
    }));
  };

  const removeAdditionalClause = (index: number) => {
    setContractData((prev) => ({
      ...prev,
      additionalClauses: prev.additionalClauses.filter((_, i) => i !== index),
    }));
  };
  const handleSaveContract = async () => {
    if (!proposalId) {
      console.error("❌ Proposal ID is missing");
      return;
    }

    setIsSaving(true);

    try {
      // Prepare payload including proposalId
      const userData = JSON.parse(localStorage.getItem("userData"));
      const entrepreneur_id = userData?.id;
      const payload = {
        ...contractData,
        proposalId: Number(proposalId),
        entrepreneur_id
      };

      console.log("Saving contract draft data:", payload);

      const response = await axiosLocal.post(
        "/contract-draft-save",
        payload,
      );

      if (response.data.success) {
        console.log("Draft saved successfully:", response.data);
        // Optional: show a success modal or toast
        alert("Draft saved");
      } else {
        console.error("Failed to save draft:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

const handleSignAndSend = async () => {
  setIsSaving(true);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const entrepreneur_id = userData?.id; // entrepreneur creating the contract

  try {
    if (!proposalId) {
      console.error("❌ Proposal ID is missing");
      setIsSaving(false);
      return;
    }

    // // Ensure you have developer_id in contractData
    // const { developer_id } = contractData;
    // if (!developer_id) {
    //   console.error("❌ Developer ID is missing in contract data");
    //   setIsSaving(false);
    //   return;
    // }

    // Prepare payload including proposalId, entrepreneur_id, developer_id
    const payload = {
      ...contractData,
      proposalId: Number(proposalId),
      entrepreneur_id: Number(entrepreneur_id),
      // developer_id: Number(developer_id),
    };

    console.log("Sending Contract Data:", payload);

    const response = await axiosLocal.post(
      "/contracts-details",
      payload
    );

    if (response.data.success) {
      console.log("Contract saved successfully:", response.data);
      localStorage.removeItem("pendingContract");
      setShowSuccessModal(true);
    } else {
      console.error("Failed to save contract:", response.data.message);
    }
  } catch (error) {
    console.error("Error sending contract data:", error);
  } finally {
    setIsSaving(false);
  }
};


  const sections = [
    { id: "parties", label: "Parties", icon: Users },
    { id: "project", label: "Project Details", icon: FileText },
    { id: "equity", label: "Equity & Payment", icon: DollarSign },
    { id: "legal", label: "Legal Terms", icon: Scale },
    { id: "additional", label: "Additional Terms", icon: Plus },
  ];

  

  if (isPreviewMode) {
    return (
      <div id="contract-preview" className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Back to Editor</span>
              </button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Contract Preview</span>
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-navy">Zero Fund</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Contract Preview */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-navy mb-2">
                Collaboration Agreement
              </h1>
              <p className="text-gray-600">{contractData.projectTitle}</p>
            </div>

            <div
              id="pdf-part"
              className="prose prose-gray max-w-none space-y-6"
            >
              <h1 className="text-3xl font-bold text-navy mb-2">
                Collaboration Agreement
              </h1>
              <section>
                <h2 className="text-xl font-bold text-navy border-b border-gray-200 pb-2">
                  1. Parties to the Agreement
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold">Entrepreneur:</h3>
                    <p>{contractData.entrepreneurName || ""}</p>
                    <p>{contractData.entrepreneurEmail}</p>
                    <p>{contractData.entrepreneurCompany}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Developer:</h3>
                    <p>{contractData.developerName}</p>
                    <p>{contractData.developerEmail}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy border-b border-gray-200 pb-2">
                  2. Project Description & Scope
                </h2>
                <p>
                  <strong>Project:</strong> {contractData.projectTitle}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {contractData.projectDescription}
                </p>
                <p>
                  <strong>Scope of Work:</strong> {contractData.scope}
                </p>
                <p>
                  <strong>Timeline:</strong> {contractData.timeline}
                </p>

                <h3 className="font-semibold mt-4">Milestones:</h3>
                <div className="space-y-3">
                  {contractData.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="border-l-4 border-skyblue pl-4"
                    >
                      <h4 className="font-semibold">
                        {index + 1}. {milestone.title}
                      </h4>
                      <p className="text-gray-600">{milestone.description}</p>
                      <p className="text-sm text-gray-500">
                        Duration: {milestone.duration}
                      </p>
                      <ul className="list-disc list-inside text-sm">
                        {milestone.deliverables
                          .filter((d) => d.trim())
                          .map((deliverable, idx) => (
                            <li key={idx}>{deliverable}</li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy border-b border-gray-200 pb-2">
                  3. Equity Compensation
                </h2>
                <p>
                  <strong>Equity Percentage:</strong>{" "}
                  {contractData.equityPercentage}%
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-navy border-b border-gray-200 pb-2">
                  4. Legal Terms
                </h2>
                <p>
                  <strong>Intellectual Property:</strong>{" "}
                  {contractData.ipOwnership}
                </p>
                <p>
                  <strong>Confidentiality Period:</strong>{" "}
                  {contractData.confidentiality}
                </p>
                <p>
                  <strong>Termination Notice:</strong>{" "}
                  {contractData.terminationClause}
                </p>
                <p>
                  <strong>Dispute Resolution:</strong>{" "}
                  {contractData.disputeResolution}
                </p>
                <p>
                  <strong>Governing Law:</strong> {contractData.governingLaw}
                </p>
              </section>

              {contractData.additionalClauses.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-navy border-b border-gray-200 pb-2">
                    5. Additional Terms
                  </h2>
                  <ul className="list-disc list-inside space-y-1">
                    {contractData.additionalClauses
                      .filter((c) => c.trim())
                      .map((clause, index) => (
                        <li key={index}>{clause}</li>
                      ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
              <div className="flex space-x-3">
                <PDFDownloadLink
                  document={<ContractPDF contractData={contractData} />}
                  fileName="contract.pdf"
                >
                  {({ loading }) => (
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      <span>
                        {loading ? "Preparing PDF..." : "Export the PDF"}
                      </span>
                    </button>
                  )}
                </PDFDownloadLink>

                <button
                  onClick={handleSignAndSend}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSaving
                      ? "Signing & Sending..."
                      : "Sign & Send to Developer"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/manage-proposals"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Back to Proposals</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveContract}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Draft"}</span>
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">Zero Fund</span>
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-8">
              <h2 className="text-lg font-semibold text-navy mb-4">
                Contract Builder
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-skyblue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsPreviewMode(true)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview Contract</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy mb-2">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h1>
                <p className="text-gray-600">
                  Configure the contract terms for your collaboration
                </p>
              </div>

              {/* Parties Section */}
              {activeSection === "parties" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Entrepreneur Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={contractData.entrepreneurName || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "entrepreneurName",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={contractData.entrepreneurEmail || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "entrepreneurEmail",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={contractData.entrepreneurCompany || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "entrepreneurCompany",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Developer Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={contractData.developerName || ""}
                            onChange={(e) =>
                              handleInputChange("developerName", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={contractData.developerEmail || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "developerEmail",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          />
                        </div>
                        <div className="bg-skyblue/10 border border-skyblue/20 rounded-lg p-4">
                          <p className="text-sm text-skyblue">
                            <Shield className="w-4 h-4 inline mr-1" />
                            Developer details will be auto-filled from their
                            profile
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Details Section */}
              {activeSection === "project" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={contractData.projectTitle || ""}
                      onChange={(e) =>
                        handleInputChange("projectTitle", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Description
                    </label>
                    <textarea
                      value={contractData.projectDescription || ""}
                      onChange={(e) =>
                        handleInputChange("projectDescription", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scope of Work
                      </label>
                      <textarea
                        value={contractData.scope || ""}
                        onChange={(e) =>
                          handleInputChange("scope", e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline
                      </label>
                      <input
                        type="text"
                        value={contractData.timeline || ""}
                        onChange={(e) =>
                          handleInputChange("timeline", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        placeholder="e.g., 6 months from contract execution"
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Project Milestones
                      </label>
                      <button
                        onClick={addMilestone}
                        className="flex items-center space-x-2 px-3 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Milestone</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {contractData.milestones.map((milestone, index) => (
                        <div
                          key={milestone.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-800">
                              Milestone {index + 1}
                            </h4>
                            {contractData.milestones.length > 1 && (
                              <button
                                onClick={() =>
                                  removeMilestone(milestone.id.toString())
                                }
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={milestone.title || ""}
                                onChange={(e) =>
                                  updateMilestone(
                                    milestone.id.toString(),
                                    "title",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={milestone.duration || ""}
                                onChange={(e) =>
                                  updateMilestone(
                                    milestone.id.toString(),
                                    "duration",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                                placeholder="e.g., 3 weeks"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              value={milestone.description}
                              onChange={(e) =>
                                updateMilestone(
                                  milestone.id.toString(),
                                  "description",
                                  e.target.value,
                                )
                              }
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-sm font-medium text-gray-700">
                                Deliverables
                              </label>
                              <button
                                onClick={() =>
                                  addDeliverable(milestone.id.toString())
                                }
                                className="text-skyblue hover:text-navy transition-colors text-sm"
                              >
                                Add Item
                              </button>
                            </div>
                            <div className="space-y-2">
                              {milestone.deliverables.map(
                                (deliverable, deliverableIndex) => (
                                  <div
                                    key={deliverableIndex}
                                    className="flex space-x-2"
                                  >
                                    <input
                                      type="text"
                                      value={deliverable}
                                      onChange={(e) =>
                                        updateDeliverable(
                                          milestone.id.toString(),
                                          deliverableIndex,
                                          e.target.value,
                                        )
                                      }
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                                      placeholder="Deliverable item"
                                    />
                                    {milestone.deliverables.length > 1 && (
                                      <button
                                        onClick={() =>
                                          removeDeliverable(
                                            milestone.id.toString(),
                                            deliverableIndex,
                                          )
                                        }
                                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Equity & Payment Section */}
              {activeSection === "equity" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Equity Percentage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={contractData.equityPercentage}
                          onChange={(e) =>
                            handleInputChange(
                              "equityPercentage",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          %
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revisions Included
                      </label>
                      <input
                        type="text"
                        value={contractData.revisions}
                        onChange={(e) =>
                          handleInputChange("revisions", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        placeholder="e.g., 2 rounds of revisions"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Terms
                    </label>
                    <input
                      type="text"
                      value={contractData.supportTerms}
                      onChange={(e) =>
                        handleInputChange("supportTerms", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                      placeholder="e.g., 30 days post-delivery support"
                    />
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-orange-800">
                        <p className="font-semibold mb-1">Important Note</p>
                        <p>
                          Equity terms should be carefully considered and may
                          require legal review. Consider consulting with a legal
                          professional before finalizing the agreement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Terms Section */}
              {activeSection === "legal" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intellectual Property Ownership
                    </label>
                    <select
                      value={contractData.ipOwnership}
                      onChange={(e) =>
                        handleInputChange("ipOwnership", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    >
                      <option value="100% owned by Entrepreneur">
                        100% owned by Entrepreneur
                      </option>
                      <option value="Shared ownership">Shared ownership</option>
                      <option value="Developer retains rights to general methods">
                        Developer retains rights to general methods
                      </option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confidentiality Period
                      </label>
                      <input
                        type="text"
                        value={contractData.confidentiality}
                        onChange={(e) =>
                          handleInputChange("confidentiality", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Termination Notice
                      </label>
                      <input
                        type="text"
                        value={contractData.terminationClause}
                        onChange={(e) =>
                          handleInputChange("terminationClause", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        placeholder="e.g., 30 days written notice"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Governing Law
                    </label>
                    <select
                      value={contractData.governingLaw}
                      onChange={(e) =>
                        handleInputChange("governingLaw", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    >
                      {GOVERNING_LAW_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dispute Resolution
                    </label>
                    <textarea
                      value={contractData.disputeResolution}
                      onChange={(e) =>
                        handleInputChange("disputeResolution", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                      placeholder="e.g., Binding arbitration in Bangalore, Karnataka, India"
                    />
                  </div>
                </div>
              )}

              {/* Additional Terms Section */}
              {activeSection === "additional" && (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Additional Clauses
                      </label>
                      <button
                        onClick={addAdditionalClause}
                        className="flex items-center space-x-2 px-3 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Clause</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {contractData.additionalClauses.map((clause, index) => (
                        <div key={index} className="flex space-x-3">
                          <textarea
                            value={clause}
                            onChange={(e) =>
                              updateAdditionalClause(index, e.target.value)
                            }
                            rows={2}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                            placeholder="Enter additional contract clause..."
                          />
                          <button
                            onClick={() => removeAdditionalClause(index)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}

                      {contractData.additionalClauses.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No additional clauses added yet.</p>
                          <p className="text-sm">
                            Click "Add Clause" to include custom terms.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-skyblue/10 border border-skyblue/20 rounded-lg p-4">
                    <h4 className="font-semibold text-navy mb-2">
                      Common Additional Clauses
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • Non-compete restrictions during project duration
                      </li>
                      <li>• Communication and reporting requirements</li>
                      <li>• Performance milestones and quality standards</li>
                      <li>• Data security and backup requirements</li>
                      <li>• Third-party integrations and licensing</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveContract}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsPreviewMode(true)}
                    className="flex items-center space-x-2 px-6 py-3 border border-skyblue text-skyblue rounded-lg hover:bg-skyblue/10 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={handleSignAndSend}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    <span>
                      {isSaving
                        ? "Signing & Sending..."
                        : "Sign & Send to Developer"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">
              Contract Signed & Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully signed the contract and it has been sent to{" "}
              {contractData.developerName} ({contractData.developerEmail}) for
              their review and signature. They will be notified via email.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
              <Link
                to="/entrepreneur-dashboard"
                className="flex-1 px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
