// sendResetMail.js
const sendEmail = require("smart-mailer");
require("dotenv").config();

async function sendResetMail(toEmail, resetLink) {
  try {
    await sendEmail({
      from: `"Skill Invest Support" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Reset Your Password – Skill Invest",
      text: `You requested to reset your password. Use the link below:\n${resetLink}\nIf you didn’t request this, ignore this email.`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
        <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <div style="background:#0f172a; padding:20px; text-align:center;">
            <h1 style="color:#ffffff; margin:0;">Skill Invest</h1>
          </div>

          <div style="padding:30px; color:#333;">
            <h2 style="margin-top:0;">Reset your password</h2>
            <p>
              We received a request to reset your password for your Skill Invest account.
            </p>

            <div style="text-align:center; margin:30px 0;">
              <a href="${resetLink}"
                 style="
                   background:#2563eb;
                   color:#ffffff;
                   padding:12px 24px;
                   text-decoration:none;
                   border-radius:6px;
                   font-weight:bold;
                   display:inline-block;
                 ">
                Reset Password
              </a>
            </div>

            <p style="font-size:14px; color:#555;">
              This link is valid for a limited time. If you didn’t request a password reset,
              you can safely ignore this email — your account will remain secure.
            </p>

            <p style="margin-top:30px;">
              Regards,<br/>
              <strong>Skill Invest Team</strong>
            </p>
          </div>

          <div style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#64748b;">
            © ${new Date().getFullYear()} Skill Invest. All rights reserved.
          </div>

        </div>
      </div>
      `,
    });

    console.log("✅ Reset email sent successfully to", toEmail);
  } catch (err) {
    console.error("❌ Failed to send reset email:", err);
    throw err;
  }
}

module.exports = sendResetMail;
