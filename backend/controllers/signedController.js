// controllers/contractController.js
const pool = require("../db");

// Developer signs a contract
const developerSignedContract = async (req, res) => {
  const { contractId, developerId } = req.body;

  if (!contractId || !developerId) {
    return res
      .status(400)
      .json({ success: false, message: "contractId and developerId are required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE contracts SET signed_by_developer = 1, status = "pending_signature" WHERE id = ? AND developer_id = ?`,
      [contractId, developerId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found or already signed" });
    }

    res.json({ success: true, message: "Contract signed successfully" });
  } catch (err) {
    console.error("Error signing contract:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Entrepreneur accepts a contract signed by developer
const entrepreneurAcceptContract = async (req, res) => {
  const { contractId } = req.body;

  if (!contractId) {
    return res.status(400).json({ success: false, message: "contractId is required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE contracts 
       SET signed_by_entrepreneur = 1, status = "signed" 
       WHERE id = ? AND signed_by_developer = 1`,
      [contractId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Contract not found or not signed by developer" });
    }
console.log("signed");
    res.json({ success: true, message: "Contract accepted successfully" });
  } catch (err) {
    console.error("Error accepting contract:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const entrepreneurRejectContract = async (req, res) => {
  const { contractId } = req.body;

  if (!contractId) {
    return res.status(400).json({ success: false, message: "contractId is required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE contracts 
       SET signed_by_entrepreneur = 0, status = "terminated" 
       WHERE id = ?`,
      [contractId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }
    console.log("terminated");
    res.json({ success: true, message: "Contract rejected successfully" });
  } catch (err) {
    console.error("Error rejecting contract:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getPendingContracts = async (req, res) => {
  const { entrepreneurId } = req.body;
  console.log("Received entrepreneurId (body):", entrepreneurId);

  if (!entrepreneurId) {
    return res.status(400).json({ success: false, message: "entrepreneurId is required" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, project_title, developer_name 
       FROM contracts 
       WHERE entrepreneur_id = ? AND signed_by_developer = 1 AND signed_by_entrepreneur = 0 AND status = "pending_signature"`,
      [entrepreneurId]
    );

    res.json({ success: true, contracts: rows });
  } catch (err) {
    console.error("Error fetching pending contracts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { developerSignedContract, entrepreneurAcceptContract, getPendingContracts,entrepreneurRejectContract };
