import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosLocal from "../api/axiosLocal";

/* ---------------- PASSWORD STRENGTH LOGIC ---------------- */
const getPasswordStrength = (password: string) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const met = Object.values(requirements).filter(Boolean).length;

  return {
    requirements,
    strength: met === 4 ? "strong" : met >= 2 ? "medium" : "weak",
    isValid: met === 4,
  };
};

/* ---------------- COMPONENT ---------------- */
const ResetPassword: React.FC = () => {
  const { role, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordCheck = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordCheck.isValid) {
      toast.error("Password does not meet all requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosLocal.post(
        `/reset-password/${role}/${token}`,
        { newPassword }
      );

      toast.success(res.data.message || "Password reset successfully!");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NEW PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* PASSWORD STRENGTH */}
          {newPassword && (
            <div className="text-sm">
              <p
                className={`font-semibold ${
                  passwordCheck.strength === "strong"
                    ? "text-green-600"
                    : passwordCheck.strength === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Strength: {passwordCheck.strength.toUpperCase()}
              </p>

              <ul className="mt-2 space-y-1">
                <li className={passwordCheck.requirements.minLength ? "text-green-600" : "text-red-600"}>
                  • Minimum 8 characters
                </li>
                <li className={passwordCheck.requirements.hasUpperCase ? "text-green-600" : "text-red-600"}>
                  • One uppercase letter
                </li>
                <li className={passwordCheck.requirements.hasLowerCase ? "text-green-600" : "text-red-600"}>
                  • One lowercase letter
                </li>
                <li className={passwordCheck.requirements.hasSpecialChar ? "text-green-600" : "text-red-600"}>
                  • One special character
                </li>
              </ul>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!passwordCheck.isValid || loading}
            className={`w-full py-2 rounded-lg text-white flex items-center justify-center gap-2 transition ${
              passwordCheck.isValid && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
            disabled={loading}
          >
            ← Back to Login
          </button>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ResetPassword;
