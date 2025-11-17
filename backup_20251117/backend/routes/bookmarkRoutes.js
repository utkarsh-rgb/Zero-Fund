const express = require("express");
const router = express.Router();
const {toggleBookmark, totalCount} = require("../controllers/bookmarkController");

router.post("/api/developer-dashboard/bookmarks/toggle",toggleBookmark);
router.get("/api/developer/:developer_id/bookmarks/count",totalCount);
module.exports = router;