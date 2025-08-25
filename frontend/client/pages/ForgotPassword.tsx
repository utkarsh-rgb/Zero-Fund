import React, { useState, useEffect } from "react";

const ForgotPassword = () => {
  const [role, setRole] = useState("developer");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Log role changes
  useEffect(() => {
    console.log("Role changed to:", role);
  }, [role]);

  // Log email input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log("Email input changed:", e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("----- Form Submitted -----");
    console.log("Role:", role);
    console.log("Email:", email);

    if (!email) {
      console.log("Error: Email field is empty");
      setMessage("Please enter your email");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Sending request to backend...");
      const trimmedEmail = email.trim();
      console.log("Trimmed Email:", trimmedEmail);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Backend responded: Success");
      setMessage("Password reset link sent to your email!");
      setEmail("");
    } catch (err) {
      console.error("Error from backend:", err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-3">
                Select your role
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="developer"
                    checked={role === "developer"}
                    onChange={() => setRole("developer")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Developer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="entrepreneur"
                    checked={role === "entrepreneur"}
                    onChange={() => setRole("entrepreneur")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Entrepreneur</span>
                </label>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm text-center ${
              message.includes("sent") 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="text-center">
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 text-sm"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;