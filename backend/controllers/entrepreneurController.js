const pool = require("../db");

const entrepreneurDashboard = async (req, res) => {
  try {
    const { id } = req.params; // entrepreneur_id

    const [rows] = await pool.query(
      "SELECT * FROM entrepreneur_idea WHERE entrepreneur_id = ? ORDER BY created_at DESC",
      [id]
    );

    const ideas = rows.map((row) => {
      // ---------- Required Skills ----------
      let requiredSkills = [];
      try {
        requiredSkills =
          typeof row.required_skills === "string"
            ? JSON.parse(row.required_skills)
            : row.required_skills || [];
      } catch {
        requiredSkills = [];
      }

// ---------- Attachments ----------
let attachments = [];
try {
  attachments =
    typeof row.attachments === "string"
      ? JSON.parse(row.attachments)
      : row.attachments || [];
} catch {
  attachments = [];
}

// Fix broken attachments like "undefined/undefined"
attachments = attachments.map((file) => {
  if (!file.url || file.url.includes("undefined")) {
    return { ...file, url: null };
  }
  return file;
});


      return {
        ...row,
        required_skills: requiredSkills,
        attachments,
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

// Get entrepreneur stats for dashboard
const getEntrepreneurStats = async (req, res) => {
  const { entrepreneurId } = req.params;

  try {
    // Get all ideas for this entrepreneur
    const [ideas] = await pool.execute(
      "SELECT * FROM entrepreneur_idea WHERE entrepreneur_id = ? ORDER BY created_at DESC",
      [entrepreneurId]
    );

    // Get all proposals for entrepreneur's ideas
    const [allProposals] = await pool.execute(
      `SELECT
        p.*,
        ei.title as ideaTitle,
        d.fullName as developerName
      FROM proposals p
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      JOIN developers d ON p.developer_id = d.id
      WHERE ei.entrepreneur_id = ?
      ORDER BY p.created_at DESC`,
      [entrepreneurId]
    );

    // Calculate total views from all ideas
    const totalViews = ideas.reduce((sum, idea) => {
      // Check for both possible column names: views and viewsCount
      const views = idea.views || idea.viewsCount || 0;
      return sum + views;
    }, 0);

    // Calculate idea stats
    const totalIdeas = ideas.length;
    const activeIdeas = ideas.filter(i => i.status === 0).length;
    const closedIdeas = ideas.filter(i => i.status === 1).length;

    // Calculate proposal stats
    const totalProposals = allProposals.length;
    const pendingProposals = allProposals.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
    const acceptedProposals = allProposals.filter(p => p.status === 'Accepted').length;
    const rejectedProposals = allProposals.filter(p => p.status === 'Rejected').length;

    // Calculate total equity offered vs allocated
    const totalEquityOffered = ideas.reduce((sum, idea) => {
      const equity = parseFloat(idea.equity_offering) || 0;
      return sum + equity;
    }, 0);

    const totalEquityAllocated = allProposals
      .filter(p => p.status === 'Accepted')
      .reduce((sum, p) => {
        const equity = parseFloat(p.equity_requested) || 0;
        return sum + equity;
      }, 0);

    // Calculate average proposals per idea
    const avgProposalsPerIdea = totalIdeas > 0
      ? (totalProposals / totalIdeas).toFixed(1)
      : 0;

    // Calculate response/review rate
    const reviewedProposals = allProposals.filter(p =>
      p.status !== 'Pending' && p.status !== 'Under Review'
    ).length;
    const reviewRate = totalProposals > 0
      ? Math.round((reviewedProposals / totalProposals) * 100)
      : 0;

    // Calculate average response time (in days)
    const proposalsWithResponse = allProposals.filter(p =>
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
    const recentProposals = allProposals.filter(p =>
      new Date(p.created_at) >= thirtyDaysAgo
    ).length;

    // Calculate collaboration/hiring rate
    const hiringRate = totalProposals > 0
      ? Math.round((acceptedProposals / totalProposals) * 100)
      : 0;

    // Get most popular idea (by proposals)
    const ideasWithProposalCounts = ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      proposalCount: allProposals.filter(p => p.idea_id === idea.id).length
    }));
    const mostPopularIdea = ideasWithProposalCounts.sort((a, b) => b.proposalCount - a.proposalCount)[0];

    // Get profile completion
    const [entrepreneur] = await pool.execute(
      "SELECT fullName, email, bio, location FROM entrepreneur WHERE id = ?",
      [entrepreneurId]
    );

    let profileCompletion = 40; // base (email + name)
    if (entrepreneur[0]?.bio) profileCompletion += 30;
    if (entrepreneur[0]?.location) profileCompletion += 30;

    // Count ideas by stage
    const ideasByStage = {
      Idea: ideas.filter(i => i.stage === 'Idea').length,
      MVP: ideas.filter(i => i.stage === 'MVP').length,
      Beta: ideas.filter(i => i.stage === 'Beta').length
    };

    // Count ideas by visibility
    const ideasByVisibility = {
      Public: ideas.filter(i => i.visibility === 'Public').length,
      'NDA Required': ideas.filter(i => i.visibility === 'NDA Required').length,
      'Invite Only': ideas.filter(i => i.visibility === 'Invite Only').length
    };

    // Compile stats
    const stats = {
      ideas: {
        total: totalIdeas,
        active: activeIdeas,
        closed: closedIdeas,
        byStage: ideasByStage,
        byVisibility: ideasByVisibility
      },
      proposals: {
        total: totalProposals,
        pending: pendingProposals,
        accepted: acceptedProposals,
        rejected: rejectedProposals,
        recent: recentProposals,
        avgPerIdea: avgProposalsPerIdea
      },
      equity: {
        totalOffered: totalEquityOffered.toFixed(2),
        totalAllocated: totalEquityAllocated.toFixed(2),
        remaining: (totalEquityOffered - totalEquityAllocated).toFixed(2)
      },
      performance: {
        reviewRate: reviewRate,
        hiringRate: hiringRate,
        avgResponseTime: avgResponseTime
      },
      activity: {
        totalViews: totalViews,
        profileCompletion: profileCompletion,
        mostPopularIdea: mostPopularIdea || null
      },
      recentActivity: {
        lastIdea: ideas[0]?.created_at || null,
        lastProposal: allProposals[0]?.created_at || null
      }
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching entrepreneur stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};


module.exports = {
  entrepreneurDashboard,
  entrepreneurDeleteIdea,
  entrepreneurIdea,
  entrepreneurUpdateIdea,
  entrepreneurProfile,
  entrepreneurProfileUpdate,
  getEntrepreneurStats
};
