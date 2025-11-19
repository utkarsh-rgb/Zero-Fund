import { useEffect, useState } from "react";
import axiosLocal from "../api/axiosLocal";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  duration: string;
}

interface ProposalForm {
  scope: string;
  milestones: Milestone[];
  timeline: string;
  equityRequested: string;
  additionalNotes: string;
}

interface Idea {
  id: string;
  title: string;
  founderName: string;
  equity_offering: string;
  stage: string;
}
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProposalSubmit() {
  const query = useQuery();
  const ideaId = query.get("id");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ProposalForm>({
    scope: "",
    milestones: [
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        duration: "",
      },
    ],
    timeline: "",
    equityRequested: "",
    additionalNotes: "",
  });
  const [idea, setIdea] = useState<Idea>({
    id: "",
    title: "",
    founderName: "",
    equity_offering: "",
    stage: "",
  });

  useEffect(() => {
    if (ideaId) {
      const fetchIdeaData = async () => {
        try {
          const response = await axiosLocal.get(
            `/proposal/${ideaId}`,
          );
          const data = response.data;

          setIdea({
            id: data.id,
            title: data.title,
            founderName: data.founderName, // or data.entrepreneur_name depending on backend
            equity_offering: data.equity_offering, // map appropriately
            stage: data.stage,
          });

          // Do NOT set formData here; user fills it manually
        } catch (error) {
          console.error("Error fetching idea data:", error);
        }
      };

      fetchIdeaData();
    }
  }, [ideaId]);
  const handleInputChange = (
    field: keyof ProposalForm,
    value: string | Milestone[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: "",
      description: "",
      duration: "",
    };
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
    }));
  };

  const removeMilestone = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const updateMilestone = (
    id: string,
    field: keyof Milestone,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const developerData = JSON.parse(
        localStorage.getItem("userData") || "{}",
      );

      await axiosLocal.post("/submit-proposal", {
        ideaId: idea.id,
        developerId: developerData.id, // send developer id
        ...formData,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const isFormValid = () => {
    return (
      formData.scope.trim() &&
      formData.timeline.trim() &&
      formData.equityRequested.trim() &&
      formData.milestones.every(
        (m) => m.title.trim() && m.description.trim() && m.duration.trim(),
      )
    );
  };

  if (isSubmitted) {
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

        {/* Success Message */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-navy mb-4">
              Proposal Submitted Successfully!
            </h1>
            <h2 className="text-xl text-gray-800 mb-6">{idea.title}</h2>

            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your proposal has been sent to {idea.founderName}. You'll receive
              a notification when they respond. You can track the status in your
              dashboard.
            </p>

            <div className="bg-skyblue/10 border border-skyblue/20 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="font-semibold text-navy mb-3">
                What happens next?
              </h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-skyblue rounded-full"></div>
                  <span>
                    The founder will review your proposal (typically 2-5 days)
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-skyblue rounded-full"></div>
                  <span>
                    If interested, they'll initiate a chat to discuss details
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-skyblue rounded-full"></div>
                  <span>
                    Upon agreement, a legal contract will be auto-generated
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                to="/developer-dashboard?tab=proposals"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                View My Proposals
              </Link>
              <Link
                to="/developer-dashboard"
                className="px-8 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors font-semibold"
              >
                Back to Dashboard
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
            <Link to="/idea-details" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Back to Idea Details</span>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Submit Proposal</h1>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {idea.title}
                </h2>
                <p className="text-gray-600">by {idea.founderName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Equity</p>
                <p className="text-lg font-semibold text-skyblue">
                  {idea.equity_offering}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Scope of Contribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-navy mb-4">
              Scope of Contribution
            </h3>
            <p className="text-gray-600 mb-4">
              Describe what you'll contribute to this project. Be specific about
              your role and responsibilities.
            </p>
            <textarea
              value={formData.scope}
              onChange={(e) => handleInputChange("scope", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
              placeholder="Example: I will develop the complete frontend application using React and Next.js, including user authentication, dashboard interfaces, and integration with the AI backend APIs. I'll also handle responsive design and ensure cross-browser compatibility..."
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                Be detailed about your technical contributions
              </span>
              <span className="text-sm text-gray-400">
                {formData.scope.length}/2000
              </span>
            </div>
          </div>

          {/* Milestones & Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-navy">
                Milestones & Timeline
              </h3>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center space-x-2 px-3 py-2 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Milestone</span>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Break down your work into clear milestones with estimated
              timeframes.
            </p>

            <div className="space-y-6">
              {formData.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">
                      Milestone {index + 1}
                    </h4>
                    {formData.milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(milestone.id)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) =>
                          updateMilestone(milestone.id, "title", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        placeholder="e.g., Complete user authentication system"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={milestone.duration}
                        onChange={(e) =>
                          updateMilestone(
                            milestone.id,
                            "duration",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                        placeholder="e.g., 2 weeks"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={milestone.description}
                      onChange={(e) =>
                        updateMilestone(
                          milestone.id,
                          "description",
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                      placeholder="Detailed description of what will be delivered in this milestone..."
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline & Equity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">
                Overall Timeline
              </h3>
              <p className="text-gray-600 mb-4">
                When can you start and complete this project?
              </p>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) =>
                    handleInputChange("timeline", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                  placeholder="e.g., Start immediately, complete in 3 months"
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-navy mb-4">
                Equity Requested
              </h3>
              <p className="text-gray-600 mb-4">
                What percentage of equity do you request for your contribution?
              </p>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.equityRequested}
                  onChange={(e) =>
                    handleInputChange("equityRequested", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                  placeholder="e.g., 12% equity"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Available range: {idea.equity_offering}
              </p>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">
              Additional Notes (Optional)
            </h3>
            <p className="text-gray-600 mb-4">
              Any additional information, questions, or clarifications you'd
              like to share.
            </p>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) =>
                handleInputChange("additionalNotes", e.target.value)
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
              placeholder="e.g., Previous experience with similar projects, questions about the tech stack, availability for meetings, etc."
            />
          </div>

          {/* Important Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">
                  Important Notice
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>
                    • This proposal is not legally binding until a contract is
                    signed
                  </li>
                  <li>
                    • The founder may negotiate terms or request modifications
                  </li>
                  <li>
                    • All intellectual property will be owned by the founder as
                    per standard agreements
                  </li>
                  <li>
                    • Equity will be formalized only after contract execution
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/idea-details"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="px-8 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Submit Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
