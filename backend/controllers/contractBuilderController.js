const pool = require("../db");

const getContractOrProposal = async (req, res) => {
  const { proposalId } = req.query;

  if (!proposalId) {
    return res.status(400).json({
      success: false,
      message: "proposalId is required in query params",
    });
  }

  try {
    // 1️⃣ Check if a contract already exists for this proposal
    const [contractRows] = await pool.query(
      "SELECT * FROM contracts WHERE proposal_id = ?",
      [proposalId]
    );

    if (contractRows.length > 0) {
      const contract = contractRows[0];

      // Safely parse JSON fields
      const milestones = contract.milestones
        ? typeof contract.milestones === "string"
          ? JSON.parse(contract.milestones)
          : contract.milestones
        : [];

      const additionalClauses = contract.additional_clauses
        ? typeof contract.additional_clauses === "string"
          ? JSON.parse(contract.additional_clauses)
          : contract.additional_clauses
        : [];

      return res.json({
        success: true,
        data: {
          developer_id: contract.developer_id || "",
          entrepreneur_id: contract.entrepreneur_id || "",
          entrepreneurName: contract.entrepreneur_name || "",
          entrepreneurEmail: contract.entrepreneur_email || "",
          entrepreneurCompany: contract.entrepreneur_company || "",
          developerName: contract.developer_name || "",
          developerEmail: contract.developer_email || "",
          projectTitle: contract.project_title || "",
          projectDescription: contract.project_description || "",
          scope: contract.scope || "",
          timeline: contract.timeline || "",
          milestones,
          equityPercentage: contract.equity_percentage || "",
          ipOwnership: contract.ip_ownership || "",
          confidentiality: contract.confidentiality || "",
          terminationClause: contract.termination_clause || "",
          disputeResolution: contract.dispute_resolution || "",
          governingLaw: contract.governing_law || "",
          additionalClauses,
          revisions: contract.revisions || "",
          supportTerms: contract.support_terms || "",
        },
      });
    }

    // 2️⃣ Otherwise, fetch data from proposals + developer + idea + entrepreneur
    const [proposalRows] = await pool.query(
      `SELECT
          p.id AS proposalId,
          p.scope,
          p.timeline,
          p.equity_requested AS equityPercentage,
          p.additional_notes AS additionalNotes,

          -- Developer info
          d.id AS developer_id,
          d.fullName AS developerName,
          d.email AS developerEmail,
          d.bio AS developerBio,

          -- Entrepreneur info via idea
          e.id AS entrepreneur_id,
          e.fullName AS entrepreneurName,
          e.email AS entrepreneurEmail,
          e.company AS entrepreneurCompany,

          -- Project/Idea info
          ei.title AS projectTitle,
          ei.overview AS projectDescription

      FROM proposals p
      JOIN developers d ON p.developer_id = d.id
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      JOIN entrepreneur e ON ei.entrepreneur_id = e.id
      WHERE p.id = ?`,
      [proposalId]
    );

    if (proposalRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    const proposal = proposalRows[0];

    const contractData = {
      developer_id: proposal.developer_id || "",
      entrepreneur_id: proposal.entrepreneur_id || "",
      entrepreneurName: proposal.entrepreneurName,
      entrepreneurEmail: proposal.entrepreneurEmail,
      entrepreneurCompany: proposal.entrepreneurCompany,
      developerName: proposal.developerName,
      developerEmail: proposal.developerEmail,
      projectTitle: proposal.projectTitle,
      projectDescription: proposal.projectDescription,
      scope: proposal.scope,
      timeline: proposal.timeline,
      milestones: [], // no milestones yet
      equityPercentage: proposal.equityPercentage,
      ipOwnership: "",
      confidentiality: "",
      terminationClause: "",
      disputeResolution: "",
      governingLaw: "",
      additionalClauses: proposal.additionalNotes ? [proposal.additionalNotes] : [],
      revisions: "",
      supportTerms: "",
    };

    return res.json({
      success: true,
      data: contractData,
    });
  } catch (err) {
    console.error("Error in getContractOrProposal:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



const contractDetailsController = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const data = req.body;

    const query = `
      INSERT INTO contracts (
        proposal_id,
        entrepreneur_id,
        entrepreneur_name,
        entrepreneur_email,
        entrepreneur_company,
        developer_id,
        developer_name,
        developer_email,
        project_title,
        project_description,
        scope,
        timeline,
        milestones,
        equity_percentage,
        ip_ownership,
        confidentiality,
        termination_clause,
        dispute_resolution,
        governing_law,
        additional_clauses,
        revisions,
        support_terms,
        signed_by_entrepreneur,
        signed_by_entrepreneur_at,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

    const values = [
      data.proposalId,
      data.entrepreneur_id,
      data.entrepreneurName || "",
      data.entrepreneurEmail || "",
      data.entrepreneurCompany || null,
      data.developer_id,
      data.developerName || "",
      data.developerEmail || "",
      data.projectTitle || "",
      data.projectDescription || "",
      data.scope || "",
      data.timeline || "",
      JSON.stringify(data.milestones || []),
      data.equityPercentage || "",
      data.ipOwnership || "",
      data.confidentiality || "",
      data.terminationClause || "",
      data.disputeResolution || "",
      data.governingLaw || "",
      JSON.stringify(data.additionalClauses || []),
      data.revisions || "",
      data.supportTerms || "",
      1, // signed_by_entrepreneur = 1 (entrepreneur signs when creating)
      'pending_signature' // status = waiting for developer signature
    ];

    const [result] = await connection.execute(query, values);
    const contractId = result.insertId;

    // Create notification for developer
    const notificationMessage = `🎉 Contract Ready! ${data.entrepreneurName} has prepared a contract for "${data.projectTitle}". Please review and sign to start your collaboration.`;

    await connection.execute(
      `INSERT INTO notifications (developer_id, proposal_id, message, type)
       VALUES (?, ?, ?, 'contract_status')`,
      [data.developer_id, data.proposalId, notificationMessage]
    );

    // Log activity
    await connection.execute(
      `INSERT INTO activity_log
       (user_id, user_type, action_type, entity_type, entity_id, description)
       VALUES (?, 'entrepreneur', 'contract_created', 'contract', ?, ?)`,
      [data.entrepreneur_id, contractId, `Created contract for project: ${data.projectTitle}`]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Contract saved successfully",
      contractId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error saving contract:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    connection.release();
  }
};


const contractDraft = async (req, res) => {
  const data = req.body;

  if (!data.proposalId) {
    return res.status(400).json({
      success: false,
      message: "proposalId is required",
    });
  }

  try {
    const [proposalRows] = await pool.query(
    `SELECT developer_id 
       FROM proposals 
       WHERE id = ?`,
      [data.proposalId]
    );

    if (proposalRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    const developer_id = proposalRows[0].developer_id;

     // 2️⃣ Get developer fullName and email from developers table
    const [developerRows] = await pool.query(
      `SELECT fullName, email FROM developers WHERE id = ?`,
      [developer_id]
    );

    if (developerRows.length === 0) {
      return res.status(404).json({ success: false, message: "Developer not found" });
    }

    const developerName = developerRows[0].fullName;
    const developerEmail = developerRows[0].email;
    // Check if a draft already exists
    const [existingRows] = await pool.query(
      "SELECT id FROM contracts WHERE proposal_id = ?",
      [data.proposalId]
    );

    if (existingRows.length > 0) {
      // Update existing draft
      const updateValues = [
        data.entrepreneur_id,
        data.entrepreneurName || "",
        data.entrepreneurEmail || "",
        data.entrepreneurCompany || null,
        developer_id,
        developerName || "",
        developerEmail || "",
        data.projectTitle || "",
        data.projectDescription || "",
        data.scope || "",
        data.timeline || "",
        JSON.stringify(data.milestones || []),
        data.equityPercentage || "",
        data.ipOwnership || "",
        data.confidentiality || "",
        data.terminationClause || "",
        data.disputeResolution || "",
        data.governingLaw || "",
        JSON.stringify(data.additionalClauses || []),
        data.revisions || "",
        data.supportTerms || "",
        data.proposalId
      ];

      const updateQuery = `
        UPDATE contracts SET
          entrepreneur_id = ?,
          entrepreneur_name = ?,
          entrepreneur_email = ?,
          entrepreneur_company = ?,
          developer_id = ?,
          developer_name = ?,
          developer_email = ?,
          project_title = ?,
          project_description = ?,
          scope = ?,
          timeline = ?,
          milestones = ?,
          equity_percentage = ?,
          ip_ownership = ?,
          confidentiality = ?,
          termination_clause = ?,
          dispute_resolution = ?,
          governing_law = ?,
          additional_clauses = ?,
          revisions = ?,
          support_terms = ?
        WHERE proposal_id = ?
      `;

      await pool.query(updateQuery, updateValues);

      return res.json({ success: true, message: "Draft Saved (Updated)" });
    }

    // Insert new draft
    const insertValues = [
      data.entrepreneur_id,
      data.entrepreneurName || "",
      data.entrepreneurEmail || "",
      data.entrepreneurCompany || null,
      developer_id,
      developerName || "",
      developerEmail || "",
      data.projectTitle || "",
      data.projectDescription || "",
      data.scope || "",
      data.timeline || "",
      JSON.stringify(data.milestones || []),
      data.equityPercentage || "",
      data.ipOwnership || "",
      data.confidentiality || "",
      data.terminationClause || "",
      data.disputeResolution || "",
      data.governingLaw || "",
      JSON.stringify(data.additionalClauses || []),
      data.revisions || "",
      data.supportTerms || "",
      data.proposalId
    ];

    const insertQuery = `
      INSERT INTO contracts (
        entrepreneur_id,
        entrepreneur_name,
        entrepreneur_email,
        entrepreneur_company,
        developer_id,
        developer_name,
        developer_email,
        project_title,
        project_description,
        scope,
        timeline,
        milestones,
        equity_percentage,
        ip_ownership,
        confidentiality,
        termination_clause,
        dispute_resolution,
        governing_law,
        additional_clauses,
        revisions,
        support_terms,
        proposal_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(insertQuery, insertValues);

    res.json({ success: true, message: "Draft Saved (New)" });

  } catch (error) {
    console.error("Error saving/updating contract draft:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving contract draft",
    });
  }
};
const getContractWithSections = async (req, res) => {
  const developerId = req.query.developerId;

  if (!developerId) {
    return res.status(400).json({ success: false, message: "developerId is required" });
  }

  try {
    // 1️⃣ Fetch contract(s) for the developer
    const [contractRows] = await pool.query(
      `SELECT * FROM contracts WHERE developer_id = ?`,
      [developerId]
    );

    if (!contractRows || contractRows.length === 0) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    const contract = contractRows[0];

    // 2️⃣ Safely parse JSON fields (handle both string and object formats)
    const parseJSONField = (field) => {
      if (!field) return [];
      if (typeof field === "string") {
        try {
          return JSON.parse(field);
        } catch (err) {
          console.warn("⚠️ Failed to parse JSON field:", field, err);
          return [];
        }
      }
      if (Array.isArray(field)) return field;
      return [];
    };

    const developerSkills = parseJSONField(contract.developer_skills);
    const milestones = parseJSONField(contract.milestones);
    const additionalClauses = parseJSONField(contract.additional_clauses);

    // 3️⃣ Prepare raw contract data
    const CONTRACT_DATA = {
      id: contract.id,
      title: contract.project_title,
      status: contract.status || "draft",
      createdDate: contract.created_at,
      parties: {
        entrepreneur: {
          id: contract.entrepreneur_id,
          name: contract.entrepreneur_name,
          email: contract.entrepreneur_email,
          company: contract.entrepreneur_company || "N/A",
          address: contract.entrepreneur_address || "N/A",
        },
        developer: {
          id: contract.developer_id,
          name: contract.developer_name,
          email: contract.developer_email,
          skills: developerSkills,
          address: contract.developer_address || "N/A",
        },
      },
      projectDetails: {
        name: contract.project_title,
        description: contract.project_description,
        scope: contract.scope,
        timeline: contract.timeline,
        equity: contract.equity_percentage,
        milestones: milestones,
      },
      ip_ownership: contract.ip_ownership || "N/A",
      confidentiality: contract.confidentiality || "N/A",
      support_terms: contract.support_terms || "N/A",
      termination_clause: contract.termination_clause || "N/A",
      dispute_resolution: contract.dispute_resolution || "N/A",
      governing_law: contract.governing_law || "N/A",
      additional_clauses: additionalClauses,
    };

    // 4️⃣ Send raw contract data to frontend
    res.json({
      success: true,
      data: CONTRACT_DATA,
    });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = { contractDraft, getContractOrProposal,contractDetailsController, getContractWithSections};
