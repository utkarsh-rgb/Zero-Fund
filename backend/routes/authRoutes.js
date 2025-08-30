const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/developer/signup",authController.developerSignup);
router.post("/entrepreneur/signup",authController.entrepreneurSignup);
router.post("/api/login",authController.login);


module.exports = router;
