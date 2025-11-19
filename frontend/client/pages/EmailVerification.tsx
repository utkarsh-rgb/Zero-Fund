import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";
import { CheckCircle, XCircle, Loader, Mail, AlertCircle, Lightbulb } from "lucide-react";

export default function EmailVerification() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token and type from URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const type = params.get("type");

        if (!token || !type) {
          setStatus("error");
          setMessage("Invalid verification link. Please check your email and try again.");
          return;
        }

        // Call verification endpoint
        const response = await axiosLocal.get(`/verify-email?token=${token}&type=${type}`);

        if (response.data.success) {
          setStatus("success");
          setMessage(response.data.message);
        } else {
          setStatus("error");
          setMessage(response.data.message || "Verification failed");
        }
      } catch (error: any) {
        console.error("Verification error:", error);

        if (error.response?.data?.expired) {
          setStatus("expired");
          setMessage(error.response.data.message || "Verification link has expired");
        } else {
          setStatus("error");
          setMessage(error.response?.data?.message || "Verification failed. Please try again.");
        }
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-navy">Zero Fund</span>
          </Link>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          {/* Loading State */}
          {status === "loading" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <Loader className="w-16 h-16 sm:w-20 sm:h-20 text-skyblue animate-spin" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-2">Verifying Your Email</h2>
              <p className="text-sm sm:text-base text-gray-600">Please wait while we verify your account...</p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-2">Email Verified!</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-navy to-skyblue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
                >
                  Go to Login
                </Link>
                <Link
                  to="/"
                  className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-skyblue hover:text-skyblue transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-2">Verification Failed</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-navy to-skyblue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
                >
                  Try Logging In
                </Link>
                <Link
                  to="/"
                  className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-skyblue hover:text-skyblue transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* Expired State */}
          {status === "expired" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-2">Link Expired</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{message}</p>

              <div className="bg-blue-50 border-l-4 border-skyblue p-4 mb-6 rounded text-left">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-skyblue mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Need a new link?</strong> Try logging in with your credentials. If your email isn't verified, you'll receive a new verification email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-navy to-skyblue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95"
                >
                  Go to Login
                </Link>
                <Link
                  to="/"
                  className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-skyblue hover:text-skyblue transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-xs sm:text-sm text-gray-500">
            Having trouble? Contact us at{" "}
            <a href="mailto:support@zerofund.com" className="text-skyblue hover:text-navy">
              support@zerofund.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
