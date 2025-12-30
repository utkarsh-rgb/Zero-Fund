// ideaController.js
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require("multer");
const pool = require("../db");
require("dotenv").config();
const path = require("path");

// --- Configure multer to store files temporarily before upload ---
const storage = multer.memoryStorage(); // store in memory for SDK v3 upload
//const upload = multer({ storage });


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

// --- Configure S3 v3 client ---
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper to upload file buffer to S3
const uploadToS3 = async (fileBuffer, fileName, mimetype) => {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET,
    //Key: `${Date.now()}-${fileName}`,
    Key: `ideas/${entrepreneur_id}/${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: mimetype,
    // ACL: "public-read",
  };

  const parallelUpload = new Upload({
    client: s3Client,
    params: uploadParams,
  });

  await parallelUpload.done();
  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
};

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

    if (!entrepreneur_id) {
      return res.status(400).json({ error: "Entrepreneur ID is required" });
    }

    const budgetValue = budget === "" ? null : parseFloat(budget);
    const equityValue = equityOffering || null;
    const skillsArray =
      typeof requiredSkills === "string" ? JSON.parse(requiredSkills) : requiredSkills || [];

    // Upload all files to S3
    const attachmentsArray = [];
    for (const file of req.files) {
      const url = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      attachmentsArray.push({
        name: file.originalname,
        url,
        type: file.mimetype,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });
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
