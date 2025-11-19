const express = require("express");
const router = express.Router();
const {
  getEntrepreneurNotifications,
  markEntrepreneurNotificationAsRead,
  markAllEntrepreneurNotificationsAsRead,
  deleteEntrepreneurNotification,
} = require("../controllers/entrepreneurNotificationsController");

// Get all notifications for an entrepreneur
router.get("/entrepreneur-notifications/:entrepreneurId", getEntrepreneurNotifications);

// Mark a notification as read
router.patch("/entrepreneur-notifications/:id/read", markEntrepreneurNotificationAsRead);

// Mark all notifications as read
router.patch("/entrepreneur-notifications/read-all/:entrepreneurId", markAllEntrepreneurNotificationsAsRead);

// Delete a notification
router.delete("/entrepreneur-notifications/:id", deleteEntrepreneurNotification);

module.exports = router;
