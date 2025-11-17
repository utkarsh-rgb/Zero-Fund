// routes/collaborations.js
const express = require("express");
const router = express.Router();

const { getCollaborations, getDeveloperCollaborations } = require("../controllers/collaborationsController");

// use :entrepreneurId as a route param
router.get("/entrepreneur-collaboration/:entrepreneurId", getCollaborations);
router.get("/developer-collaboration/:developerId", getDeveloperCollaborations);

module.exports = router;
