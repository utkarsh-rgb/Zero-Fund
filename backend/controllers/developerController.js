const pool = require("../db");

// Get developer profile
const getDeveloperProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const [devResults] = await pool.execute(
      `SELECT id, fullName, email, bio, location FROM developers WHERE id = ?`,
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


  const developerDashboardById=async (req, res) => {
  const { developerId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
          
          e.name,
          ei.*,
          CASE WHEN b.id IS NOT NULL THEN 1 ELSE 0 END AS is_bookmarked
       FROM entrepreneur_idea ei
       JOIN entrepreneur e ON ei.entrepreneur_id = e.id
       LEFT JOIN bookmarks b 
         ON b.idea_id = ei.id AND b.developer_id = ?
       WHERE ei.status = 0`,
      [developerId]
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
};


module.exports = { getDeveloperProfile, updateDeveloperProfile, developerDashboardById };
