import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Code,
  Calendar,
  Users,
  Star,
  Shield,
  Download,
  Eye,
  EyeOff,
  Bookmark,
  Send,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";

interface IdeaDetails {
  id: string;
  title: string;
  stage: "Idea" | "MVP" | "Beta";
  founderName: string;
  founderAvatar: string;
  founderBio: string;
  founderLinkedIn: string;
  skills: string[];
  equityRange: string;
  fullDescription: string;
  objectives: string[];
  required_skills: string[];
  attachments: { name: string; type: string; size: string }[];
  nda_accepted: 0 | 1;
  isNDA: boolean; 
  visibility: "Public" | "Invite Only" | "NDA Required";
  createdAt: string;
  timeline: string;
  isBookmarked: boolean;
  hasAcceptedNDA: boolean;}

export default function IdeaDetails() {
  const { id } = useParams();
  const [idea, setIdea] = useState<IdeaDetails | null>(null);
  const [hasAcceptedNDA, setHasAcceptedNDA] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [checkboxChecked, setCheckboxChecked] = useState(false);

  useEffect(() => {
    async function fetchIdea() {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/ideas/${id}`);
        const fetchedIdea = response.data.idea;
       console.log("Skills from backend:", response.data.idea.required_skills); 
        setIdea(fetchedIdea);
        setHasAcceptedNDA(fetchedIdea.hasAcceptedNDA);
        setIsBookmarked(fetchedIdea.isBookmarked);
      } catch (err) {
        setError("Failed to fetch idea details");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchIdea();
    }
  }, [id]);

 const handleAcceptNDA = async () => {
  try {
    await axios.put(`http://localhost:5000/ideas/${idea.id}/sign-nda`);
    setHasAcceptedNDA(true);
    setShowNDAModal(false);

    // Refetch idea details to get full data after NDA accepted
    const response = await axios.get(`http://localhost:5000/ideas/${idea.id}`);
    setIdea(response.data.idea);
  } catch (error) {
    console.error("Failed to accept NDA:", error);
    // Optionally show error UI here
  }
};

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Optionally update bookmark status on backend
  };

  const StageBadge = ({ stage }: { stage: "Idea" | "MVP" | "Beta" }) => {
    const colors = {
      Idea: "bg-purple-100 text-purple-800",
      MVP: "bg-blue-100 text-blue-800",
      Beta: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${colors[stage]}`}
      >
        {stage}
      </span>
    );
  };
if (!idea) return <div>Loading...</div>;

if (!hasAcceptedNDA && idea.nda_accepted === 0) {
  return (
   <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link
                to="/developer-dashboard"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Back to Dashboard</span>
              </Link>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">
                  Skill Invest
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* NDA Gate */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-orange-600" />
            </div>

            <h1 className="text-3xl font-bold text-navy mb-4">NDA Required</h1>
            <h2 className="text-xl text-gray-800 mb-6">{idea.title}</h2>

            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              This startup idea contains confidential information that requires
              a Non-Disclosure Agreement (NDA) before you can view the full
              details. By accepting the NDA, you agree to keep all information
              confidential.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">
                What you can see now:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Project title and founder name</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Required skills and equity range</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Project stage and timeline</span>
                </li>
              </ul>

              <h3 className="font-semibold text-gray-800 mb-3 mt-6">
                After accepting NDA:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-skyblue" />
                  <span>Full project description and objectives</span>
                </li>
                <li className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-skyblue" />
                  <span>Technical requirements and architecture</span>
                </li>
                <li className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-skyblue" />
                  <span>Business documents and mockups</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                to="/developer-dashboard"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </Link>
              <button
                onClick={() => setShowNDAModal(true)}
                className="px-8 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors font-semibold"
              >
                Accept NDA & View Details
              </button>
            </div>
          </div>
        </div>

        {/* NDA Modal */}
        {showNDAModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-navy mb-6">
                Non-Disclosure Agreement
              </h2>

              <div className="prose prose-sm text-gray-600 mb-6">
                <p>
                  By accepting this NDA, you agree to maintain confidentiality
                  of all information shared about "{idea.title}" including but
                  not limited to:
                </p>
                <ul>
                  <li>Business plans and strategies</li>
                  <li>Technical specifications and architecture</li>
                  <li>Market research and financial projections</li>
                  <li>Any proprietary information or trade secrets</li>
                </ul>
                <p>
                  This agreement remains in effect for 2 years from the date of
                  acceptance. Violation of this agreement may result in legal
                  action.
                </p>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={e => setCheckboxChecked(e.target.checked)}
                  id="nda"
                  className="w-4 h-4 text-skyblue"
                />
                <label htmlFor="nda-accept" className="text-sm text-gray-700">
                  I have read and agree to the terms of this Non-Disclosure
                  Agreement
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowNDAModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                disabled={!checkboxChecked}
                  onClick={handleAcceptNDA}
                  className="flex-1 px-4 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors font-semibold"
                >
                  Accept NDA
                </button>
              </div>
            </div>
          </div>
        )}
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
              to="/developer-dashboard"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Back to Dashboard</span>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-navy mb-2">
                    {idea.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <StageBadge stage={idea.stage} />
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">
                      Posted {idea.createdAt}
                    </span>
                    {idea.isNDA && (
                      <>
                        <span className="text-gray-500">•</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          ✓ NDA Accepted
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBookmark}
                    className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                  >
                    <Bookmark
                      className={`w-6 h-6 ${
                        isBookmarked ? "fill-current text-skyblue" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {idea.fullDescription}
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-bold text-navy mb-6">
                Project Objectives
              </h2>
              <ul className="space-y-3">
               {idea.objectives?.map((objective, index) => (
  <li key={index} className="flex items-start space-x-3">
    <div className="w-6 h-6 bg-skyblue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-xs font-semibold text-skyblue">
        {index + 1}
      </span>
    </div>
    <span className="text-gray-700">{objective}</span>
  </li>
))}

              </ul>
            </div>

            {/* Tech Stack */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-bold text-navy mb-6">
                Required Tech Stack
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              
{idea.required_skills.map((tech: string) => (
  <div
    key={tech}
    className="px-4 py-3 bg-gray-50 rounded-lg text-center font-medium text-gray-700 shadow-sm"
  >
    {tech}
  </div>
))}



              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-bold text-navy mb-6">
                Project Documents
              </h2>
              <div className="space-y-3">
                {idea.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-skyblue/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-skyblue" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {attachment.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {attachment.type} • {attachment.size}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-skyblue transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Founder Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-navy mb-4">
                About the Founder
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                  {idea.founderAvatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {idea.founderName}
                  </p>
                  <a
                    href={idea.founderLinkedIn}
                    className="text-sm text-skyblue hover:text-navy transition-colors flex items-center space-x-1"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {idea.founderBio}
              </p>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-navy mb-4">
                Project Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Equity Range</p>
                  <p className="font-semibold text-skyblue text-lg">
                    {idea.equityRange}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Timeline</p>
                  <p className="font-semibold text-gray-800">{idea.timeline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
  {idea.skills?.map(skill => (
    <span key={skill} className="px-2 py-1 bg-skyblue/10 text-skyblue text-xs rounded-full">
      {skill}
    </span>
  ))}
</div>

                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-3">
                <Link
                  to="/proposal-submit"
                  className="w-full bg-skyblue text-white py-3 rounded-lg font-semibold hover:bg-navy transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Proposal</span>
                </Link>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Founder</span>
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-skyblue/5 border border-skyblue/20 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-navy mb-3">
                Protected by Zero Fund
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 text-skyblue" />
                  <span>Verified founder profile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-3 h-3 text-skyblue" />
                  <span>Auto-generated legal contracts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 text-skyblue" />
                  <span>Equity tracking & protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
