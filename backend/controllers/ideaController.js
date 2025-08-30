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

module.exports = { postIdeaHandler, upload };
