const pool = require("../db");

/**
 * Get overview statistics for specific user
 */
const getOverviewStats = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ error: "userId and userType are required" });
    }

    let stats;

    if (userType === 'entrepreneur') {
      // Entrepreneur-specific stats
      const [myIdeas] = await pool.execute(
        "SELECT COUNT(*) as count FROM entrepreneur_idea WHERE entrepreneur_id = ?",
        [userId]
      );
      const [myProposals] = await pool.execute(`
        SELECT COUNT(*) as count FROM proposals p
        JOIN entrepreneur_idea ei ON p.idea_id = ei.id
        WHERE ei.entrepreneur_id = ?
      `, [userId]);
      const [acceptedProposals] = await pool.execute(`
        SELECT COUNT(*) as count FROM proposals p
        JOIN entrepreneur_idea ei ON p.idea_id = ei.id
        WHERE ei.entrepreneur_id = ? AND p.status = 'Approved'
      `, [userId]);
      const [myContracts] = await pool.execute(
        "SELECT COUNT(*) as count FROM contracts WHERE entrepreneur_id = ? AND status = 'signed'",
        [userId]
      );
      const [uniqueDevelopers] = await pool.execute(`
        SELECT COUNT(DISTINCT p.developer_id) as count FROM proposals p
        JOIN entrepreneur_idea ei ON p.idea_id = ei.id
        WHERE ei.entrepreneur_id = ?
      `, [userId]);

      stats = {
        totalIdeas: myIdeas[0].count,
        totalProposals: myProposals[0].count,
        acceptedProposals: acceptedProposals[0].count,
        activeCollaborations: myContracts[0].count,
        uniqueDevelopers: uniqueDevelopers[0].count,
        proposalAcceptanceRate: myProposals[0].count > 0
          ? ((acceptedProposals[0].count / myProposals[0].count) * 100).toFixed(1)
          : 0
      };
    } else if (userType === 'developer') {
      // Developer-specific stats
      const [myProposals] = await pool.execute(
        "SELECT COUNT(*) as count FROM proposals WHERE developer_id = ?",
        [userId]
      );
      const [acceptedProposals] = await pool.execute(
        "SELECT COUNT(*) as count FROM proposals WHERE developer_id = ? AND status = 'Approved'",
        [userId]
      );
      const [rejectedProposals] = await pool.execute(
        "SELECT COUNT(*) as count FROM proposals WHERE developer_id = ? AND status = 'Rejected'",
        [userId]
      );
      const [myContracts] = await pool.execute(
        "SELECT COUNT(*) as count FROM contracts WHERE developer_id = ? AND status = 'signed'",
        [userId]
      );
      const [myBookmarks] = await pool.execute(
        "SELECT COUNT(*) as count FROM bookmarks WHERE developer_id = ?",
        [userId]
      );

      stats = {
        totalProposals: myProposals[0].count,
        acceptedProposals: acceptedProposals[0].count,
        rejectedProposals: rejectedProposals[0].count,
        activeCollaborations: myContracts[0].count,
        bookmarkedIdeas: myBookmarks[0].count,
        proposalAcceptanceRate: myProposals[0].count > 0
          ? ((acceptedProposals[0].count / myProposals[0].count) * 100).toFixed(1)
          : 0
      };
    }

    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error("Error getting overview stats:", error);
    res.status(500).json({ error: "Failed to get overview statistics" });
  }
};

/**
 * Get ideas by stage distribution for specific entrepreneur
 */
const getIdeasByCategory = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ error: "userId and userType are required" });
    }

    let stages;

    if (userType === 'entrepreneur') {
      [stages] = await pool.execute(`
        SELECT stage as category, COUNT(*) as count
        FROM entrepreneur_idea
        WHERE entrepreneur_id = ? AND stage IS NOT NULL AND stage != ''
        GROUP BY stage
        ORDER BY count DESC
      `, [userId]);
    } else {
      // For developers, show stages of ideas they've submitted proposals for
      [stages] = await pool.execute(`
        SELECT ei.stage as category, COUNT(DISTINCT ei.id) as count
        FROM proposals p
        JOIN entrepreneur_idea ei ON p.idea_id = ei.id
        WHERE p.developer_id = ? AND ei.stage IS NOT NULL AND ei.stage != ''
        GROUP BY ei.stage
        ORDER BY count DESC
      `, [userId]);
    }

    res.json({
      success: true,
      categories: stages
    });
  } catch (error) {
    console.error("Error getting ideas by stage:", error);
    res.status(500).json({ error: "Failed to get stage distribution" });
  }
};

/**
 * Get proposal trends over time for specific user
 */
const getProposalTrends = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ error: "userId and userType are required" });
    }

    let trends;

    if (userType === 'entrepreneur') {
      [trends] = await pool.execute(`
        SELECT
          DATE_FORMAT(p.created_at, '%Y-%m') as month,
          COUNT(*) as total,
          SUM(CASE WHEN p.status = 'Approved' THEN 1 ELSE 0 END) as accepted,
          SUM(CASE WHEN p.status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(CASE WHEN p.status = 'Pending' THEN 1 ELSE 0 END) as pending
        FROM proposals p
        JOIN entrepreneur_idea ei ON p.idea_id = ei.id
        WHERE ei.entrepreneur_id = ? AND p.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `, [userId]);
    } else {
      [trends] = await pool.execute(`
        SELECT
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as accepted,
          SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending
        FROM proposals
        WHERE developer_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `, [userId]);
    }

    res.json({
      success: true,
      trends: trends.reverse(),
    });
  } catch (error) {
    console.error("Error getting proposal trends:", error);
    res.status(500).json({ error: "Failed to get proposal trends" });
  }
};

/**
 * Get top developers who submitted proposals to entrepreneur's ideas
 */
const getTopDevelopers = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ error: "userId and userType are required" });
    }

    if (userType !== 'entrepreneur') {
      return res.json({ success: true, developers: [] });
    }

    const [developers] = await pool.execute(`
      SELECT
        d.id,
        d.fullName as name,
        d.email,
        d.bio,
        COUNT(p.id) as proposalCount,
        SUM(CASE WHEN p.status = 'Approved' THEN 1 ELSE 0 END) as acceptedCount
      FROM developers d
      JOIN proposals p ON d.id = p.developer_id
      JOIN entrepreneur_idea ei ON p.idea_id = ei.id
      WHERE ei.entrepreneur_id = ?
      GROUP BY d.id, d.fullName, d.email, d.bio
      ORDER BY acceptedCount DESC, proposalCount DESC
      LIMIT 10
    `, [userId]);

    res.json({
      success: true,
      developers,
    });
  } catch (error) {
    console.error("Error getting top developers:", error);
    res.status(500).json({ error: "Failed to get top developers" });
  }
};

/**
 * Get top ideas for developer based on proposals submitted
 */
const getTopEntrepreneurs = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ error: "userId and userType are required" });
    }

    if (userType !== 'developer') {
      return res.json({ success: true, entrepreneurs: [] });
    }

    const [entrepreneurs] = await pool.execute(`
      SELECT
        e.id,
        e.fullName as name,
        e.email,
        COUNT(DISTINCT ei.id) as ideaCount,
        COUNT(p.id) as proposalCount,
        SUM(CASE WHEN p.status = 'Approved' THEN 1 ELSE 0 END) as acceptedCount
      FROM entrepreneur e
      JOIN entrepreneur_idea ei ON e.id = ei.entrepreneur_id
      JOIN proposals p ON ei.id = p.idea_id
      WHERE p.developer_id = ?
      GROUP BY e.id, e.fullName, e.email
      ORDER BY acceptedCount DESC, proposalCount DESC
      LIMIT 10
    `, [userId]);

    res.json({
      success: true,
      entrepreneurs,
    });
  } catch (error) {
    console.error("Error getting top entrepreneurs:", error);
    res.status(500).json({ error: "Failed to get top entrepreneurs" });
  }
};

/**
 * Get equity distribution analytics for user
 */
const getEquityAnalytics = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ error: "userId and userType are required" });
    }

    let equityStats, overallStats;

    if (userType === 'entrepreneur') {
      // Equity offered by entrepreneur
      [equityStats] = await pool.execute(`
        SELECT
          stage as category,
          AVG(CAST(equity_offering AS DECIMAL(10,2))) as avgEquity,
          MIN(CAST(equity_offering AS DECIMAL(10,2))) as minEquity,
          MAX(CAST(equity_offering AS DECIMAL(10,2))) as maxEquity
        FROM entrepreneur_idea
        WHERE entrepreneur_id = ?
          AND equity_offering IS NOT NULL
          AND equity_offering != ''
          AND equity_offering REGEXP '^[0-9]+(\\.[0-9]+)?$'
        GROUP BY stage
      `, [userId]);

      [overallStats] = await pool.execute(`
        SELECT
          AVG(CAST(equity_offering AS DECIMAL(10,2))) as avgEquity,
          MIN(CAST(equity_offering AS DECIMAL(10,2))) as minEquity,
          MAX(CAST(equity_offering AS DECIMAL(10,2))) as maxEquity,
          COUNT(*) as totalIdeas
        FROM entrepreneur_idea
        WHERE entrepreneur_id = ?
          AND equity_offering IS NOT NULL
          AND equity_offering != ''
          AND equity_offering REGEXP '^[0-9]+(\\.[0-9]+)?$'
      `, [userId]);
    } else {
      // Equity in proposals developer submitted
      [equityStats] = await pool.execute(`
        SELECT
          ei.stage as category,
          AVG(CAST(p.equity_requested AS DECIMAL(10,2))) as avgEquity,
          MIN(CAST(p.equity_requested AS DECIMAL(10,2))) as minEquity,
          MAX(CAST(p.equity_requested AS DECIMAL(10,2))) as maxEquity
        FROM proposals p
        JOIN entrepreneur_idea ei ON p.idea_id = ei.id
        WHERE p.developer_id = ?
          AND p.equity_requested IS NOT NULL
          AND p.equity_requested != ''
          AND p.equity_requested REGEXP '^[0-9]+(\\.[0-9]+)?$'
        GROUP BY ei.stage
      `, [userId]);

      [overallStats] = await pool.execute(`
        SELECT
          AVG(CAST(equity_requested AS DECIMAL(10,2))) as avgEquity,
          MIN(CAST(equity_requested AS DECIMAL(10,2))) as minEquity,
          MAX(CAST(equity_requested AS DECIMAL(10,2))) as maxEquity,
          COUNT(*) as totalIdeas
        FROM proposals
        WHERE developer_id = ?
          AND equity_requested IS NOT NULL
          AND equity_requested != ''
          AND equity_requested REGEXP '^[0-9]+(\\.[0-9]+)?$'
      `, [userId]);
    }

    res.json({
      success: true,
      byCategory: equityStats,
      overall: overallStats[0] || { avgEquity: 0, minEquity: 0, maxEquity: 0, totalIdeas: 0 }
    });
  } catch (error) {
    console.error("Error getting equity analytics:", error);
    res.status(500).json({ error: "Failed to get equity analytics" });
  }
};

/**
 * Get collaboration success metrics for user
 */
const getCollaborationMetrics = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ error: "userId and userType are required" });
    }

    let metrics, stageMetrics;

    if (userType === 'entrepreneur') {
      [metrics] = await pool.execute(`
        SELECT
          COUNT(*) as totalCollaborations,
          SUM(CASE WHEN status = 'signed' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'terminated' THEN 1 ELSE 0 END) as cancelled,
          SUM(CASE WHEN status = 'pending_signature' THEN 1 ELSE 0 END) as pending
        FROM contracts
        WHERE entrepreneur_id = ?
      `, [userId]);

      [stageMetrics] = await pool.execute(`
        SELECT
          ei.stage as category,
          COUNT(c.id) as collaborationCount,
          SUM(CASE WHEN c.status = 'signed' THEN 1 ELSE 0 END) as signedCount
        FROM contracts c
        JOIN proposals p ON c.proposal_id = p.id
        JOIN entrepreneur_idea ei ON p.idea_id = ei.id
        WHERE c.entrepreneur_id = ?
        GROUP BY ei.stage
        ORDER BY collaborationCount DESC
      `, [userId]);
    } else {
      [metrics] = await pool.execute(`
        SELECT
          COUNT(*) as totalCollaborations,
          SUM(CASE WHEN status = 'signed' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'terminated' THEN 1 ELSE 0 END) as cancelled,
          SUM(CASE WHEN status = 'pending_signature' THEN 1 ELSE 0 END) as pending
        FROM contracts
        WHERE developer_id = ?
      `, [userId]);

      [stageMetrics] = await pool.execute(`
        SELECT
          ei.stage as category,
          COUNT(c.id) as collaborationCount,
          SUM(CASE WHEN c.status = 'signed' THEN 1 ELSE 0 END) as signedCount
        FROM contracts c
        JOIN proposals p ON c.proposal_id = p.id
        JOIN entrepreneur_idea ei ON p.idea_id = ei.id
        WHERE c.developer_id = ?
        GROUP BY ei.stage
        ORDER BY collaborationCount DESC
      `, [userId]);
    }

    res.json({
      success: true,
      overall: metrics[0],
      byCategory: stageMetrics
    });
  } catch (error) {
    console.error("Error getting collaboration metrics:", error);
    res.status(500).json({ error: "Failed to get collaboration metrics" });
  }
};

/**
 * Get activity history for specific user
 */
const getRecentActivity = async (req, res) => {
  try {
    const { userId, userType } = req.query;
    const limit = parseInt(req.query.limit) || 20;

    if (!userId || !userType) {
      return res.status(400).json({ error: "userId and userType are required" });
    }

    let activities;

    if (userType === 'entrepreneur') {
      [activities] = await pool.execute(`
        (SELECT
          'idea' as type,
          ei.id,
          ei.title as description,
          'You' as user,
          ei.created_at as timestamp
         FROM entrepreneur_idea ei
         WHERE ei.entrepreneur_id = ?
         ORDER BY ei.created_at DESC
         LIMIT ?)
        UNION ALL
        (SELECT
          'proposal' as type,
          p.id,
          CONCAT('Proposal from ', d.fullName, ' for "', ei.title, '"') as description,
          d.fullName as user,
          p.created_at as timestamp
         FROM proposals p
         JOIN entrepreneur_idea ei ON p.idea_id = ei.id
         JOIN developers d ON p.developer_id = d.id
         WHERE ei.entrepreneur_id = ?
         ORDER BY p.created_at DESC
         LIMIT ?)
        UNION ALL
        (SELECT
          'contract' as type,
          c.id,
          CONCAT('Contract signed for: ', c.project_title) as description,
          'You' as user,
          c.created_at as timestamp
         FROM contracts c
         WHERE c.entrepreneur_id = ?
         ORDER BY c.created_at DESC
         LIMIT ?)
        ORDER BY timestamp DESC
        LIMIT ?
      `, [userId, limit, userId, limit, userId, limit, limit]);
    } else {
      [activities] = await pool.execute(`
        (SELECT
          'proposal' as type,
          p.id,
          CONCAT('You submitted proposal for "', ei.title, '"') as description,
          'You' as user,
          p.created_at as timestamp
         FROM proposals p
         JOIN entrepreneur_idea ei ON p.idea_id = ei.id
         WHERE p.developer_id = ?
         ORDER BY p.created_at DESC
         LIMIT ?)
        UNION ALL
        (SELECT
          'contract' as type,
          c.id,
          CONCAT('Contract for: ', c.project_title) as description,
          'You' as user,
          c.created_at as timestamp
         FROM contracts c
         WHERE c.developer_id = ?
         ORDER BY c.created_at DESC
         LIMIT ?)
        UNION ALL
        (SELECT
          'bookmark' as type,
          b.id,
          CONCAT('Bookmarked "', ei.title, '"') as description,
          'You' as user,
          b.created_at as timestamp
         FROM bookmarks b
         JOIN entrepreneur_idea ei ON b.idea_id = ei.id
         WHERE b.developer_id = ?
         ORDER BY b.created_at DESC
         LIMIT ?)
        ORDER BY timestamp DESC
        LIMIT ?
      `, [userId, limit, userId, limit, userId, limit, limit]);
    }

    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Error getting recent activity:", error);
    res.status(500).json({ error: "Failed to get recent activity" });
  }
};

module.exports = {
  getOverviewStats,
  getIdeasByCategory,
  getProposalTrends,
  getTopDevelopers,
  getTopEntrepreneurs,
  getEquityAnalytics,
  getCollaborationMetrics,
  getUserGrowth,
  getRecentActivity
};
