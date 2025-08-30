const express = require("express");
const router = express.Router();
const {postIdeaHandler, upload} = require("../controllers/ideaController");


router.post("/post-idea", upload.array("attachments"), postIdeaHandler);


module.exports = router;
