const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");

// This line MUST reference the exported function correctly
router.post("/api/developer-dashboard/bookmarks/toggle", bookmarkController.toggleBookmark);

module.exports = router;
