const express = require("express");
const router = express.Router();
const {
  getDeveloperProposals,
  getEntrepreneurProposals,
  updateProposalStatus,
  getProposalById,
  submitProposal,
  manageProposal,
  getUniqueDeveloperIds,
  withdrawProposal
} = require("../controllers/proposalController");

// Proposal CRUD operations
router.get("/proposal/:id", getProposalById);
router.post("/submit-proposal", submitProposal);
router.post("/proposal/:proposalId/withdraw", withdrawProposal);

// Get proposals for users
router.get("/developer-proposals/:developerId", getDeveloperProposals);
router.get("/entrepreneur-proposals/:entrepreneurId", getEntrepreneurProposals);

// Update proposal status (accept/reject)
router.post("/proposal/:proposalId/status", updateProposalStatus);

// Manage proposals for an idea
router.get("/manage-proposals/:ideaId", manageProposal);

// Get unique developers who submitted proposals
router.get('/unique-developers', getUniqueDeveloperIds);

module.exports = router;
