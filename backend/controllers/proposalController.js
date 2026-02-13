const pool = require("../db");
const {
  createEntrepreneurNotification,
} = require("./entrepreneurNotificationsController");

// Get single proposal by ID
const getProposalById = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query(
      "SELECT e.fullName AS founderName, ei.* FROM entrepreneur_idea ei JOIN entrepreneur e ON ei.entrepreneur_id = e.id WHERE ei.id = ?",
      [id],
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
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      ideaId,
      developerId,
      scope,
      timeline,
      equityRequested,
      additionalNotes,
      milestones,
    } = req.body;

    // Validation
    if (!ideaId || !developerId || !scope || !timeline || !equityRequested) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate equity percentage
    const equity = parseFloat(equityRequested);
    if (isNaN(equity) || equity <= 0 || equity > 100) {
      return res
        .status(400)
        .json({
          error: "Invalid equity percentage (must be between 0 and 100)",
        });
    }

    // Check if idea exists and is active
    const [ideaRows] = await connection.execute(
      `SELECT ei.id, ei.title, ei.entrepreneur_id, e.fullName as entrepreneur_name
       FROM entrepreneur_idea ei
       JOIN entrepreneur e ON ei.entrepreneur_id = e.id
       WHERE ei.id = ?`,
      [ideaId],
    );

    if (ideaRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Idea not found" });
    }

    const idea = ideaRows[0];

    // Check if developer already submitted a proposal for this idea
    const [existingProposals] = await connection.execute(
      `SELECT id FROM proposals
       WHERE idea_id = ? AND developer_id = ? AND withdrawn = FALSE`,
      [ideaId, developerId],
    );

    if (existingProposals.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        error: "You have already submitted a proposal for this idea",
      });
    }

    // Get developer info
    const [developerRows] = await connection.execute(
      `SELECT fullName FROM developers WHERE id = ?`,
      [developerId],
    );

    if (developerRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Developer not found" });
    }

    const developerName = developerRows[0].fullName;

    // Insert proposal (with default contract status)
    const [proposalResult] = await connection.execute(
      `INSERT INTO proposals 
   (idea_id, developer_id, scope, timeline, equity_requested, additional_notes, contract_status)
   VALUES (?, ?, ?, ?, ?, ?, 'not_generated')`,
      [ideaId, developerId, scope, timeline, equityRequested, additionalNotes],
    );

    const proposalId = proposalResult.insertId;

    // Insert milestones
    if (milestones && Array.isArray(milestones) && milestones.length > 0) {
      for (let m of milestones) {
        if (m.title && m.description) {
          await connection.execute(
            `INSERT INTO milestones (proposal_id, title, description, duration)
             VALUES (?, ?, ?, ?)`,
            [proposalId, m.title, m.description, m.duration || ""],
          );
        }
      }
    }

    // Update proposal count for the idea
    await connection.execute(
      `UPDATE entrepreneur_idea
       SET proposal_count = proposal_count + 1
       WHERE id = ?`,
      [ideaId],
    );

    // Create notification for entrepreneur
    const notificationMessage = `${developerName} submitted a proposal for your idea "${idea.title}". Review it now!`;
    await connection.execute(
      `INSERT INTO entrepreneur_notifications
       (entrepreneur_id, proposal_id, message, type)
       VALUES (?, ?, ?, 'proposal_received')`,
      [idea.entrepreneur_id, proposalId, notificationMessage],
    );

    // Log activity
    await connection.execute(
      `INSERT INTO activity_log
       (user_id, user_type, action_type, entity_type, entity_id, description)
       VALUES (?, 'developer', 'proposal_submitted', 'proposal', ?, ?)`,
      [developerId, proposalId, `Submitted proposal for idea: ${idea.title}`],
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Proposal submitted successfully",
      proposalId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error submitting proposal:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  } finally {
    connection.release();
  }
};

// Get proposals submitted by a developer
const getDeveloperProposals = async (req, res) => {
  try {
    const { developerId } = req.params;

    const [proposals] = await pool.execute(
      `SELECT p.id, p.scope, p.timeline, p.equity_requested AS equityProposed,
              p.additional_notes, p.created_at AS submittedAt,
              p.updated_at AS updatedAt, p.status, p.withdrawn,
              ei.title AS ideaTitle, ei.id AS ideaId,
              e.fullName AS founderName, e.id AS entrepreneurId,
              COUNT(*) OVER() AS total_proposal_count
       FROM proposals p
       JOIN entrepreneur_idea ei ON p.idea_id = ei.id
       JOIN entrepreneur e ON ei.entrepreneur_id = e.id
       WHERE p.developer_id = ?
       ORDER BY p.created_at DESC`,
      [developerId],
    );

    res.status(200).json({
      success: true,
      proposals,
      total: proposals.length,
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// Withdraw a proposal (developer can withdraw before entrepreneur accepts)
const withdrawProposal = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { proposalId, developerId } = req.body;

    if (!proposalId || !developerId) {
      return res
        .status(400)
        .json({ error: "Proposal ID and Developer ID are required" });
    }

    // Check if proposal exists and belongs to developer
    const [proposalRows] = await connection.execute(
      `SELECT p.id, p.status, p.withdrawn, p.idea_id,
              ei.title AS idea_title, ei.entrepreneur_id
       FROM proposals p
       JOIN entrepreneur_idea ei ON p.idea_id = ei.id
       WHERE p.id = ? AND p.developer_id = ?`,
      [proposalId, developerId],
    );

    if (proposalRows.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ error: "Proposal not found or you don't have permission" });
    }

    const proposal = proposalRows[0];

    // Check if already withdrawn
    if (proposal.withdrawn) {
      await connection.rollback();
      return res
        .status(400)
        .json({ error: "Proposal has already been withdrawn" });
    }

    // Cannot withdraw if already approved
    if (proposal.status === "Approved") {
      await connection.rollback();
      return res.status(400).json({
        error:
          "Cannot withdraw an approved proposal. Please contact the entrepreneur.",
      });
    }

    // Withdraw the proposal
    await connection.execute(
      `UPDATE proposals
       SET withdrawn = TRUE, withdrawn_at = NOW(), status = 'Withdrawn'
       WHERE id = ?`,
      [proposalId],
    );

    // Update proposal count for the idea
    await connection.execute(
      `UPDATE entrepreneur_idea
       SET proposal_count = GREATEST(proposal_count - 1, 0)
       WHERE id = ?`,
      [proposal.idea_id],
    );

    // Notify entrepreneur
    const [developerRows] = await connection.execute(
      `SELECT fullName FROM developers WHERE id = ?`,
      [developerId],
    );
    const developerName = developerRows[0]?.fullName || "A developer";

    await connection.execute(
      `INSERT INTO entrepreneur_notifications
       (entrepreneur_id, proposal_id, message, type)
       VALUES (?, ?, ?, 'general')`,
      [
        proposal.entrepreneur_id,
        proposalId,
        `${developerName} has withdrawn their proposal for "${proposal.idea_title}".`,
      ],
    );

    // Log activity
    await connection.execute(
      `INSERT INTO activity_log
       (user_id, user_type, action_type, entity_type, entity_id, description)
       VALUES (?, 'developer', 'proposal_withdrawn', 'proposal', ?, ?)`,
      [
        developerId,
        proposalId,
        `Withdrew proposal for idea: ${proposal.idea_title}`,
      ],
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Proposal withdrawn successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error withdrawing proposal:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  } finally {
    connection.release();
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
        p.contract_status,   
        p.withdrawn,
        p.created_at AS submittedAt,
        p.updated_at AS updatedAt,
        ei.title AS ideaTitle,
        ei.id AS ideaId,
        d.fullName AS developerName,
        d.id AS developerId,
        d.bio AS skills,
        d.email AS developerEmail
      FROM proposals p
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      JOIN developers d ON p.developer_id = d.id
      WHERE ei.entrepreneur_id = ? AND p.withdrawn = FALSE
      ORDER BY p.created_at DESC`,
      [entrepreneurId],
    );

    // Get count by status
    const [statusCounts] = await pool.execute(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN p.status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN p.status = 'Approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN p.status = 'Rejected' THEN 1 ELSE 0 END) as rejected
      FROM proposals p
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      WHERE ei.entrepreneur_id = ? AND p.withdrawn = FALSE`,
      [entrepreneurId],
    );

    res.json({
      success: true,
      proposals,
      totalProposalCount: proposals.length,
      statusCounts: statusCounts[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
};

// Update proposal status
const updateProposalStatus = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { proposalId } = req.params;
    const { action, entrepreneurId } = req.body; // 'accept' or 'reject'

    if (!action || !["accept", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ error: "Invalid action. Use 'accept' or 'reject'" });
    }

    let status = action === "accept" ? "Approved" : "Rejected";

    // Check if proposal exists and is not withdrawn
    const [proposalCheck] = await connection.execute(
      `SELECT p.id, p.status, p.withdrawn, p.developer_id, p.idea_id
       FROM proposals p
       WHERE p.id = ?`,
      [proposalId],
    );

    if (proposalCheck.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Proposal not found" });
    }

    const currentProposal = proposalCheck[0];

    if (currentProposal.withdrawn) {
      await connection.rollback();
      return res
        .status(400)
        .json({ error: "Cannot update a withdrawn proposal" });
    }

    if (currentProposal.status !== "Pending") {
      await connection.rollback();
      return res.status(400).json({
        error: `Proposal has already been ${currentProposal.status.toLowerCase()}`,
      });
    }

    // Update proposal status
    await connection.execute(`UPDATE proposals SET status = ? WHERE id = ?`, [
      status,
      proposalId,
    ]);

    // Fetch proposal info for notification
    const [rows] = await connection.execute(
      `SELECT
         p.developer_id,
         d.fullName AS developer_name,
         d.email AS developer_email,
         i.title AS idea_title,
         i.entrepreneur_id,
         e.fullName AS entrepreneur_name
       FROM proposals p
       JOIN developers d ON p.developer_id = d.id
       JOIN entrepreneur_idea i ON p.idea_id = i.id
       JOIN entrepreneur e ON i.entrepreneur_id = e.id
       WHERE p.id = ?`,
      [proposalId],
    );

    const proposal = rows[0];
    const firstName = proposal.developer_name.split(" ")[0];
    const now = new Date();
    const formattedDate = now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create notification for developer
    let message;
    let notificationType;

    if (status === "Approved") {
      message = `🎉 Congratulations ${firstName}! Your proposal for "${proposal.idea_title}" has been approved by ${proposal.entrepreneur_name}. Next step: Review and sign the contract.`;
      notificationType = "proposal_status";
    } else {
      message = `Hi ${firstName}, your proposal for "${proposal.idea_title}" was not accepted this time. Keep improving and try again!`;
      notificationType = "proposal_status";
    }

    await connection.execute(
      `INSERT INTO notifications (developer_id, proposal_id, message, type)
       VALUES (?, ?, ?, ?)`,
      [proposal.developer_id, proposalId, message, notificationType],
    );

    // Log activity
    await connection.execute(
      `INSERT INTO activity_log
       (user_id, user_type, action_type, entity_type, entity_id, description)
       VALUES (?, 'entrepreneur', 'proposal_${action}ed', 'proposal', ?, ?)`,
      [
        proposal.entrepreneur_id,
        proposalId,
        `${status} proposal from ${proposal.developer_name} for idea: ${proposal.idea_title}`,
      ],
    );

    await connection.commit();

    res.json({
      success: true,
      message: `Proposal ${status.toLowerCase()} successfully`,
      status,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error updating proposal status:", err);
    res.status(500).json({ error: "Failed to update proposal status" });
  } finally {
    connection.release();
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
          e.fullName AS entrepreneur_name,
          e.email AS entrepreneur_email,
          ei.title as ideaTitle
      FROM proposals p
      JOIN developers d ON p.developer_id = d.id
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      JOIN entrepreneur e ON ei.entrepreneur_id = e.id
      WHERE p.idea_id = ?`,
      [ideaId],
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

// Get unique developer IDs from proposals
// Get unique developers (ID + fullname) from proposals
const getUniqueDeveloperIds = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT d.id AS developer_id, d.fullname
      FROM developers d
      JOIN proposals p ON d.id = p.developer_id
    `);

    res.json({ developers: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch developers" });
  }
};

module.exports = {
  getProposalById,
  submitProposal,
  getDeveloperProposals,
  getEntrepreneurProposals,
  updateProposalStatus,
  manageProposal,
  getUniqueDeveloperIds,
  withdrawProposal,
};
