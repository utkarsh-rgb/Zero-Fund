const pool = require("../db");
const { sendWelcomeEmail } = require("../utils/emailService");

// Verify email token
const verifyEmail = async (req, res) => {
  try {
    const { token, type } = req.query;

    if (!token || !type) {
      return res.status(400).json({
        message: "Missing verification token or user type",
        success: false
      });
    }

    const table = type === "developer" ? "developers" : "entrepreneur";

    // Find user with this token
    const [rows] = await pool.execute(
      `SELECT * FROM ${table} WHERE verification_token = ?`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid verification token",
        success: false
      });
    }

    const user = rows[0];

    // Check if already verified
    if (user.is_verified) {
      return res.status(200).json({
        message: "Email already verified. You can log in now.",
        success: true,
        alreadyVerified: true
      });
    }

    // Check if token has expired
    const now = new Date();
    const tokenExpiry = new Date(user.token_expiry);

    if (now > tokenExpiry) {
      return res.status(400).json({
        message: "Verification link has expired. Please request a new one.",
        success: false,
        expired: true
      });
    }

    // Verify the user
    await pool.execute(
      `UPDATE ${table} SET is_verified = 1, verification_token = NULL, token_expiry = NULL WHERE verification_token = ?`,
      [token]
    );

    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullName, type);

    res.status(200).json({
      message: "Email verified successfully! You can now log in.",
      success: true
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Server error during verification",
      success: false
    });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email, userType } = req.body;

    if (!email || !userType) {
      return res.status(400).json({
        message: "Email and user type are required",
        success: false
      });
    }

    const table = userType === "developer" ? "developers" : "entrepreneur";

    // Find user
    const [rows] = await pool.execute(
      `SELECT * FROM ${table} WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    const user = rows[0];

    // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({
        message: "Email is already verified",
        success: false
      });
    }

    // Generate new token
    const crypto = require("crypto");
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24);

    // Update token in database
    await pool.execute(
      `UPDATE ${table} SET verification_token = ?, token_expiry = ? WHERE email = ?`,
      [verificationToken, tokenExpiry, email]
    );

    // Send new verification email
    const { sendVerificationEmail } = require("../utils/emailService");
    const emailResult = await sendVerificationEmail(
      email,
      user.fullName,
      verificationToken,
      userType
    );

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send verification email",
        success: false
      });
    }

    res.status(200).json({
      message: "Verification email sent successfully. Please check your inbox.",
      success: true
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

module.exports = {
  verifyEmail,
  resendVerification,
};
