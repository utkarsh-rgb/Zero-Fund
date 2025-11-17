const express = require("express");
const router = express.Router();
const {
  analyzeIdea,
  matchDevelopers,
  evaluateProposal,
  getMarketInsights,
  suggestNames
} = require("../controllers/geminiController");

// AI-powered idea analysis
router.post("/analyze-idea", analyzeIdea);

// Developer matching based on skills
router.post("/match-developers", matchDevelopers);

// Proposal evaluation
router.post("/evaluate-proposal", evaluateProposal);

// Market insights and trends
router.post("/market-insights", getMarketInsights);

// Startup name suggestions
router.post("/suggest-names", suggestNames);

module.exports = router;
