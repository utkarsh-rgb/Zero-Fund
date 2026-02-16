const pool = require("../db");
const nodemailer = require("nodemailer");

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Send welcome email to new subscriber
const sendWelcomeEmail = async (email) => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  const mailOptions = {
    from: `"Zero Fund Venture" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to Zero Fund Venture Newsletter! 🚀",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Zero Fund Venture</h1>
            <p style="color: #e0f2fe; margin: 10px 0 0; font-size: 16px;">Newsletter Subscription Confirmed</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e3a8a; font-size: 22px; margin-top: 0;">Welcome aboard! 🎉</h2>
            <p>Thank you for subscribing to the Zero Fund Venture newsletter.</p>
            <p>You'll now receive the latest updates on:</p>
            <ul style="padding-left: 20px; color: #555;">
              <li>🚀 Startup trends and insights</li>
              <li>🤝 Collaboration tips and opportunities</li>
              <li>💡 Platform updates and new features</li>
              <li>📚 Resources for entrepreneurs and developers</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Explore Zero Fund
              </a>
            </div>
            <p style="color: #6B7280; font-size: 13px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              You're receiving this email because you subscribed to the Zero Fund Venture newsletter.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if already subscribed
    const [existing] = await pool.query(
      "SELECT id FROM newsletter_subscribers WHERE email = ?",
      [trimmedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    await pool.query(
      "INSERT INTO newsletter_subscribers (email) VALUES (?)",
      [trimmedEmail]
    );

    // Send welcome email (non-blocking — don't fail subscription if email fails)
    sendWelcomeEmail(trimmedEmail).catch((err) => {
      console.error("Failed to send welcome email:", err.message);
    });

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({ message: "Failed to subscribe" });
  }
};

module.exports = { subscribe };
