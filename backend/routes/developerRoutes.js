const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const { getDeveloperProfile, updateDeveloperProfile } = require("../controllers/developerController");

router.get("developer/:id", authenticateJWT, getDeveloperProfile);
router.put("developers/:id", authenticateJWT, updateDeveloperProfile);

module.exports = router;
