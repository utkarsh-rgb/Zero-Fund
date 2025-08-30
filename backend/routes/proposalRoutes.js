const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposalController");

router.post("/submit-proposal", proposalController.submitProposal);
router.get("/developer-proposals/:developerId", proposalController.getDeveloperProposals);
router.get("/entrepreneur-proposals/:entrepreneurId", proposalController.getEntrepreneurProposals);
router.post("/proposal/:proposalId/status", proposalController.updateProposalStatus);
router.get("/manage-proposals/:ideaId", proposalController.manageProposalsForIdea);

module.exports = router;
