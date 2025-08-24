import React, { useState, useEffect } from "react";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [role, setRole] = useState<"developer" | "entrepreneur">("developer");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Log role changes
  useEffect(() => {
    console.log("Role changed to:", role);
  }, [role]);

  // Log email input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    console.log("Email input changed:", e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("----- Form Submitted -----");
    console.log("Role:", role);
    console.log("Email:", email);

    if (!email) {
      console.log("Error: Email field is empty");
      setMessage("Please enter your email");
      return;
    }

    try {
      console.log("Sending request to backend...");
      const trimmedEmail = email.trim();
console.log("Trimmed Email:", trimmedEmail);
      const res = await axios.post("http://localhost:5000/forgot-password", {
  role,
  email: trimmedEmail
}, {
  headers: { "Content-Type": "application/json" }
});


      console.log("Backend responded:", res.data);
      setMessage(res.data.message);
    } catch (err: any) {
      console.error("Error from backend:", err.response?.data || err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="radio"
              name="role"
              value="developer"
              checked={role === "developer"}
              onChange={() => setRole("developer")}
            /> Developer
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="role"
              value="entrepreneur"
              checked={role === "entrepreneur"}
              onChange={() => setRole("entrepreneur")}
            /> Entrepreneur
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
         <input
  type="email"
  autoComplete="off"
  placeholder="Enter your email"
  value={email}
  onChange={handleEmailChange}
  required
  style={{ padding: "5px", width: "250px" }}
/>

        </div>

        <button type="submit" style={{ padding: "5px 10px" }}>
          Send Verification Link
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "10px", color: "green" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
