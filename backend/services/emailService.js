// ================================================
// EMAIL NOTIFICATION SERVICE
// ================================================
// Handles sending email notifications for critical events

const nodemailer = require("nodemailer");
const pool = require("../db");

// Create reusable transporter (configure with your email service)
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Check if user has email notifications enabled
 */
const checkEmailPreference = async (userId, userType, eventType) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM notification_preferences
       WHERE user_id = ? AND user_type = ?`,
      [userId, userType]
    );

    if (rows.length === 0) {
      // Default: all notifications enabled
      return true;
    }

    const prefs = rows[0];

    switch (eventType) {
      case "proposal":
        return prefs.email_on_proposal;
      case "contract":
        return prefs.email_on_contract;
      case "milestone":
        return prefs.email_on_milestone;
      case "message":
        return prefs.email_on_message;
      default:
        return true;
    }
  } catch (error) {
    console.error("Error checking email preference:", error);
    return true; // Default to sending if error
  }
};

/**
 * Send proposal submitted notification to entrepreneur
 */
const sendProposalSubmittedEmail = async (
  entrepreneurEmail,
  entrepreneurName,
  developerName,
  ideaTitle
) => {
  const mailOptions = {
    from: `"Zero-Fund Platform" <${process.env.SMTP_USER}>`,
    to: entrepreneurEmail,
    subject: `New Proposal Received for "${ideaTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Proposal Received!</h2>
        <p>Hi ${entrepreneurName},</p>
        <p><strong>${developerName}</strong> has submitted a proposal for your idea: <strong>"${ideaTitle}"</strong></p>
        <p>Log in to your dashboard to review the proposal and respond.</p>
        <a href="${process.env.FRONTEND_URL}/entrepreneur-dashboard"
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Review Proposal
        </a>
        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
          This is an automated notification from Zero-Fund platform.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Proposal notification email sent to ${entrepreneurEmail}`);
  } catch (error) {
    console.error("Error sending proposal email:", error);
  }
};

/**
 * Send proposal status update to developer
 */
const sendProposalStatusEmail = async (
  developerEmail,
  developerName,
  ideaTitle,
  status,
  entrepreneurName
) => {
  const isApproved = status === "Approved";
  const subject = isApproved
    ? `🎉 Your Proposal for "${ideaTitle}" was Approved!`
    : `Update on Your Proposal for "${ideaTitle}"`;

  const mailOptions = {
    from: `"Zero-Fund Platform" <${process.env.SMTP_USER}>`,
    to: developerEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${isApproved ? "#10B981" : "#6B7280"};">
          ${isApproved ? "Congratulations!" : "Proposal Update"}
        </h2>
        <p>Hi ${developerName},</p>
        ${
          isApproved
            ? `
          <p>Great news! <strong>${entrepreneurName}</strong> has approved your proposal for <strong>"${ideaTitle}"</strong>!</p>
          <p>Next steps:</p>
          <ol>
            <li>Review the contract terms</li>
            <li>Sign the contract</li>
            <li>Start your collaboration</li>
          </ol>
          <a href="${process.env.FRONTEND_URL}/developer-dashboard"
             style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            View Dashboard
          </a>
        `
            : `
          <p>Your proposal for <strong>"${ideaTitle}"</strong> was not accepted this time.</p>
          <p>Don't be discouraged! Keep refining your skills and proposals. There are many other exciting opportunities waiting for you on the platform.</p>
          <a href="${process.env.FRONTEND_URL}/developer-dashboard"
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Explore More Ideas
          </a>
        `
        }
        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
          This is an automated notification from Zero-Fund platform.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Proposal status email sent to ${developerEmail}`);
  } catch (error) {
    console.error("Error sending status email:", error);
  }
};

/**
 * Send contract signed notification
 */
const sendContractSignedEmail = async (
  recipientEmail,
  recipientName,
  signerName,
  projectTitle,
  recipientType
) => {
  const mailOptions = {
    from: `"Zero-Fund Platform" <${process.env.SMTP_USER}>`,
    to: recipientEmail,
    subject: `Contract Signed for "${projectTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Contract Update</h2>
        <p>Hi ${recipientName},</p>
        <p><strong>${signerName}</strong> has signed the contract for <strong>"${projectTitle}"</strong>.</p>
        ${
          recipientType === "entrepreneur"
            ? `
          <p>Please review and sign the contract to finalize the agreement and start the collaboration.</p>
          <a href="${process.env.FRONTEND_URL}/entrepreneur-dashboard"
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Review & Sign Contract
          </a>
        `
            : `
          <p>The contract has been fully signed by both parties. Your collaboration is now active!</p>
          <a href="${process.env.FRONTEND_URL}/developer-dashboard"
             style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            View Active Collaborations
          </a>
        `
        }
        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
          This is an automated notification from Zero-Fund platform.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contract signed email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending contract email:", error);
  }
};

/**
 * Send welcome email to new users
 */
const sendWelcomeEmail = async (email, fullName, userType) => {
  const dashboardUrl =
    userType === "developer"
      ? `${process.env.FRONTEND_URL}/developer-dashboard`
      : `${process.env.FRONTEND_URL}/entrepreneur-dashboard`;

  const mailOptions = {
    from: `"Zero-Fund Platform" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to Zero-Fund!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Welcome to Zero-Fund! 🚀</h1>
        <p>Hi ${fullName},</p>
        <p>Thank you for joining Zero-Fund - the platform connecting entrepreneurs and developers through equity-based partnerships.</p>
        ${
          userType === "developer"
            ? `
          <h3>As a Developer:</h3>
          <ul>
            <li>Browse exciting project ideas</li>
            <li>Submit proposals to entrepreneurs</li>
            <li>Work on equity-based collaborations</li>
            <li>Build your portfolio while gaining ownership</li>
          </ul>
        `
            : `
          <h3>As an Entrepreneur:</h3>
          <ul>
            <li>Post your project ideas</li>
            <li>Receive proposals from talented developers</li>
            <li>Build your team with equity offerings</li>
            <li>Turn your ideas into reality</li>
          </ul>
        `
        }
        <a href="${dashboardUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Go to Dashboard
        </a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy collaborating!</p>
        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
          The Zero-Fund Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

module.exports = {
  sendProposalSubmittedEmail,
  sendProposalStatusEmail,
  sendContractSignedEmail,
  sendWelcomeEmail,
  checkEmailPreference,
};
