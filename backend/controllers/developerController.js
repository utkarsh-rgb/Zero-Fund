const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Not an image!"), false);
};

const upload = multer({ storage, fileFilter });

const getDeveloperProfilePic = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT profile_pic, profile_pic_type FROM developers WHERE id = ?",
      [id]
    );

    if (!rows.length || !rows[0].profile_pic) return res.status(404).send("No profile picture");

    const { profile_pic, profile_pic_type } = rows[0];

    res.setHeader("Content-Type", profile_pic_type);
    res.send(profile_pic);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch profile picture");
  }
};


// Get developer profile
const getDeveloperProfile = async (req, res) => {
  const { id } = req.params;
  try {
    // Get main developer info
    const [rows] = await pool.execute(
      "SELECT id, fullName, email, bio, location, profile_pic FROM developers WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Developer not found" });

    const developer = rows[0];

    // Convert BLOB to base64 string if exists
    if (developer.profile_pic)
      developer.profile_pic = `data:image/png;base64,${developer.profile_pic.toString(
        "base64"
      )}`;

    // Fetch skills
    const [skills] = await pool.execute(
      "SELECT skill FROM developer_skills WHERE developer_id = ?",
      [id]
    );
    developer.skills = skills.map((row) => row.skill) || [];

    // Fetch social links
    const [links] = await pool.execute(
      "SELECT platform, url FROM developer_links WHERE developer_id = ?",
      [id]
    );
    developer.socialLinks =
      links.map((row) => ({ platform: row.platform, url: row.url })) || [];

    // Fetch projects
    const [projects] = await pool.execute(
      "SELECT project_name, project_url, description FROM developer_projects WHERE developer_id = ?",
      [id]
    );
    developer.projects = projects || [];

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
  multer({ storage: multer.memoryStorage() }).single("profile_pic"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const fileBuffer = req.file.buffer; // raw binary
      const fileType = req.file.mimetype; // store MIME type

      await pool.execute(
        "UPDATE developers SET profile_pic = ?, profile_pic_type = ? WHERE id = ?",
        [fileBuffer, fileType, req.params.id]
      );

      res.json({ message: "Profile picture uploaded!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  },
];

// Remove profile picture
const removeProfilePic = async (req, res) => {
  try {
    await pool.execute("UPDATE developers SET profile_pic = NULL WHERE id=?", [req.params.id]);
    res.json({ message: "Profile picture removed!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Remove failed" });
  }
};

// Get developer stats for dashboard
const getDeveloperStats = async (req, res) => {
  const { developerId } = req.params;

  try {
    // Get all proposals for this developer
    const [proposals] = await pool.execute(
      `SELECT
        p.*,
        ei.title as ideaTitle,
        e.fullName as founderName
      FROM proposals p
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      JOIN entrepreneur e ON ei.entrepreneur_id = e.id
      WHERE p.developer_id = ?
      ORDER BY p.created_at DESC`,
      [developerId]
    );

    // Get active collaborations (accepted proposals)
    const [collaborations] = await pool.execute(
      `SELECT
        p.*,
        ei.title as projectTitle,
        e.fullName as founderName
      FROM proposals p
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      JOIN entrepreneur e ON ei.entrepreneur_id = e.id
      WHERE p.developer_id = ? AND p.status = 'Accepted'`,
      [developerId]
    );

    // Get bookmarks count
    const [bookmarks] = await pool.execute(
      "SELECT COUNT(*) as count FROM bookmarks WHERE developer_id = ?",
      [developerId]
    );

    // Get total ideas viewed (you can track this with a views table if needed)
    const [ideasViewedResult] = await pool.execute(
      "SELECT COUNT(DISTINCT idea_id) as count FROM idea_views WHERE developer_id = ?",
      [developerId]
    );

    // Calculate stats
    const totalProposals = proposals.length;
    const acceptedProposals = proposals.filter(p => p.status === 'Accepted').length;
    const pendingProposals = proposals.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
    const rejectedProposals = proposals.filter(p => p.status === 'Rejected').length;

    // Calculate total equity from accepted proposals
    const totalEquity = proposals
      .filter(p => p.status === 'Accepted')
      .reduce((sum, p) => {
        const equity = parseFloat(p.equity_requested) || 0;
        return sum + equity;
      }, 0);

    // Calculate success rate
    const successRate = totalProposals > 0
      ? Math.round((acceptedProposals / totalProposals) * 100)
      : 0;

    // Calculate average response time (in days)
    const proposalsWithResponse = proposals.filter(p =>
      p.status !== 'Pending' && p.status !== 'Under Review' && p.updated_at
    );

    let avgResponseTime = 0;
    if (proposalsWithResponse.length > 0) {
      const totalResponseTime = proposalsWithResponse.reduce((sum, p) => {
        const submitted = new Date(p.created_at);
        const responded = new Date(p.updated_at);
        const diffTime = Math.abs(responded - submitted);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      avgResponseTime = Math.round(totalResponseTime / proposalsWithResponse.length);
    }

    // Get recent proposals (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentProposals = proposals.filter(p =>
      new Date(p.created_at) >= thirtyDaysAgo
    ).length;

    // Calculate estimated portfolio value (equity * estimated average startup value)
    // Using a conservative estimate of $100k per accepted project
    const estimatedPortfolioValue = acceptedProposals * 100000 * (totalEquity / 100);

    // Get developer profile completion
    const [developer] = await pool.execute(
      "SELECT fullName, email, bio, location, profile_pic FROM developers WHERE id = ?",
      [developerId]
    );

    let profileCompletion = 40; // base (email + name)
    if (developer[0]?.bio) profileCompletion += 20;
    if (developer[0]?.location) profileCompletion += 20;
    if (developer[0]?.profile_pic) profileCompletion += 20;

    // Compile stats
    const stats = {
      proposals: {
        total: totalProposals,
        accepted: acceptedProposals,
        pending: pendingProposals,
        rejected: rejectedProposals,
        recent: recentProposals
      },
      collaborations: {
        active: collaborations.length,
        total: acceptedProposals
      },
      equity: {
        totalEarned: totalEquity.toFixed(2),
        avgPerProject: acceptedProposals > 0 ? (totalEquity / acceptedProposals).toFixed(2) : 0
      },
      performance: {
        successRate: successRate,
        avgResponseTime: avgResponseTime,
        estimatedPortfolioValue: Math.round(estimatedPortfolioValue)
      },
      activity: {
        bookmarksCount: bookmarks[0].count || 0,
        ideasViewed: ideasViewedResult[0]?.count || 0,
        profileCompletion: profileCompletion
      },
      recentActivity: {
        lastProposal: proposals[0]?.created_at || null,
        lastAcceptance: proposals.find(p => p.status === 'Accepted')?.updated_at || null
      }
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching developer stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};


module.exports = {
  getDeveloperProfile,
  updateDeveloperProfile,
  developerDashboardById,
  removeProfilePic,
  uploadDeveloperProfile,
  getDeveloperStats
};
