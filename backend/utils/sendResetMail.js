// sendResetMail.js
const sendEmail = require('smart-mailer');
require('dotenv').config();

async function sendResetMail(toEmail, resetLink) {
  try {
    await sendEmail({
      from: `"Password Reset" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `<p>Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });
    console.log("✅ Reset email sent successfully to", toEmail);
  } catch (err) {
    console.error("❌ Failed to send reset email:", err);
    throw err;
  }
}

// Test call
const testEmail = "utkarshgupta.976274@gmail.com"; // replace with a real email
const testLink = "https://example.com/reset?token=12345";

sendResetMail(testEmail, testLink);

module.exports = sendResetMail;
