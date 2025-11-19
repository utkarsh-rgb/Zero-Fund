import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";
import {
  ArrowLeft,
  Code,
  Lightbulb,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValidated, setIsValidated] = useState(false);

  const handleUserTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, userType: type }));
    setErrors((prev) => ({ ...prev, userType: "" }));
  };


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  let newErrors: { [key: string]: string } = {};
  if (!formData.userType) newErrors.userType = "Please select your user type";
  if (!formData.email) newErrors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    newErrors.email = "Please enter a valid email address";
  if (!formData.password) newErrors.password = "Password is required";
  else if (formData.password.length < 8)
    newErrors.password = "Password must be at least 8 characters";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsLoading(true);

  try {
    const res = await axiosLocal.post("/api/login", formData);
    const data = res.data;

    // FIX: backend always returns 200, so check message
    if (!data || data.message !== "Login successful") {
      setErrors({ form: data?.message || "Login failed" });
      setIsLoading(false);
      return;
    }

    const userData = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      token: data.token,
      userType: data.userType,
    };

    localStorage.setItem("jwt_token", data.token);
    localStorage.setItem("userData", JSON.stringify(userData));

    // Redirect based on user type
    if (data.userType === "developer") {
      navigate("/developer-dashboard");
    } else if (data.userType === "entrepreneur") {
      navigate("/entrepreneur-dashboard");
    }

  } catch (err) {
    console.error(err);
    setErrors({ form: "Server error. Try again later." });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
      {/* Main Content */}
      <div className="w-full max-w-md px-4 py-6 sm:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-100 relative overflow-hidden">
          {/* Background decoration - hidden on very small screens */}
          <div className="hidden sm:block absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-skyblue/10 to-purple-500/10 rounded-full transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 relative z-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">Sign in to access your dashboard and continue building</p>
            {errors.form && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{errors.form}</span>
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 relative z-10">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                <User className="inline w-4 h-4 mr-1" />
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect("entrepreneur")}
                  className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
                    formData.userType === "entrepreneur"
                      ? "border-skyblue bg-skyblue/10 text-skyblue shadow-lg"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 hover:shadow-md active:scale-95"
                  }`}
                >
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm font-semibold">Entrepreneur</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect("developer")}
                  className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
                    formData.userType === "developer"
                      ? "border-skyblue bg-skyblue/10 text-skyblue shadow-lg"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 hover:shadow-md active:scale-95"
                  }`}
                >
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm font-semibold">Developer</span>
                </button>
              </div>
              {errors.userType && (
                <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>{errors.userType}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm font-medium text-skyblue hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-skyblue to-navy hover:shadow-lg active:scale-95"
              }`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Zap className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span>{isLoading ? "Signing In..." : "Continue"}</span>
            </button>
          </form>

          {/* "Don't have an account?" section */}
          <div className="mt-5 sm:mt-6 text-center relative z-10">
            <p className="text-gray-500 mb-3 font-medium text-sm sm:text-base">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate("/entrepreneur-signup")}
                className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg border-2 border-skyblue bg-skyblue/10 text-skyblue font-semibold hover:shadow-lg hover:bg-skyblue/20 transition-all duration-300 active:scale-95 text-xs sm:text-sm"
              >
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Entrepreneur</span>
                <span className="xs:hidden">Founder</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/developer-signup")}
                className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg border-2 border-navy bg-navy/10 text-navy font-semibold hover:shadow-lg hover:bg-navy/20 transition-all duration-300 active:scale-95 text-xs sm:text-sm"
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Developer</span>
              </button>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-4 sm:mt-6 text-center">
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
  );
}
