import { useState } from "react";
import { Link } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";
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
  X,
  AlertTriangle,
  Loader,
  CheckCircle,
  AlertCircle ,
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
    icon: <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-skyblue" />,
    title: "Post Your Startup Idea",
    description:
      "Share your vision, requirements, and equity offering. Choose visibility settings and attach supporting documents.",
  },
  {
    icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 text-skyblue" />,
    title: "Review Developer Proposals",
    description:
      "Receive proposals from skilled developers. Review their profiles, portfolios, and collaboration terms.",
  },
  {
    icon: <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-skyblue" />,
    title: "Auto-Generate Contracts",
    description:
      "Our platform creates legally binding contracts with equity terms, IP protection, and milestone tracking.",
  },
  {
    icon: <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-skyblue" />,
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [errorModal, setErrorModal] = useState<{
  show: boolean;
  message: string;
}>({
  show: false,
  message: "",
});

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

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;

    return {
      requirements,
      strength: metRequirements === 4 ? 'strong' : metRequirements >= 2 ? 'medium' : 'weak',
      score: metRequirements,
      isValid: metRequirements === 4,
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);



  const handleSubmit = async () => {
  if (!formData.fullName.trim()) {
    alert("Full name is required.");
    return;
  }
  if (!formData.email.includes("@")) {
    alert("Enter a valid email address.");
    return;
  }

  // Enhanced password validation
  if (!passwordStrength.isValid) {
    alert("Password must meet all requirements:\n- Minimum 8 characters\n- At least one uppercase letter\n- At least one lowercase letter\n- At least one special character");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  setIsLoading(true);

  try {
    const res = await axiosLocal.post(
      "/entrepreneur/signup",
      {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Show success modal instead of alert
    setUserEmail(formData.email);
    setShowSuccessModal(true);
  } catch (error: any) {
    console.error("Signup failed:", error);
    setErrorModal({
  show: true,
  message:
    error.response?.data?.message ||
    "Something went wrong. Please try again.",
});

    setIsLoading(false);
  }

  };

  // Intro Slides
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 sm:py-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-navy">Zero Fund</span>
              </Link>
              <button
                onClick={() => setStep(1)}
                className="text-xs sm:text-sm text-skyblue hover:text-navy transition-colors"
              >
                Skip intro
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-3 sm:mb-4 px-2">How Zero Fund Works</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-2">
              Connect with talented developers and build your startup through equity collaboration
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-8 mb-6 sm:mb-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-skyblue/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              {HOW_IT_WORKS_SLIDES[currentSlide].icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4 px-2">
              {HOW_IT_WORKS_SLIDES[currentSlide].title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
              {HOW_IT_WORKS_SLIDES[currentSlide].description}
            </p>
          </div>

          <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex space-x-2">
              {HOW_IT_WORKS_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
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
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep(1)}
              className="bg-skyblue text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-navy transition-all text-base sm:text-lg flex items-center space-x-2 mx-auto active:scale-95"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-2">
              Join entrepreneurs who are building the next generation of startups
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Form Step
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center py-4 sm:py-6">
      <div className="w-full max-w-md lg:max-w-lg px-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
              <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy mb-1 sm:mb-2">Join as Entrepreneur</h2>
            <p className="text-xs sm:text-sm text-gray-600 px-2">
              Create your account to start posting ideas and finding developers
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm sm:text-base"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm sm:text-base"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 sm:mt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 'strong'
                            ? 'bg-green-500 w-full'
                            : passwordStrength.strength === 'medium'
                            ? 'bg-yellow-500 w-2/3'
                            : 'bg-red-500 w-1/3'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        passwordStrength.strength === 'strong'
                          ? 'text-green-600'
                          : passwordStrength.strength === 'medium'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordStrength.strength === 'strong'
                        ? 'Strong'
                        : passwordStrength.strength === 'medium'
                        ? 'Medium'
                        : 'Weak'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${passwordStrength.requirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.minLength ? <Check className="w-3 h-3 mr-1 flex-shrink-0" /> : <X className="w-3 h-3 mr-1 flex-shrink-0" />}
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.requirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasUpperCase ? <Check className="w-3 h-3 mr-1 flex-shrink-0" /> : <X className="w-3 h-3 mr-1 flex-shrink-0" />}
                      <span>At least one uppercase letter</span>
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.requirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasLowerCase ? <Check className="w-3 h-3 mr-1 flex-shrink-0" /> : <X className="w-3 h-3 mr-1 flex-shrink-0" />}
                      <span>At least one lowercase letter</span>
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordStrength.requirements.hasSpecialChar ? <Check className="w-3 h-3 mr-1 flex-shrink-0" /> : <X className="w-3 h-3 mr-1 flex-shrink-0" />}
                      <span>At least one special character (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm sm:text-base"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.hasReadTerms}
                  onChange={(e) => handleInputChange("hasReadTerms", e.target.checked)}
                  className="w-4 h-4 text-skyblue mt-0.5"
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
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
              disabled={!formData.hasReadTerms || !formData.email || !formData.password || formData.password !== formData.confirmPassword || !formData.fullName || isLoading}
              className="w-full bg-gradient-to-r from-navy to-skyblue text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Entrepreneur Account</span>
              )}
            </button>
          </div>

          {/* Alternative Sign Up Options */}
          <div className="mt-4 sm:mt-6">
            <p className="text-center text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-skyblue hover:text-navy transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>

            {/* Back to Home Link */}
            <div className="mt-3 sm:mt-4 text-center">
              <Link
                to="/"
                className="inline-flex items-center text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Success Modal */}
    {showSuccessModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-300">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Account Created Successfully!
            </h3>
            <div className="mt-4 mb-6">
              <div className="bg-blue-50 border-l-4 border-skyblue p-4 rounded">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-skyblue mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm text-gray-700 mb-2">
                      We've sent a verification email to:
                    </p>
                    <p className="text-sm font-semibold text-navy break-all">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-xs sm:text-sm text-gray-700">
                <strong>⏰ Note:</strong> The verification link will expire in 24 hours.
                Please check your inbox (and spam folder) and click the link to activate your account.
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full bg-gradient-to-r from-navy to-skyblue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )}
    {/* Error Modal */}
{errorModal.show && (
  <div
    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    onClick={() => setErrorModal({ show: false, message: "" })}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-navy">
          Login Failed
        </h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        {errorModal.message}
      </p>

      <button
        onClick={() => setErrorModal({ show: false, message: "" })}
        className="w-full py-2.5 rounded-lg bg-navy text-white font-semibold hover:opacity-90 transition"
      >
        Okay
      </button>
    </div>
  </div>
)}

    </>
  );
}
