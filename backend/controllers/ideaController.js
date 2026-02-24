// ideaController.js
const multer = require("multer");
const pool = require("../db");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const BASE_UPLOAD_PATH = "/var/www/storage/pdfs";

console.log("📁 Base Upload Path:", BASE_UPLOAD_PATH);

if (!fs.existsSync(BASE_UPLOAD_PATH)) {
  console.log("📁 Base folder does not exist. Creating...");
  fs.mkdirSync(BASE_UPLOAD_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  console.log("📦 Incoming File:", file.originalname);

  const entrepreneurId =
    req.params.id || req.body.entrepreneur_id || "unknown";

  console.log("📦 entrepreneurId used for folder:", entrepreneurId);

//  const userFolder = path.join(BASE_UPLOAD_PATH, String(entrepreneurId));
const userFolder = `/var/www/storage/pdfs/${entrepreneurId}`;
  console.log("📂 Target Folder:", userFolder);

  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }

  cb(null, userFolder);
},

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log("📝 Final File Name:", uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    console.log("🔎 Checking file type:", file.mimetype);

    if (!allowedTypes.includes(file.mimetype)) {
      console.log("❌ Invalid file type rejected");
      return cb(new Error("Only PDF, TXT and image files are allowed"));
    }

    console.log("✅ File type accepted");
    cb(null, true);
  },
});

// --- POST /idea ---
const postIdeaHandler = async (req, res) => {
  try {
    const {
      title,
      overview,
      stage,
      equityOffering,
      visibility,
      timeline,
      budget,
      additionalRequirements,
      requiredSkills,
      entrepreneur_id,
    } = req.body;
     console.log(entrepreneur_id,"entrepreneur id is consoling");
    if (!entrepreneur_id) {
      return res.status(400).json({ error: "Entrepreneur ID is required" });
    }

    const budgetValue = budget === "" ? null : parseFloat(budget);
    const equityValue = equityOffering || null;
    const skillsArray =
      typeof requiredSkills === "string" ? JSON.parse(requiredSkills) : requiredSkills || [];

    // Save files locally
    const attachmentsArray = [];

if (req.files && req.files.length > 0) {
  console.log("📎 Files received:", req.files.length);

  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
  console.log("🌍 Base URL:", baseUrl);

  for (const file of req.files) {
    console.log("📄 Processing file:", file.filename);
    console.log("📄 Full Path Saved:", file.path);

    const relativePath = `/upload_idea_document/${entrepreneur_id}/${file.filename}`;
    const url = `${baseUrl}${relativePath}`;

    console.log("🔗 Generated URL:", url);

    attachmentsArray.push({
      name: file.originalname,
      url,
      type: file.mimetype,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    });
  }
} else {
  console.log("⚠️ No files received");
}
    const sql = `
      INSERT INTO entrepreneur_idea
      (entrepreneur_id, title, overview, stage, equity_offering, visibility, timeline, budget, additional_requirements, required_skills, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      entrepreneur_id,
      title,
      overview,
      stage,
      equityValue,
      visibility,
      timeline,
      budgetValue,
      additionalRequirements,
      JSON.stringify(skillsArray),
      JSON.stringify(attachmentsArray),
    ];

    const [result] = await pool.execute(sql, values);

    res.status(200).json({
      message: "Project saved successfully",
      projectId: result.insertId,
      attachments: attachmentsArray,
      requiredSkills: skillsArray,
    });
  } catch (error) {
    console.error("Error inserting project:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// --- GET /idea/:id ---
// Optimized with JOIN to fetch entrepreneur details in single query
const getIdeaById = async (req, res) => {
  const ideaId = req.params.id;

  try {
    // Use JOIN to fetch idea with entrepreneur details in one query
    const [rows] = await pool.execute(
      `SELECT
        ei.*,
        e.fullName as founderName,
        e.bio as founderBio,
        e.location as founderLocation,
        e.email as founderEmail
      FROM entrepreneur_idea ei
      JOIN entrepreneur e ON ei.entrepreneur_id = e.id
      WHERE ei.id = ?`,
      [ideaId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Idea not found" });
    }

    const idea = rows[0];

    // --- Parse required_skills safely ---
    idea.required_skills = Array.isArray(idea.required_skills)
      ? idea.required_skills.flat(Infinity) // already an array, just flatten
      : (() => {
          try {
            return JSON.parse(idea.required_skills || "[]").flat(Infinity);
          } catch {
            return [];
          }
        })();

    // --- Parse attachments safely ---
    idea.attachments = Array.isArray(idea.attachments)
      ? idea.attachments
      : (() => {
          try {
            return JSON.parse(idea.attachments || "[]");
          } catch {
            return [];
          }
        })();

    // Map database field names to frontend expected names
    idea.fullDescription = idea.overview;
    idea.equityRange = idea.equity_offering;

    // Add default values for optional fields
    idea.founderAvatar = idea.founderName ? idea.founderName.charAt(0).toUpperCase() : "?";
    idea.founderLinkedIn = idea.founderLinkedIn || "#";

    res.json({ idea });
  } catch (error) {
    console.error("Error fetching idea:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// --- PUT /idea/:id/nda ---
const signNDA = async (req, res) => {
  const ideaId = req.params.id;
  try {
    const [result] = await pool.execute(
      "UPDATE entrepreneur_idea SET nda_accepted = 1 WHERE id = ?",
      [ideaId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Idea not found" });

    res.json({ success: true, message: "NDA accepted" });
  } catch (error) {
    console.error("Error updating NDA status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { postIdeaHandler, upload, getIdeaById, signNDA };
