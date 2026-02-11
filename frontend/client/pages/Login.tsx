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
  const [showModal, setShowModal] = useState(false);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors: { [key: string]: string } = {};

    if (!formData.userType) {
      newErrors.userType = "Please choose Entrepreneur or Developer";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await axiosLocal.post("/api/login", formData, {
        withCredentials: true, // 🔥 CRITICAL
      });

      const data = res.data;

      if (!data || data.message !== "Login successful") {
        setErrors({ form: data?.message || "Login failed" });
        return;
      }

      // ✅ Store ONLY non-sensitive data (optional)
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          userType: data.userType,
        }),
      );

      // ✅ Redirect by role
      if (data.userType === "developer") {
        navigate("/developer-dashboard");
      } else {
        navigate("/entrepreneur-dashboard");
      }
    } catch (error: any) {
      setErrors({
        form: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4 overflow-hidden">
      {/* Main Content */}
      <div className="w-full max-w-md lg:max-w-5xl xl:max-w-6xl h-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-center p-6 xl:p-8 bg-gradient-to-br from-skyblue to-navy text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20" />

              <div className="relative z-10">
                <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 xl:w-7 xl:h-7 text-white" />
                </div>
                <h2 className="text-xl xl:text-2xl font-bold mb-2">
                  Build Your Future
                </h2>
                <p className="text-blue-100 text-sm xl:text-base mb-5">
                  Join our community of entrepreneurs and developers creating
                  innovative solutions.
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <span className="text-xs xl:text-sm">Innovative Ideas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4" />
                    </div>
                    <span className="text-xs xl:text-sm">
                      Cutting-edge Technology
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-6 sm:p-7 lg:p-6 xl:p-8">
              {/* Mobile Logo - Only visible on small screens */}
              <div className="lg:hidden text-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Header */}
              <div className="mb-4 lg:mb-5">
                <h1 className="text-xl lg:text-2xl xl:text-2xl font-bold text-navy mb-1">
                  Welcome Back,
                </h1>
                <p className="text-xs lg:text-sm xl:text-sm text-gray-600">
                  Sign in to continue building
                </p>

                {errors.form && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                      {errors.form}
                    </p>
                  </div>
                )}
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-3 lg:space-y-3.5"
              >
                {/* User Type */}
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5">
                    <User className="inline w-3.5 h-3.5 mr-1" /> I am a...
                  </label>

                  <div className="grid grid-cols-2 gap-2.5">
                    {["entrepreneur", "developer"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleUserTypeSelect(type)}
                        className={`flex flex-col items-center p-2.5 rounded-lg border-2 transition-all
          ${
            formData.userType === type
              ? "border-skyblue bg-skyblue/10 text-skyblue shadow-md"
              : errors.userType
                ? "border-red-400 text-gray-600"
                : "border-gray-200 text-gray-600 hover:shadow hover:border-gray-300"
          }`}
                      >
                        {type === "entrepreneur" ? (
                          <Lightbulb className="w-5 h-5 mb-1" />
                        ) : (
                          <Code className="w-5 h-5 mb-1" />
                        )}
                        <span className="text-xs font-semibold capitalize">
                          {type}
                        </span>
                      </button>
                    ))}
                  </div>

                  {errors.userType && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">
                      {errors.userType}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5">
                    <Mail className="inline w-3.5 h-3.5 mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm transition"
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>
                {/* Password */}
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5">
                    <Lock className="inline w-3.5 h-3.5 mr-1" /> Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent text-sm transition
        ${errors.password ? "border-red-400" : "border-gray-300"}
      `}
                      placeholder="Enter password"
                      disabled={isLoading}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* ✅ PASSWORD ERROR MESSAGE (THIS WAS MISSING) */}
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-xs lg:text-sm text-skyblue hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 lg:py-2.5 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-skyblue to-navy hover:shadow-xl hover:scale-[1.02]"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {isLoading ? "Logging In.." : "Log In"}
                  </span>
                </button>
              </form>








              {/* Signup */}
<div className="w-full max-w-md mx-auto mt-4 bg-white  rounded-sm py-5">
  <div className="text-center text-sm">
    <span className="text-gray-700">
      Don't have an account?{" "}
    </span>
    <button
      onClick={() => setShowModal(true)}
      className="text-blue-500 font-semibold hover:text-blue-600 transition"
    >
      Sign Up
    </button>
  </div>
</div>

{/* Modal */}
{showModal && (
  <div
    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-navy transition"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold text-navy text-center mb-6">
        Choose Account Type
      </h2>

      <div className="space-y-3">
        {/* Entrepreneur */}
        <button
          onClick={() => {
            setShowModal(false);
            navigate("/entrepreneur-signup");
          }}
          className="w-full py-2.5 rounded-lg bg-skyblue/10 text-skyblue font-semibold hover:bg-skyblue/20 transition"
        >
          Entrepreneur
        </button>

        {/* Developer */}
        <button
          onClick={() => {
            setShowModal(false);
            navigate("/developer-signup");
          }}
          className="w-full py-2.5 rounded-lg bg-navy/10 text-navy font-semibold hover:bg-navy/20 transition"
        >
          Developer
        </button>
      </div>
    </div>
  </div>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
