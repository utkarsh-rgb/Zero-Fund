const pool = require("../db");

exports.submitProposal = async (req, res) => {
  try {
    const { ideaId, developerId, scope, timeline, equityRequested, additionalNotes, milestones } = req.body;
    if (!ideaId || !developerId || !scope || !timeline || !equityRequested)
      return res.status(400).json({ error: "Missing required fields" });

    const [proposalResult] = await pool.execute(
      `INSERT INTO proposals (idea_id, developer_id, scope, timeline, equity_requested, additional_notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ideaId, developerId, scope, timeline, equityRequested, additionalNotes]
    );

    const proposalId = proposalResult.insertId;

    for (let m of milestones) {
      await pool.execute(
        `INSERT INTO milestones (proposal_id, title, description, duration)
         VALUES (?, ?, ?, ?)`,
        [proposalId, m.title, m.description, m.duration]
      );
    }

    res.status(200).json({ message: "Proposal submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

exports.getDeveloperProposals = async (req, res) => {
  const { developerId } = req.params;
  try {
    const [proposals] = await pool.execute(
      `SELECT p.id, p.scope, p.timeline, p.equity_requested AS equityProposed, 
              p.additional_notes, p.created_at AS submittedAt,
              ei.title AS ideaTitle, e.name AS founderName, p.status, COUNT(*) OVER() AS total_proposal_count
       FROM proposals p
       JOIN entrepreneur_idea ei ON p.idea_id = ei.id
       JOIN entrepreneur e ON ei.entrepreneur_id = e.id
       WHERE p.developer_id = ?`,
      [developerId]
    );
    res.json({ proposals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

exports.getEntrepreneurProposals = async (req, res) => {
  const { entrepreneurId } = req.params;
  if (!entrepreneurId) return res.status(400).json({ error: "Entrepreneur ID is required" });

  try {
    const [proposals] = await pool.execute(
      `SELECT 
        p.id, p.scope, p.timeline, p.equity_requested AS equityRequested,
        p.additional_notes AS additionalNotes, p.status, p.created_at AS submittedAt,
        ei.title AS ideaTitle, d.fullName AS developerName, d.bio AS skills
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

exports.updateProposalStatus = async (req, res) => {
  const { proposalId } = req.params;
  const { action } = req.body;

  try {
    let status = "Pending";
    if (action === "accept") status = "Approved";
    else if (action === "reject") status = "Rejected";

    await pool.execute("UPDATE proposals SET status = ? WHERE id = ?", [status, proposalId]);
    res.json({ message: `Proposal ${status.toLowerCase()}`, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update proposal status" });
  }
};

exports.manageProposalsForIdea = async (req, res) => {
  const { ideaId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
        p.id AS proposal_id, p.scope, p.timeline, p.equity_requested, p.additional_notes,
        p.status AS proposal_status, d.fullName AS developer_name, d.email AS developer_email,
        d.bio AS developer_bio, e.name AS entrepreneur_name, e.email AS entrepreneur_email,
        ei.title as ideaTitle
       FROM proposals p
       JOIN developers d ON p.developer_id = d.id
       JOIN entrepreneur_idea ei ON p.idea_id = ei.id
       JOIN entrepreneur e ON ei.entrepreneur_id = e.id
       WHERE p.idea_id = ?`,
      [ideaId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
