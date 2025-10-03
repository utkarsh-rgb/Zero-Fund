const express = require("express");
const router = express.Router();
const {entrepreneurDashboard, entrepreneurDeleteIdea,entrepreneurProfileUpdate, entrepreneurIdea, entrepreneurUpdateIdea, entrepreneurProfile} = require("../controllers/entrepreneurController");

router.get("/entrepreneur-dashboard", entrepreneurDashboard);
router.delete("/entrepreneur-dashboard/ideas/:id", entrepreneurDeleteIdea);
router.get("/entrepreneur-dashboard/ideas/:id", entrepreneurIdea);
router.put("/entrepreneur-dashboard/ideas/:id",entrepreneurUpdateIdea);
router.put("/entrepreneur/:id",entrepreneurProfileUpdate);
router.get("/entrepreneur/:id",entrepreneurProfile);


module.exports = router;

