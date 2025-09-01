const pool = require("../db");
const multer = require("multer");

const uploadDir = "uploads"; // make sure this exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Async controller function
const postIdeaHandler = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

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
      typeof requiredSkills === "string"
        ? JSON.parse(requiredSkills)
        : requiredSkills;

    const attachmentsArray = req.files.map((file) => ({
      name: file.originalname,
      path: `${uploadDir}/${file.filename}`,
    }));

    const sql = `
      INSERT INTO entrepreneur_idea
      (entrepreneur_id,title, overview, stage, equity_offering, visibility, timeline, budget, additional_requirements, required_skills, attachments)
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
    console.error("Error inserting project:", error.message);
    res.status(500).json({ error: "Something went wrong", message: error.message });
  }
};


  const getIdeaById = async (req, res) => {
  const ideaId = req.params.id;
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM entrepreneur_idea WHERE id = ?",
      [ideaId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Idea not found" });
    }

    const idea = rows[0];

    // Parse required_skills safely and flatten nested arrays
    try {
      const parsedSkills = JSON.parse(idea.required_skills || "[]");
      idea.required_skills = Array.isArray(parsedSkills)
        ? parsedSkills.flat(Infinity)
        : [];
    } catch (err) {
      console.error("Error parsing required_skills:", err);
      idea.required_skills = [];
    }

    // Parse attachments safely
    try {
      const parsedAttachments = JSON.parse(idea.attachments || "[]");
      idea.attachments = Array.isArray(parsedAttachments)
        ? parsedAttachments
        : [];
    } catch (err) {
      console.error("Error parsing attachments:", err);
      idea.attachments = [];
    }

    // Return idea object
    res.json({ idea });
  } catch (error) {
    console.error("Error fetching idea:", error);
    res.status(500).json({ error: "Server error" });
  }
};

 
const signNDA =  async (req, res) => {
  const ideaId = req.params.id;
  try {
    const [result] = await pool.execute(
      "UPDATE entrepreneur_idea SET nda_accepted = 1 WHERE id = ?",
      [ideaId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Idea not found" });
    }
    res.json({ success: true, message: "NDA accepted" });
  } catch (error) {
    console.error("Error updating NDA status:", error);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = { postIdeaHandler, upload, getIdeaById, signNDA };
