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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
      entrepreneur_id,
    } = req.body;
       if (!entrepreneur_id) {
      return res.status(400).json({ error: "Entrepreneur ID is required" });
    }

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
      path: `uploads/${file.filename}`,
    }));

    const sql = `
      INSERT INTO entrepreneur_idea
      (entrepreneur_id,title, overview, stage, equity_offering, visibility, timeline, budget, additional_requirements, required_skills, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      entrepreneur_id,title, overview, stage, equityValue, visibility, timeline,
      budgetValue, additionalRequirements,
      JSON.stringify(requiredSkills), JSON.stringify(attachmentsArray),
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


app.get("/entrepreneur-dashboard", async (req, res) => {
  
  try {
    const [rows] = await pool.query(
      "SELECT * FROM entrepreneur_idea ORDER BY created_at DESC"
    );

    // convert JSON fields back to JS objects
  const ideas = rows.map((row) => {
  let requiredSkills = [];
  let attachments = [];
  
  try {
    requiredSkills = row.required_skills ? JSON.parse(row.required_skills) : [];
  } catch (err) {
    requiredSkills = row.required_skills ? [row.required_skills] : [];
  }

  try {
    attachments = row.attachments ? JSON.parse(row.attachments) : [];
  } catch (err) {
    attachments = row.attachments ? [row.attachments] : [];
  }

  return {
    ...row,
    required_skills: requiredSkills,
    attachments: attachments,
  };
});

    res.json(ideas);
  } catch (err) {
    console.error("Error fetching ideas:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /api/ideas/:id
app.delete("/entrepreneur-dashboard/ideas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM entrepreneur_idea WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Idea not found" });
    }

    res.json({ message: "Idea deleted successfully" });
  } catch (err) {
    console.error("Error deleting idea:", err);
    res.status(500).json({ error: "Database error" });
  }
});

const parseJSONSafe = (data) => {
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    // If parsing fails, wrap single string in array
    return [data];
  }
};

app.get("/entrepreneur-dashboard/ideas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM entrepreneur_idea WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Idea not found" });

    const idea = rows[0];
    idea.required_skills = parseJSONSafe(idea.required_skills);
    idea.attachments = parseJSONSafe(idea.attachments);

    res.json(idea);
  } catch (err) {
    console.error("Error fetching idea:", err);
    res.status(500).json({ error: "Database error" });
  }
});



// PUT /api/ideas/:id
app.put("/entrepreneur-dashboard/ideas/:id", async (req, res) => {
  const { id } = req.params;
  const { title, overview, stage, equity_offering, visibility, timeline, budget, additional_requirements, required_skills, attachments } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE entrepreneur_idea SET title=?, overview=?, stage=?, equity_offering=?, visibility=?, timeline=?, budget=?, additional_requirements=?, required_skills=?, attachments=? WHERE id=?",
      [
        title,
        overview,
        stage,
        equity_offering,
        visibility,
        timeline,
        budget,
        additional_requirements,
        JSON.stringify(required_skills),
        JSON.stringify(attachments),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Idea not found" });
    }

    res.json({ message: "Idea updated successfully" });
  } catch (err) {
    console.error("Error updating idea:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// GET /developer-dashboard
app.get("/developer-dashboard", async (req, res) => {
  try {
    // Fetch all pending ideas
    const [rows] = await pool.query(
      `SELECT 
      e.name,
         ei.*
       FROM entrepreneur_idea ei
       JOIN entrepreneur e on ei.entrepreneur_id = e.id
       WHERE ei.status = 0`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching ideas",
    });
  }
});

app.get('/proposal/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query('SELECT e.name AS founderName, ei.* FROM entrepreneur_idea ei JOIN entrepreneur e ON ei.entrepreneur_id = e.id WHERE ei.id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/submit-proposal", async (req, res) => {
  try {
    const {
      ideaId,
      developerId, 
      scope,
      timeline,
      equityRequested,
      additionalNotes,
      milestones, 
    } = req.body;

    if (!ideaId || !developerId || !scope || !timeline || !equityRequested) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Insert into proposals table
    const [proposalResult] = await pool.execute(
      `INSERT INTO proposals (idea_id, developer_id, scope, timeline, equity_requested, additional_notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ideaId, developerId, scope, timeline, equityRequested, additionalNotes]
    );

    const proposalId = proposalResult.insertId;

    // 2. Insert milestones
    for (let m of milestones) {
      await pool.execute(
        `INSERT INTO milestones (proposal_id, title, description, duration)
         VALUES (?, ?, ?, ?)`,
        [proposalId, m.title, m.description, m.duration]
      );
    }

    res.status(200).json({ message: "Proposal submitted successfully" });
  } catch (error) {
    console.error("Error submitting proposal:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

// GET /developer-proposals
app.get("/developer-proposals/:developerId", async (req, res) => {
  try {
    const { developerId } = req.params;

    const [proposals] = await pool.execute(
      `SELECT p.id, p.scope, p.timeline, p.equity_requested AS equityProposed, 
              p.additional_notes, p.created_at AS submittedAt,
              ei.title AS ideaTitle, e.name AS founderName, p.status,   COUNT(*) OVER() AS total_proposal_count
       FROM proposals p
       JOIN entrepreneur_idea ei ON p.idea_id = ei.id
       JOIN entrepreneur e ON ei.entrepreneur_id = e.id
       WHERE p.developer_id = ?`,
      [developerId]
    );

    res.status(200).json({ proposals });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

// Fetch proposals for an entrepreneur
app.get("/entrepreneur-proposals/:entrepreneurId", async (req, res) => {
  const { entrepreneurId } = req.params;

  if (!entrepreneurId) {
    return res.status(400).json({ error: "Entrepreneur ID is required" });
  }

  try {
    const [proposals] = await pool.execute(
      `SELECT 
    p.id, 
    p.scope, 
    p.timeline, 
    p.equity_requested AS equityRequested,
    p.additional_notes AS additionalNotes,
    p.status, 
    p.created_at AS submittedAt,
    ei.title AS ideaTitle,
    d.fullName AS developerName,
    d.bio AS skills
FROM proposals p
JOIN entrepreneur_idea ei ON p.idea_id = ei.id
JOIN developers d ON p.developer_id = d.id
WHERE ei.entrepreneur_id = ?
`,
      [entrepreneurId]
    );

    res.json({ proposals, totalProposalCount: proposals.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
});


// Update proposal status
app.post("/proposal/:proposalId/status", async (req, res) => {
  const { proposalId } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  try {
    let status = "Pending";
    if (action === "accept") status = "Approved";
    else if (action === "reject") status = "Rejected";

    await pool.execute("UPDATE proposals SET status = ? WHERE id = ?", [status, proposalId]);

    res.json({ message: `Proposal ${status.toLowerCase()}`, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update proposal status" });
  }
});

app.get('/ideas/:id', async (req, res) => {
  const ideaId = req.params.id;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM entrepreneur_idea WHERE id = ?',
      [ideaId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = rows[0];

    // Parse required_skills safely and flatten nested arrays
    try {
      const parsedSkills = JSON.parse(idea.required_skills || '[]');
      idea.required_skills = Array.isArray(parsedSkills)
        ? parsedSkills.flat(Infinity)
        : [];
    } catch (err) {
      console.error('Error parsing required_skills:', err);
      idea.required_skills = [];
    }

    // Parse attachments safely
    try {
      const parsedAttachments = JSON.parse(idea.attachments || '[]');
      idea.attachments = Array.isArray(parsedAttachments) ? parsedAttachments : [];
    } catch (err) {
      console.error('Error parsing attachments:', err);
      idea.attachments = [];
    }

    // Return idea object
    res.json({ idea });
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




app.put('/ideas/:id/sign-nda', async (req, res) => {
  const ideaId = req.params.id;
  try {
    const [result] = await pool.execute(
      'UPDATE entrepreneur_idea SET nda_accepted = 1 WHERE id = ?',
      [ideaId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json({ success: true, message: 'NDA accepted' });
  } catch (error) {
    console.error('Error updating NDA status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get("/manage-proposals/:ideaId", async (req, res) => {
  const ideaId = req.params.ideaId;

  try {
    const [rows] = await pool.query(
      `SELECT 
          p.id AS proposal_id,
          p.scope,
          p.timeline,
          p.equity_requested,
          p.additional_notes,
          p.status AS proposal_status,
          d.fullName AS developer_name,
          d.email AS developer_email,
          d.bio AS developer_bio,
          e.name AS entrepreneur_name,
          e.email AS entrepreneur_email,
          ei.title as ideaTitle
      FROM proposals p
      JOIN developers d ON p.developer_id = d.id
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      JOIN entrepreneur e ON ei.entrepreneur_id = e.id
      WHERE p.idea_id = ?`,
      [ideaId]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});




app.listen(5000, () => console.log("🚀 Server running on port 5000"));
