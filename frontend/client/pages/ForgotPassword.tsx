import React, { useState, useEffect } from "react";
import axiosLocal from "../api/axiosLocal";
import { Link } from "react-router-dom"; // for navigation

const ForgotPassword: React.FC = () => {
  const [role, setRole] = useState<"developer" | "entrepreneur">("developer");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Role changed to:", role);
  }, [role]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    console.log("Email input changed:", e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      const trimmedEmail = email.trim();
      const res = await axiosLocal.post(
        "/forgot-password",
        { role, email: trimmedEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(res.data.message);
    } catch (err: any) {
      console.error("Error from backend:", err.response?.data || err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex items-center justify-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="developer"
                checked={role === "developer"}
                onChange={() => setRole("developer")}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-700">Developer</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="entrepreneur"
                checked={role === "entrepreneur"}
                onChange={() => setRole("entrepreneur")}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-700">Entrepreneur</span>
            </label>
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              autoComplete="off"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Send Verification Link
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-green-600 font-medium">
            {message}
          </p>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
