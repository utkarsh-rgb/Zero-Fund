const express = require("express");
const router = express.Router();
const {getDeveloperProposals,getEntrepreneurProposals,updateProposalStatus,getProposalById,submitProposal, manageProposal,getUniqueDeveloperIds} = require("../controllers/proposalController");

router.get("/proposal/:id", getProposalById);
router.post("/submit-proposal", submitProposal);
router.get("/developer-proposals/:developerId", getDeveloperProposals);
router.get("/entrepreneur-proposals/:entrepreneurId", getEntrepreneurProposals);
router.post("/proposal/:proposalId/status",updateProposalStatus);
router.get("/manage-proposals/:ideaId", manageProposal);
router.get('/unique-developers', getUniqueDeveloperIds);
module.exports = router;
