const express = require("express");
const dbPromise = require("../db"); // mysql2/promise pool
const bcrypt = require("bcryptjs");
require("dotenv").config();

const router = express.Router();

router.get('/reset-password/:role/:token', async (req, res) => {
  const db = await dbPromise;  
  const { role, token } = req.params;
    const tableMap = { d: "developers", e: "entrepreneur" };
    const table = tableMap[role];
    if (!table) return res.status(400).send('Invalid role');

    const [rows] = await db.query(
        `SELECT * FROM ${table} WHERE reset_token = ? AND reset_token_expiry > NOW()`,
        [token]
    );

    if (rows.length === 0) return res.status(400).send('Invalid or expired token');

    // Use frontend URL from environment variable
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    res.redirect(`${frontendUrl}/reset-password/${role}/${token}`);
});

router.post("/reset-password/:role/:token", async (req, res) => {
    const db = await dbPromise;  
  const { role, token } = req.params;
  const { newPassword } = req.body;
  const tableMap = { d: "developers", e: "entrepreneur" };
  const table = tableMap[role];
  if (!table) return res.status(400).json({ message: "Invalid role" });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [rows] = await db.query(
      `SELECT * FROM ${table} WHERE reset_token = ? AND reset_token_expiry > NOW()`,
      [token]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Invalid or expired token" });

    await db.query(
      `UPDATE ${table} SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?`,
      [hashedPassword, token]
    );

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
