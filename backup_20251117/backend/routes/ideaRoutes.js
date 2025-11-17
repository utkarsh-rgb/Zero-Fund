const express = require("express");
const router = express.Router();
const {postIdeaHandler, upload, signNDA,getIdeaById} = require("../controllers/ideaController");


router.post("/post-idea", upload.array("attachments"), postIdeaHandler);
router.put("/ideas/:id/sign-nda",signNDA);
router.get("/ideas/:id", getIdeaById);


module.exports = router;
