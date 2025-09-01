const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const { getDeveloperProfile, updateDeveloperProfile, developerDashboardById } = require("../controllers/developerController");

router.get("developer/:id", authenticateJWT, getDeveloperProfile);
router.put("developers/:id", authenticateJWT, updateDeveloperProfile);

router.get("/developer-dashboard/:developerId",developerDashboardById) 

module.exports = router;
