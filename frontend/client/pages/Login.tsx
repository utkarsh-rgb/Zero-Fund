import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  else if (formData.password.length < 6)
    newErrors.password = "Password must be at least 6 characters";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ form: data.message });
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
    localStorage.setItem("userData", JSON.stringify(userData));

    // Redirect based on user type
    if (data.userType === "developer") navigate("/developer-dashboard");
    else if (data.userType === "entrepreneur") navigate("/entrepreneur-dashboard");
  } catch (err) {
    console.error(err);
    setErrors({ form: "Server error. Try again later." });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-softgray to-white">
      

      {/* Main Content */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-skyblue/10 to-purple-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-navy mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to access your dashboard and continue building</p>
              {errors.form && (
                <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.form}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <User className="inline w-4 h-4 mr-2" />
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelect("entrepreneur")}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                      formData.userType === "entrepreneur"
                        ? "border-skyblue bg-skyblue/10 text-skyblue shadow-lg"
                        : "border-gray-200 hover:border-gray-300 text-gray-600 hover:shadow-md"
                    }`}
                  >
                    <Lightbulb className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Entrepreneur</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelect("developer")}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                      formData.userType === "developer"
                        ? "border-skyblue bg-skyblue/10 text-skyblue shadow-lg"
                        : "border-gray-200 hover:border-gray-300 text-gray-600 hover:shadow-md"
                    }`}
                  >
                    <Code className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Developer</span>
                  </button>
                </div>
                {errors.userType && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.userType}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" /> Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent transition-all duration-300"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline w-4 h-4 mr-2" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent transition-all duration-300 pr-12"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 ${
                  isLoading ? "bg-gray-400 cursor-not-allowed scale-100" : "bg-gradient-to-r from-skyblue to-navy hover:shadow-lg"
                }`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                <span>{isLoading ? "Signing In..." : "Continue"}</span>
              </button>
            </form>
            {/* "Don't have an account?" section with theme consistency */}
<div className="mt-6 text-center relative z-10">
  <p className="text-gray-500 mb-3 font-medium">Don't have an account?</p>
  <div className="grid grid-cols-2 gap-4">
    <button
      type="button"
      onClick={() => navigate("/entrepreneur-signup")}
      className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-skyblue bg-skyblue/10 text-skyblue font-semibold hover:shadow-lg hover:bg-skyblue/20 transition-all duration-300"
    >
      <Lightbulb className="w-5 h-5" />
      Entrepreneur
    </button>
    <button
      type="button"
      onClick={() => navigate("/developer-signup")}
      className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-navy bg-navy/10 text-navy font-semibold hover:shadow-lg hover:bg-navy/20 transition-all duration-300"
    >
      <Code className="w-5 h-5" />
      Developer
    </button>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}
