const express = require("express");
const router = express.Router();
const { verifyEmail, resendVerification } = require("../controllers/verificationController");

// Verify email with token
router.get("/verify-email", verifyEmail);

// Resend verification email
router.post("/resend-verification", resendVerification);

module.exports = router;
