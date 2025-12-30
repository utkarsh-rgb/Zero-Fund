const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const {
  generateVerificationToken,
  getTokenExpiry,
  sendVerificationEmail,
} = require("../utils/emailService");

// Password strength validation function
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = Object.values(requirements).every(Boolean);

  if (!isValid) {
    const errors = [];
    if (!requirements.minLength) errors.push("minimum 8 characters");
    if (!requirements.hasUpperCase) errors.push("at least one uppercase letter");
    if (!requirements.hasLowerCase) errors.push("at least one lowercase letter");
    if (!requirements.hasSpecialChar) errors.push("at least one special character");

    return {
      isValid: false,
      message: `Password must contain: ${errors.join(", ")}`,
    };
  }

  return { isValid: true };
};

// Developer signup
// app.post("/developers/signup",
const developerSignup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    // 🔥 CHECK BOTH TABLES
    const [[devExists]] = await pool.execute(
      "SELECT id FROM developers WHERE email = ?",
      [email]
    );

    const [[entExists]] = await pool.execute(
      "SELECT id FROM entrepreneur WHERE email = ?",
      [email]
    );

    if (devExists || entExists) {
      return res.status(400).json({
        message: "Email already registered with another account type",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const tokenExpiry = getTokenExpiry();

    await pool.execute(
      `INSERT INTO developers 
       (fullName, email, password, verification_token, token_expiry, is_verified)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [fullName, email, hashedPassword, verificationToken, tokenExpiry]
    );

    await sendVerificationEmail(email, fullName, verificationToken, "developer");

    return res.status(201).json({
      message:
        "Developer account created successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


//app.post("/entrepreneur/signup",
  const entrepreneurSignup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    // 🔥 CHECK BOTH TABLES
    const [[devExists]] = await pool.execute(
      "SELECT id FROM developers WHERE email = ?",
      [email]
    );

    const [[entExists]] = await pool.execute(
      "SELECT id FROM entrepreneur WHERE email = ?",
      [email]
    );

    if (devExists || entExists) {
      return res.status(400).json({
        message: "Email already registered with another account type",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const tokenExpiry = getTokenExpiry();

    await pool.execute(
      `INSERT INTO entrepreneur 
       (fullName, email, password, verification_token, token_expiry, is_verified)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [fullName, email, hashedPassword, verificationToken, tokenExpiry]
    );

    await sendVerificationEmail(
      email,
      fullName,
      verificationToken,
      "entrepreneur"
    );

    return res.status(201).json({
      message:
        "Entrepreneur account created successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const login =  async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType)
      return res.status(400).json({ message: "All fields are required" });

    const table = userType === "developer" ? "developers" : "entrepreneur";
    const [rows] = await pool.execute(
      `SELECT * FROM ${table} WHERE email = ?`,
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email address before logging in. Check your inbox for the verification link.",
        emailVerified: false
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      id: user.id,
      fullName: user.fullName || user.name,
      email: user.email,
      userType,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {developerSignup, entrepreneurSignup, login};