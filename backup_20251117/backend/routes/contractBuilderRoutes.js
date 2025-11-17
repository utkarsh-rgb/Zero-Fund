const express = require("express");
const router = express.Router();
const { contractDraft, getContractOrProposal,contractDetailsController , getContractWithSections,developerSignContract } = require("../controllers/contractBuilderController");

router.get("/contract-builder", getContractOrProposal);
router.post("/contracts-details", contractDetailsController);
router.post("/contract-draft-save", contractDraft);
router.get("/developer-contract-draft", getContractWithSections);
module.exports = router;
