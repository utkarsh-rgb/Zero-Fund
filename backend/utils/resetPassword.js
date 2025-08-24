const express = require("express");
const db = require("../db");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { role, newPassword } = req.body;

  if (!token || !role || !newPassword) {
    return res.status(400).json({ message: "Token, role, and new password are required" });
  }

  // Map roles to tables
  const tableMap = {
    developer: "developers",
    entrepreneur: "entrepreneur",
  };
  const table = tableMap[role];
  if (!table) return res.status(400).json({ message: "Invalid role" });

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Check if token exists and is not expired
    const selectQuery = `
      SELECT * FROM ${table} 
      WHERE reset_token = ? AND reset_token_expiry > NOW()
    `;
    db.query(selectQuery, [token], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0) return res.status(400).json({ message: "Invalid or expired token" });

      // Update password and clear reset token
      const updateQuery = `
        UPDATE ${table}
        SET password = ?, reset_token = NULL, reset_token_expiry = NULL
        WHERE reset_token = ?
      `;
      db.query(updateQuery, [hashedPassword, token], (updateErr, updateResult) => {
        if (updateErr) return res.status(500).json({ message: "Database update error" });

        res.json({ message: "Password reset successful!" });
      });
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
