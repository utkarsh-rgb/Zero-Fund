// ================================================
// CONTRACT CONTROLLER - IMPROVED WORKFLOW
// ================================================
// Handles contract signing, acceptance, and rejection

const pool = require("../db");
const { createEntrepreneurNotification } = require("./entrepreneurNotificationsController");

/**
 * Developer signs a contract
 * POST /contracts/developer-sign
 */
const developerSignContract = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { contractId, developerId } = req.body;

    // Validation
    if (!contractId || !developerId) {
      return res.status(400).json({
        success: false,
        message: "contractId and developerId are required"
      });
    }

    // Check if contract exists and belongs to this developer
    const [contractRows] = await connection.execute(
      `SELECT c.id, c.developer_id, c.entrepreneur_id, c.signed_by_developer,
              c.signed_by_entrepreneur, c.status, c.project_title,
              e.fullName AS entrepreneur_name
       FROM contracts c
       JOIN entrepreneur e ON c.entrepreneur_id = e.id
       WHERE c.id = ? AND c.developer_id = ?`,
      [contractId, developerId]
    );

    if (contractRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Contract not found or you don't have permission"
      });
    }

    const contract = contractRows[0];

    // Check if already signed by developer
    if (contract.signed_by_developer) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "You have already signed this contract"
      });
    }

    // Get developer name for notification
    const [developerRows] = await connection.execute(
      `SELECT fullName FROM developers WHERE id = ?`,
      [developerId]
    );
    const developerName = developerRows[0]?.fullName || "Developer";

    // Update contract - developer signs (contract becomes fully signed since entrepreneur signed when creating)
    await connection.execute(
      `UPDATE contracts
       SET signed_by_developer = 1,
           signed_by_developer_at = NOW(),
           status = 'signed'
       WHERE id = ?`,
      [contractId]
    );

    // Create notification for entrepreneur
    await connection.execute(
      `INSERT INTO entrepreneur_notifications
       (entrepreneur_id, contract_id, message, type)
       VALUES (?, ?, ?, 'contract_signed')`,
      [
        contract.entrepreneur_id,
        contractId,
        `🎉 Contract Fully Signed! ${developerName} has signed the contract for "${contract.project_title}". Your collaboration is now active!`
      ]
    );

    // Create confirmation notification for developer
    await connection.execute(
      `INSERT INTO notifications (developer_id, proposal_id, message, type)
       VALUES (?, (SELECT proposal_id FROM contracts WHERE id = ?), ?, 'contract_status')`,
      [
        developerId,
        contractId,
        `✅ Success! You have signed the contract for "${contract.project_title}". Collaboration with ${contract.entrepreneur_name} is now active. Check the Collaborations tab to get started!`
      ]
    );

    // Log activity
    await connection.execute(
      `INSERT INTO activity_log
       (user_id, user_type, action_type, entity_type, entity_id, description)
       VALUES (?, 'developer', 'contract_signed', 'contract', ?, ?)`,
      [developerId, contractId, `Signed contract for project: ${contract.project_title}`]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Contract signed successfully! Your collaboration is now active."
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error signing contract:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    connection.release();
  }
};

/**
 * Entrepreneur accepts a contract signed by developer
 * POST /contracts/entrepreneur-accept
 */
const entrepreneurAcceptContract = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { contractId, entrepreneurId } = req.body;

    if (!contractId || !entrepreneurId) {
      return res.status(400).json({
        success: false,
        message: "contractId and entrepreneurId are required"
      });
    }

    // Check if contract exists and belongs to this entrepreneur
    const [contractRows] = await connection.execute(
      `SELECT c.id, c.developer_id, c.entrepreneur_id, c.signed_by_developer,
              c.signed_by_entrepreneur, c.status, c.project_title,
              d.fullName AS developer_name, e.fullName AS entrepreneur_name
       FROM contracts c
       JOIN developers d ON c.developer_id = d.id
       JOIN entrepreneur e ON c.entrepreneur_id = e.id
       WHERE c.id = ? AND c.entrepreneur_id = ?`,
      [contractId, entrepreneurId]
    );

    if (contractRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Contract not found or you don't have permission"
      });
    }

    const contract = contractRows[0];

    // Check if developer has signed
    if (!contract.signed_by_developer) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Developer must sign the contract first"
      });
    }

    // Check if entrepreneur already signed
    if (contract.signed_by_entrepreneur) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "You have already signed this contract"
      });
    }

    // Update contract - entrepreneur signs (contract becomes fully signed)
    await connection.execute(
      `UPDATE contracts
       SET signed_by_entrepreneur = 1,
           signed_by_entrepreneur_at = NOW(),
           status = 'signed'
       WHERE id = ?`,
      [contractId]
    );

    // Create notification for developer
    await connection.execute(
      `INSERT INTO notifications
       (developer_id, message, type)
       VALUES (?, ?, 'contract_status')`,
      [
        contract.developer_id,
        `🎉 Great news! ${contract.entrepreneur_name} has signed the contract for "${contract.project_title}". The collaboration is now active!`
      ]
    );

    // Log activity
    await connection.execute(
      `INSERT INTO activity_log
       (user_id, user_type, action_type, entity_type, entity_id, description)
       VALUES (?, 'entrepreneur', 'contract_accepted', 'contract', ?, ?)`,
      [entrepreneurId, contractId, `Accepted and signed contract for project: ${contract.project_title}`]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Contract accepted and signed successfully. Collaboration is now active!"
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error accepting contract:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    connection.release();
  }
};

/**
 * Entrepreneur rejects a contract with reason
 * POST /contracts/entrepreneur-reject
 */
const entrepreneurRejectContract = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { contractId, entrepreneurId, rejectionReason } = req.body;

    if (!contractId || !entrepreneurId) {
      return res.status(400).json({
        success: false,
        message: "contractId and entrepreneurId are required"
      });
    }

    // Check if contract exists
    const [contractRows] = await connection.execute(
      `SELECT c.id, c.developer_id, c.entrepreneur_id, c.status, c.project_title,
              c.signed_by_developer, c.signed_by_entrepreneur,
              d.fullName AS developer_name, e.fullName AS entrepreneur_name
       FROM contracts c
       JOIN developers d ON c.developer_id = d.id
       JOIN entrepreneur e ON c.entrepreneur_id = e.id
       WHERE c.id = ? AND c.entrepreneur_id = ?`,
      [contractId, entrepreneurId]
    );

    if (contractRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Contract not found or you don't have permission"
      });
    }

    const contract = contractRows[0];

    // Cannot reject if already signed by entrepreneur
    if (contract.signed_by_entrepreneur) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot reject a contract you've already signed"
      });
    }

    // Update contract status to rejected
    await connection.execute(
      `UPDATE contracts
       SET status = 'rejected',
           rejection_reason = ?
       WHERE id = ?`,
      [rejectionReason || "No reason provided", contractId]
    );

    // Notify developer
    const reasonText = rejectionReason
      ? `\n\nReason: ${rejectionReason}`
      : "";

    await connection.execute(
      `INSERT INTO notifications
       (developer_id, message, type)
       VALUES (?, ?, 'contract_status')`,
      [
        contract.developer_id,
        `${contract.entrepreneur_name} has rejected the contract for "${contract.project_title}".${reasonText}\n\nYou can discuss revisions or submit a new proposal.`
      ]
    );

    // Log activity
    await connection.execute(
      `INSERT INTO activity_log
       (user_id, user_type, action_type, entity_type, entity_id, description)
       VALUES (?, 'entrepreneur', 'contract_rejected', 'contract', ?, ?)`,
      [entrepreneurId, contractId, `Rejected contract for project: ${contract.project_title}`]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Contract rejected successfully"
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error rejecting contract:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    connection.release();
  }
};

/**
 * Get pending contracts for an entrepreneur
 * GET /contracts/pending/:entrepreneurId
 */
const getPendingContracts = async (req, res) => {
  try {
    const { entrepreneurId } = req.params;

    if (!entrepreneurId) {
      return res.status(400).json({
        success: false,
        message: "entrepreneurId is required"
      });
    }

    const [contracts] = await pool.query(
      `SELECT
        c.id,
        c.project_title,
        c.developer_name,
        c.developer_email,
        c.signed_by_developer,
        c.signed_by_developer_at,
        c.status,
        c.created_at,
        c.equity_percentage,
        c.timeline
       FROM contracts c
       WHERE c.entrepreneur_id = ?
         AND c.signed_by_developer = 1
         AND c.signed_by_entrepreneur = 0
         AND c.status = 'pending_entrepreneur_signature'
       ORDER BY c.signed_by_developer_at DESC`,
      [entrepreneurId]
    );

    res.json({
      success: true,
      contracts,
      count: contracts.length
    });
  } catch (err) {
    console.error("Error fetching pending contracts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get all contracts for a developer
 * GET /contracts/developer/:developerId
 */
const getDeveloperContracts = async (req, res) => {
  try {
    const { developerId } = req.params;

    const [contracts] = await pool.execute(
      `SELECT
        c.id,
        c.project_title,
        c.entrepreneur_name,
        c.signed_by_developer,
        c.signed_by_entrepreneur,
        c.signed_by_developer_at,
        c.signed_by_entrepreneur_at,
        c.status,
        c.equity_percentage,
        c.created_at
       FROM contracts c
       WHERE c.developer_id = ?
       ORDER BY c.created_at DESC`,
      [developerId]
    );

    res.json({
      success: true,
      contracts,
      total: contracts.length
    });
  } catch (err) {
    console.error("Error fetching developer contracts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  developerSignContract,
  entrepreneurAcceptContract,
  entrepreneurRejectContract,
  getPendingContracts,
  getDeveloperContracts,
};
