
const express = require("express");
const router = express.Router();
const {notificationGet,
  markAsRead,
  markAllAsRead,
  deleteNotification,} = require("../controllers/notificationsController")

router.get("/notifications/:developerId",notificationGet)
router.patch("/notifications/:id/read", markAsRead);
router.patch("/notifications/read-all/:developerId", markAllAsRead);
router.delete("/notifications/:id", deleteNotification);
module.exports = router;
