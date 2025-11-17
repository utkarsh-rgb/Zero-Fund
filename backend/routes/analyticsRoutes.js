const express = require("express");
const router = express.Router();
const {
  getOverviewStats,
  getIdeasByCategory,
  getProposalTrends,
  getTopDevelopers,
  getTopEntrepreneurs,
  getEquityAnalytics,
  getCollaborationMetrics,
  getUserGrowth,
  getRecentActivity
} = require("../controllers/analyticsController");

// Overview statistics
router.get("/overview", getOverviewStats);

// Ideas by category distribution
router.get("/ideas-by-category", getIdeasByCategory);

// Proposal trends over time
router.get("/proposal-trends", getProposalTrends);

// Top performing developers
router.get("/top-developers", getTopDevelopers);

// Top entrepreneurs
router.get("/top-entrepreneurs", getTopEntrepreneurs);

// Equity distribution analytics
router.get("/equity-analytics", getEquityAnalytics);

// Collaboration success metrics
router.get("/collaboration-metrics", getCollaborationMetrics);

// User growth analytics
router.get("/user-growth", getUserGrowth);

// Recent activity feed
router.get("/recent-activity", getRecentActivity);

module.exports = router;
