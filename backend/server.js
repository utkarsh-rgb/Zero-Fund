const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const dbPromise = require("./db"); // promise-based connection
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const forgotPasswordRouter = require("./utils/forgotPassword");
const resetPasswordRouter = require("./utils/resetPassword");
const authenticateJWT = require("./middleware/authenticateJWT");
require("dotenv").config();

const app = express();

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

app.use("/", forgotPasswordRouter);
app.use("/", resetPasswordRouter);

// Developer signup
app.post("/developers/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const db = await dbPromise;
    const [existing] = await db.execute("SELECT * FROM developers WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
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

    const db = await dbPromise;
    const [existing] = await db.execute("SELECT * FROM entrepreneur WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
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
    const db = await dbPromise;
    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);

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

// Get developer profile
app.get("/developer-profile/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await dbPromise;

    const [devResults] = await db.execute(
      `SELECT id, fullName, email, bio, location FROM developers WHERE id = ?`,
      [id]
    );
    if (devResults.length === 0) return res.status(404).json({ message: "Developer not found" });

    const developer = devResults[0];

    const [skills] = await db.execute(`SELECT skill FROM developer_skills WHERE developer_id = ?`, [id]);
    developer.skills = skills.map(row => row.skill);

    const [links] = await db.execute(`SELECT platform, url FROM developer_links WHERE developer_id = ?`, [id]);
    developer.socialLinks = links.map(row => ({ platform: row.platform, url: row.url }));

    const [projects] = await db.execute(
      `SELECT project_name, project_url, description FROM developer_projects WHERE developer_id = ?`,
      [id]
    );
    developer.projects = projects.map(row => ({
      project_name: row.project_name,
      project_url: row.project_url,
      description: row.description,
    }));

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
    const db = await dbPromise;

    // 1️⃣ Update main developer info
    await db.execute(
      `UPDATE developers SET fullName = ?, email = ?, bio = ?, location = ? WHERE id = ?`,
      [fullName, email, bio, location, id]
    );

    // 2️⃣ Update skills
    await db.execute(`DELETE FROM developer_skills WHERE developer_id = ?`, [id]);
    if (skills && skills.length) {
      const skillValues = skills.map(skill => [id, skill]);
      await db.query(`INSERT INTO developer_skills (developer_id, skill) VALUES ?`, [skillValues]);
    }

    // 3️⃣ Update social links
    await db.execute(`DELETE FROM developer_links WHERE developer_id = ?`, [id]);
    if (socialLinks && socialLinks.length) {
      const linkValues = socialLinks.map(link => [id, link.platform, link.url]);
      await db.query(`INSERT INTO developer_links (developer_id, platform, url) VALUES ?`, [linkValues]);
    }

    // 4️⃣ Update projects
    await db.execute(`DELETE FROM developer_projects WHERE developer_id = ?`, [id]);
    if (projects && projects.length) {
      const projectValues = projects.map(p => [id, p.project_name, p.project_url, p.description]);
      await db.query(
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
