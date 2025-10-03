const express = require("express");
const router = express.Router();
const {
  developerSignedContract,
  entrepreneurAcceptContract,
  getPendingContracts,
  entrepreneurRejectContract,
} = require("../controllers/SignedController");

// Developer signs a contract
router.put("/developer-sign-contract", developerSignedContract);

// Entrepreneur accepts a contract signed by developer
router.post("/entrepreneur-accept-contract", entrepreneurAcceptContract);
router.post("/entrepreneur-reject-contract", entrepreneurRejectContract);


// Get pending contracts for an entrepreneur (POST)
router.post("/entrepreneur/pending-contracts", getPendingContracts);

module.exports = router;
