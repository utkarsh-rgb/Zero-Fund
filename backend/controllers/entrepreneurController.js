const pool = require("../db");

const entrepreneurDashboard = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM entrepreneur_idea ORDER BY created_at DESC"
    );

    // convert JSON fields back to JS objects
    const ideas = rows.map((row) => {
      let requiredSkills = [];
      let attachments = [];

      try {
        requiredSkills = row.required_skills
          ? JSON.parse(row.required_skills)
          : [];
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
};

// DELETE /api/ideas/:id
const entrepreneurDeleteIdea = async (req, res) => {
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
};

const entrepreneurIdea = async (req, res) => {
  const { id } = req.params;
  const parseJSONSafe = (data) => {
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      // If parsing fails, wrap single string in array
      return [data];
    }
  };

  try {
    const [rows] = await pool.query(
      "SELECT * FROM entrepreneur_idea WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Idea not found" });

    const idea = rows[0];
    idea.required_skills = parseJSONSafe(idea.required_skills);
    idea.attachments = parseJSONSafe(idea.attachments);

    res.json(idea);
  } catch (err) {
    console.error("Error fetching idea:", err);
    res.status(500).json({ error: "Database error" });
  }
};
const entrepreneurUpdateIdea =  async (req, res) => {
  const { id } = req.params;
  const {
    title,
    overview,
    stage,
    equity_offering,
    visibility,
    timeline,
    budget,
    additional_requirements,
    required_skills,
    attachments,
  } = req.body;

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
        id,
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
};

// GET entrepreneur profile by ID
// GET entrepreneur profile by ID
const entrepreneurProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch entrepreneur by ID
    const [rows] = await pool.query(
      "SELECT fullName,email,location,bio FROM entrepreneur WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    const entrepreneur = rows[0];

    // Optional: log what was fetched
    console.log("Entrepreneur fetched:", entrepreneur);

    res.status(200).json(entrepreneur);
  } catch (err) {
    console.error("Error fetching entrepreneur:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const entrepreneurProfileUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, location, bio } = req.body;

    console.log("Request body:", req.body);
    console.log("Entrepreneur ID:", id);

    // Update query
    const [rows] = await pool.query(
      `UPDATE entrepreneur
       SET fullName = ?, email = ?, location = ?, bio = ?
       WHERE id = ?`,
      [fullName, email, location, bio, id]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  entrepreneurDashboard,
  entrepreneurDeleteIdea,
  entrepreneurIdea,
  entrepreneurUpdateIdea,
  entrepreneurProfile,
  entrepreneurProfileUpdate
};
