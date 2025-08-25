import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Download,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  Scale,
  Eye,
  Edit,
  Send,
  Clock,
} from "lucide-react";

interface ContractSection {
  id: string;
  title: string;
  content: string;
  isEditable?: boolean;
  status?: "pending" | "approved" | "needs_review";
}

const CONTRACT_DATA = {
  id: "contract_001",
  title: "AI-Powered Education Platform - Developer Collaboration Agreement",
  status: "ready_to_sign" as "draft" | "ready_to_sign" | "signed" | "executed",
  createdDate: "2024-01-16",
  parties: {
    entrepreneur: {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      company: "EduTech Innovations Pvt Ltd",
      address: "Bangalore, Karnataka, India",
    },
    developer: {
      name: "John Developer",
      email: "john.developer@example.com",
      skills: ["Frontend Development", "Backend Development", "AI/ML"],
      address: "Mumbai, Maharashtra, India",
    },
  },
  projectDetails: {
    name: "AI-Powered Education Platform",
    description:
      "Development of a comprehensive AI-driven educational platform for personalized learning",
    scope:
      "Full-stack development including frontend, backend, and AI integration",
    timeline: "6 months from contract execution",
    equity: "12%",
    milestones: [
      "User Authentication System - 2 weeks",
      "Dashboard Interface - 3 weeks",
      "AI Integration Setup - 4 weeks",
    ],
  },
};

const CONTRACT_SECTIONS: ContractSection[] = [
  {
    id: "parties",
    title: "1. Parties to the Agreement",
    content: `This Collaboration Agreement ("Agreement") is entered into between:

ENTREPRENEUR: ${CONTRACT_DATA.parties.entrepreneur.name}
Email: ${CONTRACT_DATA.parties.entrepreneur.email}
Company: ${CONTRACT_DATA.parties.entrepreneur.company}
Address: ${CONTRACT_DATA.parties.entrepreneur.address}

DEVELOPER: ${CONTRACT_DATA.parties.developer.name}
Email: ${CONTRACT_DATA.parties.developer.email}
Skills: ${CONTRACT_DATA.parties.developer.skills.join(", ")}
Address: ${CONTRACT_DATA.parties.developer.address}`,
  },
  {
    id: "scope",
    title: "2. Scope of Work & Project Description",
    content: `Project Name: ${CONTRACT_DATA.projectDetails.name}

Description: ${CONTRACT_DATA.projectDetails.description}

Developer's Scope of Work:
${CONTRACT_DATA.projectDetails.scope}

Key Milestones:
${CONTRACT_DATA.projectDetails.milestones.map((m, i) => `${i + 1}. ${m}`).join("\n")}

Timeline: ${CONTRACT_DATA.projectDetails.timeline}`,
    isEditable: true,
  },
  {
    id: "equity",
    title: "3. Equity Compensation",
    content: `In consideration for the Developer's contributions to the Project, the Entrepreneur agrees to grant the Developer equity ownership equivalent to ${CONTRACT_DATA.projectDetails.equity} of the total shares in the company.

Equity Details:
- Percentage: ${CONTRACT_DATA.projectDetails.equity}
- Vesting Schedule: 25% after 1 year, remaining 75% vested monthly over 3 years
- Cliff Period: 12 months from the effective date
- Acceleration: Full vesting upon company acquisition or IPO

The equity shall be formalized through proper legal documentation upon successful completion of agreed milestones.`,
    isEditable: true,
  },
  {
    id: "ip",
    title: "4. Intellectual Property Rights",
    content: `All intellectual property, including but not limited to:
- Source code, algorithms, and technical documentation
- User interface designs and user experience flows
- Database schemas and system architecture
- Any innovations, improvements, or derivative works

Shall be owned exclusively by the Entrepreneur and/or the Company. The Developer hereby assigns all rights, title, and interest in any work product created under this Agreement to the Entrepreneur.

The Developer retains rights to:
- General skills, knowledge, and experience gained
- Open-source libraries and frameworks used (subject to their respective licenses)
- Personal portfolio showcasing (with prior written consent)`,
  },
  {
    id: "confidentiality",
    title: "5. Confidentiality & Non-Disclosure",
    content: `The Developer acknowledges that they will have access to confidential and proprietary information including:
- Business plans, strategies, and financial information
- Technical specifications and trade secrets
- Customer data and market research
- Any information marked as confidential

The Developer agrees to:
- Maintain strict confidentiality of all proprietary information
- Not disclose any confidential information to third parties
- Use confidential information solely for the purposes of this Agreement
- Return or destroy all confidential materials upon termination

This confidentiality obligation shall survive termination of this Agreement for a period of 5 years.`,
  },
  {
    id: "performance",
    title: "6. Performance Standards & Deliverables",
    content: `The Developer agrees to:
- Deliver work that meets industry-standard quality and best practices
- Provide regular progress updates and milestone reports
- Be available for reasonable consultation and meetings
- Deliver work according to agreed timelines and specifications

Quality Standards:
- Code must be well-documented and follow agreed coding standards
- All deliverables must be tested and functional
- Work must be compatible with specified technical requirements
- Must pass all agreed acceptance criteria

The Entrepreneur reserves the right to review and request reasonable modifications to ensure deliverables meet project requirements.`,
    isEditable: true,
  },
  {
    id: "termination",
    title: "7. Termination Conditions",
    content: `This Agreement may be terminated:

By Mutual Consent: Both parties may agree to terminate at any time.

For Cause: Either party may terminate immediately upon:
- Material breach of this Agreement that remains uncured for 30 days after written notice
- Failure to deliver agreed milestones after 60 days past due date
- Violation of confidentiality or intellectual property terms

By Entrepreneur: With 30 days written notice for any reason.

By Developer: With 30 days written notice, provided all current milestone obligations are fulfilled.

Upon termination:
- All work-in-progress must be delivered in current state
- Confidentiality obligations continue
- Equity vesting stops as of termination date (subject to cliff and vesting schedule)
- Final payment/equity allocation based on work completed`,
  },
  {
    id: "dispute",
    title: "8. Dispute Resolution & Governing Law",
    content: `Any disputes arising from this Agreement shall be resolved through:

1. Good Faith Negotiation: Parties will first attempt to resolve disputes through direct negotiation.

2. Mediation: If negotiation fails, disputes will be submitted to binding mediation under the rules of the Indian Arbitration and Conciliation Act, 2015.

3. Arbitration: If mediation fails, disputes will be resolved through binding arbitration in Bangalore, Karnataka, India.

Governing Law: This Agreement shall be governed by the laws of India.

Jurisdiction: Courts of Bangalore, Karnataka shall have exclusive jurisdiction for any legal proceedings.

Legal Costs: The prevailing party shall be entitled to recover reasonable attorney fees and costs.`,
  },
  {
    id: "miscellaneous",
    title: "9. Miscellaneous Provisions",
    content: `Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

Amendments: This Agreement may only be modified in writing, signed by both parties.

Severability: If any provision is deemed invalid or unenforceable, the remainder of the Agreement shall remain in full force.

Assignment: This Agreement may not be assigned without prior written consent of both parties.

Independent Contractor: The Developer is an independent contractor and not an employee of the Entrepreneur.

Force Majeure: Neither party shall be liable for delays or failures due to circumstances beyond their reasonable control.

Notices: All notices must be in writing and delivered to the addresses specified in this Agreement.

Effective Date: This Agreement becomes effective upon execution by both parties.`,
  },
];

export default function ContractReview() {
  const [currentSection, setCurrentSection] = useState(0);
  const [agreedSections, setAgreedSections] = useState<Set<string>>(new Set());
  const [finalAgreement, setFinalAgreement] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [requestedChanges, setRequestedChanges] = useState("");
  const [signatureStep, setSignatureStep] = useState<
    "review" | "confirm" | "sign" | "complete"
  >("review");

  const handleSectionAgreement = (sectionId: string) => {
    const newAgreed = new Set(agreedSections);
    if (agreedSections.has(sectionId)) {
      newAgreed.delete(sectionId);
    } else {
      newAgreed.add(sectionId);
    }
    setAgreedSections(newAgreed);
  };

  const canProceedToSign = () => {
    return agreedSections.size === CONTRACT_SECTIONS.length && finalAgreement;
  };

  const handleRequestChanges = () => {
    // TODO: Send change request to backend
    console.log("Requesting changes:", requestedChanges);
    alert("Change request sent to entrepreneur for review.");
    setRequestedChanges("");
  };

  const handleSignContract = () => {
    // TODO: Execute e-signature process
    console.log("Signing contract...");
    setSignatureStep("complete");
  };

  if (signatureStep === "complete") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link
                to="/chat-collaboration"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Back to Collaboration</span>
              </Link>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">
                  Zero Fund
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-navy mb-4">
              Contract Successfully Signed!
            </h1>
            <h2 className="text-xl text-gray-800 mb-6">
              {CONTRACT_DATA.title}
            </h2>

            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your collaboration agreement has been digitally signed and is now
              legally binding. Both parties have been notified and you can begin
              working on the project immediately.
            </p>

            <div className="bg-skyblue/10 border border-skyblue/20 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold text-navy mb-3">Next Steps:</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Contract copy sent to your email</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>
                    Project workspace activated in your collaboration area
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Milestone tracking enabled</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>First milestone: User Authentication System</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Contract</span>
              </button>
              <Link
                to="/chat-collaboration"
                className="px-8 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors font-semibold"
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/chat-collaboration"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Back to Collaboration</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy">Zero Fund</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-navy mb-4">
                Contract Sections
              </h3>

              <div className="space-y-2">
                {CONTRACT_SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentSection === index
                        ? "bg-skyblue text-white"
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

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-skyblue h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(agreedSections.size / CONTRACT_SECTIONS.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {agreedSections.size} of {CONTRACT_SECTIONS.length} sections
                    reviewed
                  </p>
                </div>

                {canProceedToSign() && (
                  <button
                    onClick={() => setSignatureStep("confirm")}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
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
                {/* Contract Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-navy mb-2">
                        Collaboration Agreement
                      </h1>
                      <p className="text-gray-600">{CONTRACT_DATA.title}</p>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span>Created: {CONTRACT_DATA.createdDate}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Shield className="w-4 h-4" />
                          <span>Legally Binding</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-navy">
                        {CONTRACT_SECTIONS[currentSection].title}
                      </h2>
                      {CONTRACT_SECTIONS[currentSection].isEditable && (
                        <button
                          onClick={() => setIsEditMode(!isEditMode)}
                          className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Request Changes</span>
                        </button>
                      )}
                    </div>

                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {CONTRACT_SECTIONS[currentSection].content}
                      </div>
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="flex items-start space-x-3 mb-6">
                    <input
                      type="checkbox"
                      id={`agree-${CONTRACT_SECTIONS[currentSection].id}`}
                      checked={agreedSections.has(
                        CONTRACT_SECTIONS[currentSection].id,
                      )}
                      onChange={() =>
                        handleSectionAgreement(
                          CONTRACT_SECTIONS[currentSection].id,
                        )
                      }
                      className="w-5 h-5 text-skyblue mt-0.5"
                    />
                    <label
                      htmlFor={`agree-${CONTRACT_SECTIONS[currentSection].id}`}
                      className="text-sm text-gray-700"
                    >
                      I have read and agree to the terms outlined in this
                      section. I understand my rights and obligations as
                      specified.
                    </label>
                  </div>

                  {/* Change Request Form */}
                  {isEditMode && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-orange-800 mb-2">
                        Request Changes to This Section
                      </h4>
                      <textarea
                        value={requestedChanges}
                        onChange={(e) => setRequestedChanges(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        placeholder="Describe the changes you'd like to request for this section..."
                      />
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={handleRequestChanges}
                          disabled={!requestedChanges.trim()}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Send Request
                        </button>
                        <button
                          onClick={() => setIsEditMode(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(currentSection - 1)}
                      disabled={currentSection === 0}
                      className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Previous Section
                    </button>

                    <button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      disabled={currentSection === CONTRACT_SECTIONS.length - 1}
                      className="px-4 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Next Section
                    </button>
                  </div>
                </div>

                {/* Final Agreement */}
                {currentSection === CONTRACT_SECTIONS.length - 1 &&
                  agreedSections.size === CONTRACT_SECTIONS.length && (
                    <div className="border-t border-gray-200 p-6">
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
                            <strong>Final Agreement:</strong> I have carefully
                            reviewed all sections of this contract and agree to
                            all terms and conditions. I understand that this
                            agreement will be legally binding upon execution and
                            that I am entering into this collaboration with full
                            knowledge of my rights and responsibilities.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Confirmation Step */}
            {signatureStep === "confirm" && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-skyblue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-skyblue" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy mb-2">
                    Ready to Sign Contract
                  </h2>
                  <p className="text-gray-600">
                    Please review the final details before signing
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Project Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Project:</span>
                        <span>{CONTRACT_DATA.projectDetails.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Equity:</span>
                        <span className="font-semibold text-skyblue">
                          {CONTRACT_DATA.projectDetails.equity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Timeline:</span>
                        <span>{CONTRACT_DATA.projectDetails.timeline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Legal Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Governed by:</span>
                        <span>Laws of India</span>
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
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Important Notice</p>
                      <p>
                        By signing this contract, you are entering into a
                        legally binding agreement. Please ensure you have read
                        and understood all terms. If you have any questions,
                        please consult with a legal professional before
                        proceeding.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setSignatureStep("review")}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Review Again
                  </button>
                  <button
                    onClick={() => setSignatureStep("sign")}
                    className="px-8 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors font-semibold flex items-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Sign Contract</span>
                  </button>
                </div>
              </div>
            )}

            {/* Signature Step */}
            {signatureStep === "sign" && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-navy mb-4">
                  Digital Signature
                </h2>
                <p className="text-gray-600 mb-8">
                  Click below to apply your digital signature and execute the
                  contract
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Signing as:{" "}
                    <strong>{CONTRACT_DATA.parties.developer.name}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={handleSignContract}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                >
                  Apply Digital Signature
                </button>

                <p className="text-xs text-gray-500 mt-4">
                  By clicking above, you confirm your digital signature and
                  agree to be legally bound by this contract.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
