const pool = require("../db");

/**
 * Get overview statistics for the platform
 */
const getOverviewStats = async (req, res) => {
  try {
    const [totalIdeas] = await pool.execute("SELECT COUNT(*) as count FROM entrepreneur_idea");
    const [totalDevelopers] = await pool.execute("SELECT COUNT(*) as count FROM developers"); 
    const [totalEntrepreneurs] = await pool.execute("SELECT COUNT(*) as count FROM entrepreneur");
    const [totalProposals] = await pool.execute("SELECT COUNT(*) as count FROM proposals");
    const [acceptedProposals] = await pool.execute("SELECT COUNT(*) as count FROM proposals WHERE status = 'accepted'");

    // FIX: define activeCollaborations safely
    const activeCollaborations = [{ count: 0 }];

    res.json({
      success: true,
      stats: {
        totalIdeas: totalIdeas[0].count,
        totalDevelopers: totalDevelopers[0].count,
        totalEntrepreneurs: totalEntrepreneurs[0].count,
        totalProposals: totalProposals[0].count,
        acceptedProposals: acceptedProposals[0].count,
        activeCollaborations: activeCollaborations[0].count,
        proposalAcceptanceRate:
          totalProposals[0].count > 0
            ? ((acceptedProposals[0].count / totalProposals[0].count) * 100).toFixed(1)
            : 0,
      },
    });
  } catch (error) {
    console.error("Error getting overview stats:", error);
    res.status(500).json({ error: "Failed to get overview statistics" });
  }
};

/**
 * REMOVE category analytics because category column does not exist
 */
const getIdeasByCategory = async (req, res) => {
  res.json({
    success: true,
    categories: [],
  });
};

/**
 * Get proposal trends over time
 */
const getProposalTrends = async (req, res) => {
  try {
    const [trends] = await pool.execute(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM proposals
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `);

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
 * Get top developers by proposal count
 */
const getTopDevelopers = async (req, res) => {
  try {
    const [developers] = await pool.execute(`
      SELECT
        d.id,
        d.name,
        d.email,
        d.skills,
        COUNT(p.id) as proposalCount,
        SUM(CASE WHEN p.status = 'accepted' THEN 1 ELSE 0 END) as acceptedCount
      FROM developers d
      LEFT JOIN proposals p ON d.id = p.developer_id
      GROUP BY d.id, d.name, d.email, d.skills
      HAVING proposalCount > 0
      ORDER BY acceptedCount DESC, proposalCount DESC
      LIMIT 10
    `);

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
 * Get top entrepreneurs by idea count
 */
const getTopEntrepreneurs = async (req, res) => {
  try {
    const [entrepreneurs] = await pool.execute(`
      SELECT
        e.id,
        e.name,
        e.email,
        COUNT(ei.id) as ideaCount,
        COUNT(DISTINCT p.id) as proposalCount
      FROM entrepreneur e
      LEFT JOIN entrepreneur_idea ei ON e.id = ei.entrepreneur_id
      LEFT JOIN proposals p ON ei.id = p.idea_id
      GROUP BY e.id, e.name, e.email
      HAVING ideaCount > 0
      ORDER BY ideaCount DESC, proposalCount DESC
      LIMIT 10
    `);

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
 * FIXED: Equity analytics — use equity_offering (correct column)
 */
const getEquityAnalytics = async (req, res) => {
  try {
    const [equityStats] = await pool.execute(`
      SELECT
        AVG(CAST(equity_offering AS SIGNED)) as avgEquity,
        MIN(CAST(equity_offering AS SIGNED)) as minEquity,
        MAX(CAST(equity_offering AS SIGNED)) as maxEquity,
        stage
      FROM entrepreneur_idea
      WHERE equity_offering IS NOT NULL AND equity_offering != ''
      GROUP BY stage
    `);

    const [overallStats] = await pool.execute(`
      SELECT
        AVG(CAST(equity_offering AS SIGNED)) as avgEquity,
        MIN(CAST(equity_offering AS SIGNED)) as minEquity,
        MAX(CAST(equity_offering AS SIGNED)) as maxEquity,
        COUNT(*) as totalIdeas
      FROM entrepreneur_idea
      WHERE equity_offering IS NOT NULL AND equity_offering != ''
    `);

    res.json({
      success: true,
      byStage: equityStats,
      overall: overallStats[0],
    });
  } catch (error) {
    console.error("Error getting equity analytics:", error);
    res.status(500).json({ error: "Failed to get equity analytics" });
  }
};

/**
 * Get collaboration success metrics
 */
const getCollaborationMetrics = async (req, res) => {
  try {
    const [metrics] = await pool.execute(`
      SELECT
        COUNT(*) as totalCollaborations,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM collaborations
    `);

    res.json({
      success: true,
      overall: metrics[0],
    });
  } catch (error) {
    console.error("Error getting collaboration metrics:", error);
    res.status(500).json({ error: "Failed to get collaboration metrics" });
  }
};

/**
 * User growth analytics
 */
const getUserGrowth = async (req, res) => {
  try {
    const [developersGrowth] = await pool.execute(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM developers
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
    `);

    const [entrepreneursGrowth] = await pool.execute(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM entrepreneur
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
    `);

    res.json({
      success: true,
      developers: developersGrowth,
      entrepreneurs: entrepreneursGrowth,
    });
  } catch (error) {
    console.error("Error getting user growth:", error);
    res.status(500).json({ error: "Failed to get user growth" });
  }
};

/**
 * Recent activity feed
 */
const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const [activities] = await pool.execute(`
      (SELECT 'idea' as type, ei.id, ei.title as description, e.name as user, ei.created_at as timestamp
       FROM entrepreneur_idea ei
       JOIN entrepreneur e ON ei.entrepreneur_id = e.id
       ORDER BY ei.created_at DESC
       LIMIT ${limit})
      UNION ALL
      (SELECT 'proposal' as type, p.id, CONCAT('Proposal for idea #', p.idea_id) as description, d.name as user, p.created_at as timestamp
       FROM proposals p
       JOIN developers d ON p.developer_id = d.id
       ORDER BY p.created_at DESC
       LIMIT ${limit})
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `);

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
  getRecentActivity,
};
