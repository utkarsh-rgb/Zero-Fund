import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";
import {
  ArrowLeft,
  Lightbulb,
  Upload,
  Eye,
  EyeOff,
  Shield,
  Users,
  Globe,
  Plus,
  Trash2,
  FileText,
  Image,
  Video,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";

interface FormData {
  title: string;
  overview: string;
  stage: "Idea" | "MVP" | "Beta" | "";
  requiredSkills: string[];
  equityOffering: string;
  visibility: "Public" | "Invite Only" | "NDA Required";
  attachments: File[];
  timeline: string;
  budget: string;
  additionalRequirements: string;
}

const SKILL_OPTIONS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development (iOS)",
  "Mobile Development (Android)",
  "UI/UX Design",
  "DevOps & Cloud",
  "Data Science",
  "Machine Learning",
  "Blockchain",
  "Game Development",
  "QA Testing",
  "Product Management",
  "Digital Marketing",
];

const PROJECT_STAGES = [
  {
    value: "Idea",
    label: "Idea",
    description: "Concept stage, needs development",
  },
  {
    value: "MVP",
    label: "MVP",
    description: "Basic version built, needs enhancement",
  },
  {
    value: "Beta",
    label: "Beta",
    description: "Testing phase, needs refinement",
  },
];

export default function PostIdea() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    overview: "",
    stage: "",
    requiredSkills: [],
    equityOffering: "",
    visibility: "Public",
    attachments: [],
    timeline: "",
    budget: "",
    additionalRequirements: "",
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handlePublish = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const entrepreneurId = userData?.id; // optional chaining in case it's missing

      // Create FormData
      const data = new FormData();
      data.append("title", formData.title);
      data.append("overview", formData.overview);
      data.append("stage", formData.stage);
      data.append("equityOffering", formData.equityOffering);
      data.append("visibility", formData.visibility);
      data.append("timeline", formData.timeline);
      data.append("budget", formData.budget);
      data.append("additionalRequirements", formData.additionalRequirements);

      // Convert requiredSkills array to JSON string
      data.append("requiredSkills", JSON.stringify(formData.requiredSkills));

      // Append attachments
      formData.attachments.forEach((file) => {
        data.append("attachments", file);
      });
      // Append entrepreneur_id
      data.append("entrepreneur_id", entrepreneurId);
      // Log FormData contents
      console.log("FormData contents:");
      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      // Send FormData to backend using Axios
      const response = await axiosLocal.post(
        "/post-idea",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Log full response
      console.log("Server response details:", response);

      // Show alert
      alert("Idea submitted successfully!");

      // Redirect to entrepreneur-dashboard
      navigate("/entrepreneur-dashboard");
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Failed to submit idea. Please try again.");
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      return <Image className="w-4 h-4" />;
    }
    if (["mp4", "mov", "avi"].includes(extension || "")) {
      return <Video className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

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

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.overview && formData.stage;
      case 2:
        return formData.requiredSkills.length > 0;
      case 3:
        return true; // Optional step
      default:
        return true;
    }
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => setIsPreview(false)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Back to Edit</span>
              </button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Preview Mode</span>
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

        {/* Preview Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-skyblue rounded-full flex items-center justify-center text-white font-semibold">
                    PS
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-navy">
                      {formData.title}
                    </h1>
                    <p className="text-gray-600">by Priya Sharma</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {formData.stage}
                  </span>
                  <span className="flex items-center space-x-1 text-sm text-gray-600">
                    {getVisibilityIcon(formData.visibility)}
                    <span>{formData.visibility}</span>
                  </span>
                </div>

                <div className="prose prose-gray max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {formData.overview}
                  </p>
                </div>

                {formData.additionalRequirements && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-navy mb-3">
                      Additional Requirements
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {formData.additionalRequirements}
                    </p>
                  </div>
                )}

                {formData.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-3">
                      Project Files
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-skyblue/10 rounded-lg flex items-center justify-center">
                            {getFileIcon(file.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-navy mb-4">
                  Project Details
                </h3>
                <div className="space-y-4">
                  {formData.equityOffering && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Equity Offering
                      </p>
                      <p className="text-lg font-semibold text-skyblue">
                        {formData.equityOffering}
                      </p>
                    </div>
                  )}
                  {formData.timeline && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Timeline</p>
                      <p className="font-semibold text-gray-800">
                        {formData.timeline}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Required Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-skyblue/10 text-skyblue text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  onClick={handlePublish}
                  className="w-full bg-skyblue text-white py-3 rounded-lg font-semibold hover:bg-navy transition-colors mb-3"
                >
                  Publish Idea
                </button>
                <button
                  onClick={() => setIsPreview(false)}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue Editing
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/entrepreneur-dashboard"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Step {currentStep} of 3
              </span>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 3) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-skyblue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-navy mb-2">
                Post Your Startup Idea
              </h2>
              <p className="text-gray-600">
                Share your vision and find the right developers to bring it to
                life
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idea Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                  placeholder="e.g., AI-Powered Education Platform for Students"
                  maxLength={100}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Make it clear and compelling</span>
                  <span>{formData.title.length}/100</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Overview *
                </label>
                <textarea
                  value={formData.overview}
                  onChange={(e) =>
                    handleInputChange("overview", e.target.value)
                  }
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                  placeholder="Describe your startup idea, the problem it solves, your target market, and what you've built so far (if anything). Be specific about your vision and goals."
                  maxLength={2000}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>
                    Be detailed but concise - this is what developers will see
                    first
                  </span>
                  <span>{formData.overview.length}/2000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Project Stage *
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {PROJECT_STAGES.map((stage) => (
                    <button
                      key={stage.value}
                      type="button"
                      onClick={() => handleInputChange("stage", stage.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.stage === stage.value
                          ? "border-skyblue bg-skyblue/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {stage.label}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {stage.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={!isStepValid(1)}
                className="w-full bg-skyblue text-white py-3 rounded-lg font-semibold hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue to Skills & Requirements
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skills & Requirements */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy mb-2">
                Skills & Requirements
              </h2>
              <p className="text-gray-600">
                What skills and expertise do you need from developers?
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Required Skills *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SKILL_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.requiredSkills.includes(skill)
                          ? "border-skyblue bg-skyblue/10 text-skyblue"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select all skills that apply to your project
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equity Offering (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.equityOffering}
                      onChange={(e) =>
                        handleInputChange("equityOffering", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                      placeholder="e.g., 10-15% equity"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Timeline (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) =>
                      handleInputChange("timeline", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                    placeholder="e.g., 3-6 months"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements (Optional)
                </label>
                <textarea
                  value={formData.additionalRequirements}
                  onChange={(e) =>
                    handleInputChange("additionalRequirements", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent resize-none"
                  placeholder="Any specific requirements, preferences, or additional context for developers..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!isStepValid(2)}
                  className="flex-1 bg-skyblue text-white py-3 rounded-lg font-semibold hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue to Visibility & Files
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Visibility & Files */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy mb-2">
                Visibility & Files
              </h2>
              <p className="text-gray-600">
                Control who can see your idea and add supporting documents
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Visibility Settings
                </label>
                <div className="space-y-3">
                  {[
                    { value: "Public", label: "Public", icon: Globe },
                    { value: "Invite Only", label: "Invite Only", icon: Users },
                    {
                      value: "NDA Required",
                      label: "NDA Required",
                      icon: Shield,
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleInputChange("visibility", option.value)
                      }
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        formData.visibility === option.value
                          ? "border-skyblue bg-skyblue/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {option.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {getVisibilityDescription(option.value as any)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Files (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-skyblue transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">
                    Upload pitch decks, mockups, diagrams, or other files
                  </p>
                  <label className="inline-block bg-skyblue text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-navy transition-colors">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.fig,.mp4,.mov"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported: PDF, DOC, PPT, Images, Videos, Figma files
                  </p>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Uploaded Files ({formData.attachments.length})
                    </h4>
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-skyblue/10 rounded-lg flex items-center justify-center">
                            {getFileIcon(file.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {formData.visibility === "NDA Required" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-semibold mb-1">
                        NDA Protection Enabled
                      </p>
                      <p>
                        Developers will need to accept a non-disclosure
                        agreement before they can view your full idea details.
                        This helps protect your intellectual property.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setIsPreview(true)}
                  className="flex items-center space-x-2 px-6 py-3 border border-skyblue text-skyblue rounded-lg hover:bg-skyblue/10 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Publish Idea</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
