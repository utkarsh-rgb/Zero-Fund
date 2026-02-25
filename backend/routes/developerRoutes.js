const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const {
  getDeveloperProfile,
  updateDeveloperProfile,
  developerDashboardById,
  uploadDeveloperProfile,
  removeProfilePic,
  getDeveloperStats,
  uploadProfilePic,
} = require("../controllers/developerController");
//const upload = require("../middleware/upload"); // 

// Protected routes
router.get("/developer/:id",  getDeveloperProfile);
router.put("/developer/:id", updateDeveloperProfile);
// router.post("/developer/:id/upload",upload.single("profile_pic"),  uploadDeveloperProfile);

router.post(
  "/developer/:id/upload",
  uploadProfilePic.single("profile_pic"),
  uploadDeveloperProfile
);

router.delete("/developer/:id/remove",  removeProfilePic);

router.get("/developer-dashboard/:developerId", developerDashboardById);
router.get("/developer-stats/:developerId", getDeveloperStats);

module.exports = router;
