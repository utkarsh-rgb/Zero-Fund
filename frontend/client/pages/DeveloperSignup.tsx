import { useState } from "react";
import { Link } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";
import {
  Code,
  Github,
  Mail,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowLeft,
  Loader,
  CheckCircle,
} from "lucide-react";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

const SKILL_OPTIONS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack",
  "Mobile Development",
  "UI/UX Design",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Blockchain",
  "Game Development",
];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "Other",
];

export default function DeveloperSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  const handleInputChange = (field: keyof FormData, value: string | File) => {
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
      "/developers/signup",
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
    alert(error.response?.data?.message || "Something went wrong. Please try again.");
    setIsLoading(false);
  }
};
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center py-4 sm:py-6">
      <div className="w-full max-w-md lg:max-w-lg px-4">
        {/* Step 1: Account Setup */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-navy to-skyblue rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
              <Code className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy mb-1 sm:mb-2">
              Join as Developer
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 px-2">
              Create your account to start earning equity in exciting startups
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  handleInputChange("fullName", e.target.value)
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm sm:text-base"
                placeholder="Enter your full name"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm sm:text-base"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm sm:text-base"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>


            <button
                onClick={handleSubmit}
                disabled={
                !formData.email ||
                !formData.password ||
                !formData.fullName ||
                formData.password !== formData.confirmPassword ||
                isLoading
              }
              className="w-full bg-gradient-to-r from-navy to-skyblue text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Developer Account</span>
                )}
              </button>
          </div>

          {/* Alternative Sign Up Options */}
          <div className="mt-4 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
              <button className="w-full inline-flex justify-center py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors active:scale-95">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button className="w-full inline-flex justify-center py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors active:scale-95">
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="ml-2">GitHub</span>
              </button>
            </div>

            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-skyblue hover:text-navy transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>

            {/* Back to Home Link */}
            <div className="mt-4 text-center">
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
    </>
  );
}
