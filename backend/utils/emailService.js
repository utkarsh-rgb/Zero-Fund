const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Calculate token expiry (24 hours from now)
const getTokenExpiry = () => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
};

// Send verification email
const sendVerificationEmail = async (email, fullName, token, userType) => {
  try {
    const transporter = createTransporter();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verificationLink = `${frontendUrl}/verify-email?token=${token}&type=${userType}`;

    const mailOptions = {
      from: `"Zero Fund" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Zero Fund Account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #1e3a8a;
              font-size: 24px;
              margin-top: 0;
              margin-bottom: 20px;
            }
            .content p {
              margin: 15px 0;
              color: #555;
              font-size: 16px;
            }
            .button-container {
              text-align: center;
              margin: 35px 0;
            }
            .verify-button {
              display: inline-block;
              background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
              color: #ffffff;
              text-decoration: none;
              padding: 16px 40px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              transition: transform 0.2s;
            }
            .verify-button:hover {
              transform: translateY(-2px);
            }
            .info-box {
              background: #f0f9ff;
              border-left: 4px solid #0ea5e9;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .info-box p {
              margin: 5px 0;
              font-size: 14px;
              color: #1e3a8a;
            }
            .footer {
              background: #f8f9fa;
              padding: 25px;
              text-align: center;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              margin: 5px 0;
              color: #6c757d;
              font-size: 13px;
            }
            .link {
              color: #0ea5e9;
              word-break: break-all;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Zero Fund</h1>
            </div>
            <div class="content">
              <h2>Welcome, ${fullName}! 👋</h2>
              <p>Thank you for signing up as ${userType === 'developer' ? 'a Developer' : 'an Entrepreneur'} on Zero Fund!</p>
              <p>To complete your registration and start building equity-based partnerships, please verify your email address by clicking the button below:</p>

              <div class="button-container">
                <a href="${verificationLink}" class="verify-button">Verify Email Address</a>
              </div>

              <div class="info-box">
                <p><strong>⏰ Important:</strong> This verification link will expire in 24 hours.</p>
                <p><strong>🔒 Security:</strong> If you didn't create an account, please ignore this email.</p>
              </div>

              <p style="margin-top: 30px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p class="link">${verificationLink}</p>
            </div>
            <div class="footer">
              <p><strong>Zero Fund</strong> - Building the Next Generation of Startups</p>
              <p>© ${new Date().getFullYear()} Zero Fund. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Zero Fund, ${fullName}!

        Thank you for signing up as ${userType === 'developer' ? 'a Developer' : 'an Entrepreneur'}!

        To complete your registration, please verify your email address by clicking the link below:
        ${verificationLink}

        This link will expire in 24 hours.

        If you didn't create an account, please ignore this email.

        Best regards,
        Zero Fund Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.error("Verification email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, fullName, userType) => {
  try {
    const transporter = createTransporter();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const dashboardLink = `${frontendUrl}/login`;

    const mailOptions = {
      from: `"Zero Fund" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Zero Fund - Email Verified!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .success-icon {
              text-align: center;
              font-size: 64px;
              margin-bottom: 20px;
            }
            .content h2 {
              color: #1e3a8a;
              font-size: 24px;
              text-align: center;
              margin-top: 0;
              margin-bottom: 20px;
            }
            .content p {
              margin: 15px 0;
              color: #555;
              font-size: 16px;
            }
            .button-container {
              text-align: center;
              margin: 35px 0;
            }
            .login-button {
              display: inline-block;
              background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%);
              color: #ffffff;
              text-decoration: none;
              padding: 16px 40px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
            }
            .footer {
              background: #f8f9fa;
              padding: 25px;
              text-align: center;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              margin: 5px 0;
              color: #6c757d;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Zero Fund</h1>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <h2>Email Verified Successfully!</h2>
              <p>Congratulations, ${fullName}!</p>
              <p>Your email has been verified and your account is now active. You can now log in and start ${userType === 'developer' ? 'exploring startup ideas and submitting proposals' : 'posting ideas and connecting with talented developers'}.</p>

              <div class="button-container">
                <a href="${dashboardLink}" class="login-button">Log In to Your Account</a>
              </div>

              <p style="margin-top: 30px; text-align: center;">Ready to build the next generation of startups? 🚀</p>
            </div>
            <div class="footer">
              <p><strong>Zero Fund</strong> - Building the Next Generation of Startups</p>
              <p>© ${new Date().getFullYear()} Zero Fund. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.error("Welcome email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateVerificationToken,
  getTokenExpiry,
  sendVerificationEmail,
  sendWelcomeEmail,
};
