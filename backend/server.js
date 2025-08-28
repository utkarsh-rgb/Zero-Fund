const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const pool = require("./db"); // ✅ pool directly
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const forgotPasswordRouter = require("./utils/forgotPassword");
const resetPasswordRouter = require("./utils/resetPassword");
const authenticateJWT = require("./middleware/authenticateJWT");
const multer = require("multer");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  (req, res, next) => {
    console.log("Incoming request:", req.method, req.url, req.body);
    next();
  },
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());

// File uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.use("/", forgotPasswordRouter);
app.use("/", resetPasswordRouter);

// Developer signup
app.post("/developers/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const [existing] = await pool.execute("SELECT * FROM developers WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      "INSERT INTO developers (fullName, email, password) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword]
    );

    res.status(201).json({ message: "Developer account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Entrepreneur signup
app.post("/entrepreneur/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const [existing] = await pool.execute("SELECT * FROM entrepreneur WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      "INSERT INTO entrepreneur (name, email, password) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword]
    );

    res.status(201).json({ message: "Entrepreneur account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    if (!email || !password || !userType)
      return res.status(400).json({ message: "All fields are required" });

    const table = userType === "developer" ? "developers" : "entrepreneur";
    const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);

    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

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
});

// Post idea
app.post("/post-idea", upload.array("attachments"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    const {
      title, overview, stage, equityOffering, visibility,
      timeline, budget, additionalRequirements, requiredSkills,
    } = req.body;

    // Convert numeric fields safely
    const budgetValue = budget === "" ? null : parseFloat(budget);
const equityValue = equityOffering || null;

    // Parse requiredSkills JSON
    const skillsArray = typeof requiredSkills === "string"
      ? JSON.parse(requiredSkills)
      : requiredSkills;

    // Process uploaded files
    const attachmentsArray = req.files.map((file) => ({
      name: file.originalname,
      path: file.path,
    }));

    const sql = `
      INSERT INTO entrepreneur_idea
      (title, overview, stage, equity_offering, visibility, timeline, budget, additional_requirements, required_skills, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      title, overview, stage, equityValue, visibility, timeline,
      budgetValue, additionalRequirements,
      JSON.stringify(skillsArray), JSON.stringify(attachmentsArray),
    ];

    const [result] = await pool.execute(sql, values);

    res.status(200).json({
      message: "Project saved successfully",
      projectId: result.insertId,
      attachments: attachmentsArray,
      requiredSkills: skillsArray,
    });
  } catch (error) {
    console.error("Error inserting project:", error.message);
    res.status(500).json({ error: "Something went wrong", message: error.message });
  }
});

// Get developer profile
app.get("/developer-profile/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    const [devResults] = await pool.execute(
      `SELECT id, fullName, email, bio, location FROM developers WHERE id = ?`,
      [id]
    );
    if (devResults.length === 0) return res.status(404).json({ message: "Developer not found" });

    const developer = devResults[0];

    const [skills] = await pool.execute(`SELECT skill FROM developer_skills WHERE developer_id = ?`, [id]);
    developer.skills = skills.map(row => row.skill);

    const [links] = await pool.execute(`SELECT platform, url FROM developer_links WHERE developer_id = ?`, [id]);
    developer.socialLinks = links.map(row => ({ platform: row.platform, url: row.url }));

    const [projects] = await pool.execute(
      `SELECT project_name, project_url, description FROM developer_projects WHERE developer_id = ?`,
      [id]
    );
    developer.projects = projects;

    res.json(developer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch developer profile" });
  }
});

// Update developer profile
app.put("/developer-profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, bio, location, skills, socialLinks, projects } = req.body;

    await pool.execute(
      `UPDATE developers SET fullName = ?, email = ?, bio = ?, location = ? WHERE id = ?`,
      [fullName, email, bio, location, id]
    );

    await pool.execute(`DELETE FROM developer_skills WHERE developer_id = ?`, [id]);
    if (skills?.length) {
      const skillValues = skills.map(skill => [id, skill]);
      await pool.query(`INSERT INTO developer_skills (developer_id, skill) VALUES ?`, [skillValues]);
    }

    await pool.execute(`DELETE FROM developer_links WHERE developer_id = ?`, [id]);
    if (socialLinks?.length) {
      const linkValues = socialLinks.map(link => [id, link.platform, link.url]);
      await pool.query(`INSERT INTO developer_links (developer_id, platform, url) VALUES ?`, [linkValues]);
    }

    await pool.execute(`DELETE FROM developer_projects WHERE developer_id = ?`, [id]);
    if (projects?.length) {
      const projectValues = projects.map(p => [id, p.project_name, p.project_url, p.description]);
      await pool.query(
        `INSERT INTO developer_projects (developer_id, project_name, project_url, description) VALUES ?`,
        [projectValues]
      );
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update developer profile" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
