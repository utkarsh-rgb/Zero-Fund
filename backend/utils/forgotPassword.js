const express = require("express");
const cors = require("cors");
const db = require("../db");
const bodyParser = require("body-parser");
const sendResetMail = require("./sendResetMail");
const crypto = require("crypto"); // ✅ For secure tokens

const app = express();
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

app.post("/forgot-password", async (req, res) => {
  console.log("===== /forgot-password request received =====");
  console.log("Request body:", req.body);

  const { role, email } = req.body;
  if (!role || !email) {
    console.log("❌ Missing role or email in request");
    return res.status(400).json({ message: "Role and email required" });
  }

  // Use a table map to avoid SQL injection
  const tableMap = {
    developer: "developers",
    entrepreneur: "entrepreneur"
  };
  const table = tableMap[role];
  if (!table) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Trim, lowercase, and sanitize email
  const emailSanitized = email.trim().toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
  console.log("Role:", role, "| Table:", table, "| Email sanitized:", emailSanitized);

  // Step 1: Check if email exists
  const selectQuery = `SELECT * FROM ${table} WHERE email = ?`;
  console.log("Executing SELECT query:", selectQuery, "| Params:", [emailSanitized]);

  db.query(selectQuery, [emailSanitized], async (selectErr, selectResult) => {
    if (selectErr) {
      console.error("❌ Database SELECT error:", selectErr);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("Database SELECT result:", selectResult);

    if (selectResult.length === 0) {
      console.log("❌ Email not found in database");
      return res.status(404).json({ message: "Email not registered" });
    }

    // Step 2: Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    console.log("Generated token:", token);

    // Step 3: Update DB with token and expiry (1 hour)
    const updateQuery = `
  UPDATE ${table} 
  SET reset_token = ?, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) 
  WHERE email = ?
`;

    console.log("Executing UPDATE query:", updateQuery, "| Params:", [token, emailSanitized]);

    db.query(updateQuery, [token, emailSanitized], async (updateErr, updateResult) => {
      if (updateErr) {
        console.error("❌ Database UPDATE error:", updateErr);
        return res.status(500).json({ message: "Database update error" });
      }

      console.log("Database UPDATE result:", updateResult);
      console.log("Update affected rows:", updateResult.affectedRows);

      if (updateResult.affectedRows === 0) {
        console.log("❌ No rows updated. Check email formatting or DB connection.");
        return res.status(404).json({ message: "Email not found in database" });
      }

      // Step 4: Send reset email
      const resetLink = `http://localhost:8080/reset-password/${token}`;
      console.log("Reset link:", resetLink);

      try {
        console.log("Sending reset email...");
        await sendResetMail(emailSanitized, resetLink);
        console.log("✅ Reset email sent successfully");
        res.json({ message: "Verification link sent to your email!" });
      } catch (mailErr) {
        console.error("❌ Failed to send reset email:", mailErr);
        res.status(500).json({ message: "Failed to send reset email" });
      }
    });
  });
});

module.exports = app;
