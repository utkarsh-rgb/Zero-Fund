const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads/profile_pics";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `developer_${req.params.id}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Not an image!"), false);
};

const upload = multer({ storage, fileFilter });

// Get developer profile
const getDeveloperProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const [devResults] = await pool.execute(
      `SELECT id, fullName, email, bio, location, profile_pic FROM developers WHERE id = ?`,
      [id]
    );
    if (devResults.length === 0)
      return res.status(404).json({ message: "Developer not found" });

    const developer = devResults[0];

    // Get skills
    const [skills] = await pool.execute(
      `SELECT skill FROM developer_skills WHERE developer_id = ?`,
      [id]
    );
    developer.skills = skills.map((row) => row.skill);

    // Get social links
    const [links] = await pool.execute(
      `SELECT platform, url FROM developer_links WHERE developer_id = ?`,
      [id]
    );
    developer.socialLinks = links.map((row) => ({
      platform: row.platform,
      url: row.url,
    }));

    // Get projects
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
};

// Update developer profile
const updateDeveloperProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, bio, location, skills, socialLinks, projects } = req.body;

    // Update main developer info
    await pool.execute(
      `UPDATE developers SET fullName = ?, email = ?, bio = ?, location = ? WHERE id = ?`,
      [fullName, email, bio, location, id]
    );

    // Update skills
    await pool.execute(`DELETE FROM developer_skills WHERE developer_id = ?`, [id]);
    if (skills?.length) {
      const skillValues = skills.map((skill) => [id, skill]);
      await pool.query(`INSERT INTO developer_skills (developer_id, skill) VALUES ?`, [skillValues]);
    }

    // Update social links
    await pool.execute(`DELETE FROM developer_links WHERE developer_id = ?`, [id]);
    if (socialLinks?.length) {
      const linkValues = socialLinks.map((link) => [id, link.platform, link.url]);
      await pool.query(`INSERT INTO developer_links (developer_id, platform, url) VALUES ?`, [linkValues]);
    }

    // Update projects
    await pool.execute(`DELETE FROM developer_projects WHERE developer_id = ?`, [id]);
    if (projects?.length) {
      const projectValues = projects.map((p) => [id, p.project_name, p.project_url, p.description]);
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
};

// Developer dashboard
const developerDashboardById = async (req, res) => {
  const { developerId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT e.fullName, ei.*, CASE WHEN b.id IS NOT NULL THEN 1 ELSE 0 END AS is_bookmarked
       FROM entrepreneur_idea ei
       JOIN entrepreneur e ON ei.entrepreneur_id = e.id
       LEFT JOIN bookmarks b ON b.idea_id = ei.id AND b.developer_id = ?
       WHERE ei.status = 0`,
      [developerId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while fetching ideas" });
  }
};

// Upload profile picture
const uploadDeveloperProfile = [
  upload.single("profile_pic"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const filePath = req.file.path.replace(/\\/g, "/"); // convert backslashes to forward slashes

      await pool.execute("UPDATE developers SET profile_pic = ? WHERE id = ?", [filePath, req.params.id]);

      res.json({ message: "Profile picture uploaded!", path: filePath });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
];

// Remove profile picture
const removeProfilePic = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT profile_pic FROM developers WHERE id=?", [req.params.id]);
    const filePath = rows[0]?.profile_pic;

    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.execute("UPDATE developers SET profile_pic = NULL WHERE id=?", [req.params.id]);

    res.json({ message: "Profile picture removed!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Remove failed" });
  }
};

module.exports = {
  getDeveloperProfile,
  updateDeveloperProfile,
  developerDashboardById,
  removeProfilePic,
  uploadDeveloperProfile
};
