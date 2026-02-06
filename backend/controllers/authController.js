const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const {
  generateVerificationToken,
  getTokenExpiry,
  sendVerificationEmail,
} = require("../utils/emailService");

// ------------------------
// Password validation
// ------------------------
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
    if (!requirements.hasSpecialChar)
      errors.push("at least one special character");

    return {
      isValid: false,
      message: `Password must contain: ${errors.join(", ")}`,
    };
  }

  return { isValid: true };
};

// ------------------------
// Developer Signup
// ------------------------
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

    const [[devExists]] = await pool.execute(
      "SELECT id FROM developers WHERE email = ?",
      [email]
    );

    const [[entExists]] = await pool.execute(
      "SELECT id FROM entrepreneur WHERE email = ?",
      [email]
    );

    if (devExists || entExists) {
      return res
        .status(400)
        .json({ message: "Email already registered with another account type" });
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

    res.status(201).json({
      message:
        "Developer account created successfully. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------
// Entrepreneur Signup
// ------------------------
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

    const [[devExists]] = await pool.execute(
      "SELECT id FROM developers WHERE email = ?",
      [email]
    );

    const [[entExists]] = await pool.execute(
      "SELECT id FROM entrepreneur WHERE email = ?",
      [email]
    );

    if (devExists || entExists) {
      return res
        .status(400)
        .json({ message: "Email already registered with another account type" });
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

    res.status(201).json({
      message:
        "Entrepreneur account created successfully. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------
// LOGIN (COOKIE BASED 🔥)
// ------------------------
const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tableMap = {
      developer: "developers",
      entrepreneur: "entrepreneur",
    };

    const table = tableMap[userType];
    if (!table) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM ${table} WHERE email = ? LIMIT 1`,
      [email]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        emailVerified: false,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔐 SET COOKIE (CRITICAL FIX)
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,       // HTTPS (AWS)
      sameSite: "none",   // cross-domain
      maxAge: 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      id: user.id,
      fullName: user.fullName || user.name,
      email: user.email,
      userType,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------
// LOGOUT (IMPORTANT)
// ------------------------
const logout = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "Logged out successfully" });
};

module.exports = {
  developerSignup,
  entrepreneurSignup,
  login,
  logout,
};
