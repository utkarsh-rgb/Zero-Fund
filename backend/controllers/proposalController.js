const pool = require("../db");

// Get single proposal by ID
const getProposalById = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query(
      "SELECT e.name AS founderName, ei.* FROM entrepreneur_idea ei JOIN entrepreneur e ON ei.entrepreneur_id = e.id WHERE ei.id = ?",
      [id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    res.json(results[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Submit proposal
const submitProposal = async (req, res) => {
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

    const [proposalResult] = await pool.execute(
      `INSERT INTO proposals (idea_id, developer_id, scope, timeline, equity_requested, additional_notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ideaId, developerId, scope, timeline, equityRequested, additionalNotes]
    );

    const proposalId = proposalResult.insertId;

    // Insert milestones
    if (milestones && Array.isArray(milestones)) {
      for (let m of milestones) {
        await pool.execute(
          `INSERT INTO milestones (proposal_id, title, description, duration)
           VALUES (?, ?, ?, ?)`,
          [proposalId, m.title, m.description, m.duration]
        );
      }
    }

    res.status(200).json({ message: "Proposal submitted successfully" });
  } catch (error) {
    console.error("Error submitting proposal:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// Get proposals submitted by a developer
const getDeveloperProposals = async (req, res) => {
  try {
    const { developerId } = req.params;

    const [proposals] = await pool.execute(
      `SELECT p.id, p.scope, p.timeline, p.equity_requested AS equityProposed, 
              p.additional_notes, p.created_at AS submittedAt,
              ei.title AS ideaTitle, e.fullName AS founderName, p.status,   
              COUNT(*) OVER() AS total_proposal_count
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
};

// Get proposals submitted to an entrepreneur
const getEntrepreneurProposals = async (req, res) => {
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
      WHERE ei.entrepreneur_id = ?`,
      [entrepreneurId]
    );

    res.json({ proposals, totalProposalCount: proposals.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
};

// Update proposal status
const updateProposalStatus = async (req, res) => {
  const { proposalId } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  try {
    let status = "Pending";
    if (action === "accept") status = "Approved";
    else if (action === "reject") status = "Rejected";

    // 1️⃣ Update proposal status in DB
    await pool.execute("UPDATE proposals SET status = ? WHERE id = ?", [
      status,
      proposalId,
    ]);

    // 2️⃣ Fetch proposal info for notification
    const [rows] = await pool.execute(
      `SELECT 
         p.developer_id,
         d.fullName AS developer_name,
         i.title AS idea_title,
         i.created_at AS idea_created_at
       FROM proposals p
       JOIN developers d ON p.developer_id = d.id
       JOIN entrepreneur_idea i ON p.idea_id = i.id
       WHERE p.id = ?`,
      [proposalId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    const proposal = rows[0];

    const formattedDate = new Date(proposal.idea_created_at).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const firstName = proposal.developer_name.split(" ")[0];

const message = `Hi ${firstName}! Good news — your proposal for "${proposal.idea_title}" has been ${status.toLowerCase()} as of ${formattedDate}. Check your dashboard for details.`;

    await pool.execute(
      `INSERT INTO notifications (developer_id, proposal_id, message) VALUES (?, ?, ?)`,
      [proposal.developer_id, proposalId, message]
    );

   
    res.json({ message: `Proposal ${status.toLowerCase()}`, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update proposal status" });
  }
};

 const manageProposal = async (req, res) => {
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
};



module.exports = {
  getProposalById,
  submitProposal,
  getDeveloperProposals,
  getEntrepreneurProposals,
  updateProposalStatus,
  manageProposal,
};
