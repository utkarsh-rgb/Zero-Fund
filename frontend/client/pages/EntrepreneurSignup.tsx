import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Linkedin,
  Mail,
  Eye,
  EyeOff,
  Check,
  Users,
  FileText,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  hasReadTerms: boolean;
}

const HOW_IT_WORKS_SLIDES = [
  {
    icon: <Lightbulb className="w-12 h-12 text-skyblue" />,
    title: "Post Your Startup Idea",
    description:
      "Share your vision, requirements, and equity offering. Choose visibility settings and attach supporting documents.",
  },
  {
    icon: <Users className="w-12 h-12 text-skyblue" />,
    title: "Review Developer Proposals",
    description:
      "Receive proposals from skilled developers. Review their profiles, portfolios, and collaboration terms.",
  },
  {
    icon: <FileText className="w-12 h-12 text-skyblue" />,
    title: "Auto-Generate Contracts",
    description:
      "Our platform creates legally binding contracts with equity terms, IP protection, and milestone tracking.",
  },
  {
    icon: <TrendingUp className="w-12 h-12 text-skyblue" />,
    title: "Build Together",
    description:
      "Collaborate with developers, track progress, and build your startup with equity-based partnerships.",
  },
];

export default function EntrepreneurSignup() {
  const [step, setStep] = useState(0); // 0 = intro, 1 = form
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    hasReadTerms: false,
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };



  const handleSubmit = async () => {
  if (!formData.fullName.trim()) {
    alert("Full name is required.");
    return;
  }
  if (!formData.email.includes("@")) {
    alert("Enter a valid email address.");
    return;
  }
  if (formData.password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/entrepreneur/signup",
      {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Server Response:", res.data);
    alert(res.data.message);
    window.location.href = "/login";
  } catch (error: any) {
    console.error("Signup failed:", error);
    alert(error.response?.data?.message || "Something went wrong. Please try again.");
  }

  };

  // Intro Slides
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-softgray to-white">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy">Skill Invest</span>
              </Link>
              <button
                onClick={() => setStep(1)}
                className="text-skyblue hover:text-navy transition-colors"
              >
                Skip intro
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy mb-4">How Skill Invest Works</h1>
            <p className="text-xl text-gray-600">
              Connect with talented developers and build your startup through equity collaboration
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <div className="w-20 h-20 bg-skyblue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              {HOW_IT_WORKS_SLIDES[currentSlide].icon}
            </div>
            <h2 className="text-2xl font-bold text-navy mb-4">
              {HOW_IT_WORKS_SLIDES[currentSlide].title}
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {HOW_IT_WORKS_SLIDES[currentSlide].description}
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4 mb-8">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {HOW_IT_WORKS_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? "bg-skyblue" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentSlide(Math.min(HOW_IT_WORKS_SLIDES.length - 1, currentSlide + 1))
              }
              disabled={currentSlide === HOW_IT_WORKS_SLIDES.length - 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep(1)}
              className="bg-skyblue text-white px-8 py-4 rounded-lg font-semibold hover:bg-navy transition-colors text-lg flex items-center space-x-2 mx-auto"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Join entrepreneurs who are building the next generation of startups
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Form Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-softgray to-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy">Skill Invest</span>
            </Link>
            
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-navy mb-2">Join as Entrepreneur</h2>
            <p className="text-gray-600">
              Create your account to start posting ideas and finding developers
            </p>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.hasReadTerms}
                  onChange={(e) => handleInputChange("hasReadTerms", e.target.checked)}
                  className="w-4 h-4 text-skyblue mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I have read and agree to the{" "}
                  <a href="#" className="text-skyblue hover:text-navy">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-skyblue hover:text-navy">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!formData.hasReadTerms || !formData.email || !formData.password || formData.password !== formData.confirmPassword || !formData.fullName}
              className="w-full bg-skyblue text-white py-3 rounded-lg font-semibold hover:bg-navy transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Create Entrepreneur Account</span>
              
            </button>

            
          </div>
          
        </div>
      </div>
    </div>
  );
}
