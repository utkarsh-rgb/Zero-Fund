const pool = require("../db");


const getCollaborations = async (req, res) => {

 const entrepreneurId = req.params.entrepreneurId; // 👈 get from URL
  console.log("Received entrepreneurId:", entrepreneurId);

  if (!entrepreneurId) {
    return res.status(400).json({ success: false, message: "entrepreneurId is required" });
  }

  try {
  const [contracts] = await pool.query(
  `SELECT 
      id,
      project_title,
      developer_name,
      developer_email,
      timeline,
      equity_percentage,
      status,
      signed_by_developer,
      signed_by_entrepreneur,
      project_description,
      scope,
      milestones,
      ip_ownership,
      confidentiality,
      termination_clause,
      dispute_resolution,
      governing_law,
      additional_clauses,
      support_terms,
      revisions,
      created_at
   FROM contracts
   WHERE entrepreneur_id = ? AND status = 'signed'`,
  [entrepreneurId]
);

    console.log("Fetched signed contracts:", contracts); // log fetched contracts

    res.json({ success: true, contracts });
  } catch (err) {
    console.error("Error fetching signed collaborations:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const getDeveloperCollaborations = async (req, res) => {
  const developerId = req.params.developerId;
  console.log("Received developerId:", developerId);

  if (!developerId) {
    return res.status(400).json({ success: false, message: "developerId is required" });
  }

  try {
    const [contracts] = await pool.query(
      `SELECT 
          id,
          project_title,
          entrepreneur_name,
          entrepreneur_email,
          timeline,
          equity_percentage,
          status,
          signed_by_developer,
          signed_by_entrepreneur,
          project_description,
          scope,
          milestones,
          ip_ownership,
          confidentiality,
          termination_clause,
          dispute_resolution,
          governing_law,
          additional_clauses,
          support_terms,
          revisions,
          created_at
       FROM contracts
       WHERE developer_id = ? AND status = 'signed'`,
      [developerId]
    );

    console.log("Fetched signed contracts for developer:", contracts);

    res.json({ success: true, contracts });
  } catch (err) {
    console.error("Error fetching developer collaborations:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {  getCollaborations, getDeveloperCollaborations };
