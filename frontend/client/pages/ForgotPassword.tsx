import React, { useState } from "react";
import axiosLocal from "../api/axiosLocal";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [role, setRole] = useState<"developer" | "entrepreneur">("developer");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axiosLocal.post("/forgot-password", {
        role,
        email: email.trim(),
      });

      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-slate-200">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-bold shadow-md">
            💡
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">
            Forgot Password
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Reset your access and continue building
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selector */}
          <div className="flex justify-center gap-6">
            {["developer", "entrepreneur"].map((item) => (
              <label
                key={item}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition
                  ${
                    role === item
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                <input
                  type="radio"
                  name="role"
                  value={item}
                  checked={role === item}
                  onChange={() => setRole(item as any)}
                  className="hidden"
                  disabled={loading}
                />
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </label>
            ))}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 disabled:bg-slate-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition flex items-center justify-center
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg"
              }
            `}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Sending link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-green-600 font-medium">
            {message}
          </p>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
