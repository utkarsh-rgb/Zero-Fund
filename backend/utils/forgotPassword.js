const express = require("express");
const cors = require("cors");
const dbPromise = require("../db"); // returns a promise
const bodyParser = require("body-parser");
const sendResetMail = require("./sendResetMail");
const crypto = require("crypto");

const router = express.Router();
router.use(cors({ origin: "http://localhost:8080", credentials: true }));
router.use(bodyParser.json());
router.use(express.json());

router.post("/forgot-password", async (req, res) => {
  try {
    const db = await dbPromise; // wait for the DB connection
    const { role, email } = req.body;
    if (!role || !email) return res.status(400).json({ message: "Role and email required" });

    const tableMap = { developer: "developers", entrepreneur: "entrepreneur" };
    const table = tableMap[role];
    if (!table) return res.status(400).json({ message: "Invalid role" });

    const emailSanitized = email.trim().toLowerCase();

    const [selectResult] = await db.execute(`SELECT * FROM ${table} WHERE email = ?`, [emailSanitized]);
    if (selectResult.length === 0) return res.status(404).json({ message: "Email not registered" });

    const token = crypto.randomBytes(32).toString("hex");

    const [updateResult] = await db.execute(
      `UPDATE ${table} 
       SET reset_token = ?, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) 
       WHERE email = ?`,
      [token, emailSanitized]
    );

    if (updateResult.affectedRows === 0) return res.status(404).json({ message: "Email not found in database" });
let resetLink = "";
    if (role === "developer") {
      resetLink = `http://localhost:8080/reset-password/d/${token}`;
    } else if (role === "entrepreneur") {
      resetLink = `http://localhost:8080/reset-password/e/${token}`;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
    await sendResetMail(emailSanitized, resetLink);

    res.json({ message: "Verification link sent to your email!" });
  } catch (error) {
    console.error("❌ /forgot-password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
