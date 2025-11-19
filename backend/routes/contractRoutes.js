const express = require("express");
const router = express.Router();
const {
  developerSignContract,
  entrepreneurAcceptContract,
  entrepreneurRejectContract,
  getPendingContracts,
  getDeveloperContracts,
} = require("../controllers/contractController");

// Developer actions
router.post("/contracts/developer-sign", developerSignContract);
router.get("/contracts/developer/:developerId", getDeveloperContracts);

// Entrepreneur actions
router.post("/contracts/entrepreneur-accept", entrepreneurAcceptContract);
router.post("/contracts/entrepreneur-reject", entrepreneurRejectContract);
router.get("/contracts/pending/:entrepreneurId", getPendingContracts);

module.exports = router;
