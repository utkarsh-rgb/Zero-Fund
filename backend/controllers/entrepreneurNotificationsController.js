// ================================================
// ENTREPRENEUR NOTIFICATIONS CONTROLLER
// ================================================
// Handles notifications for entrepreneurs

const pool = require("../db");

/**
 * Get all notifications for an entrepreneur
 * GET /entrepreneur-notifications/:entrepreneurId
 */
const getEntrepreneurNotifications = async (req, res) => {
  try {
    const { entrepreneurId } = req.params;

    if (!entrepreneurId) {
      return res.status(400).json({ error: "Entrepreneur ID is required" });
    }

    const [notifications] = await pool.execute(
      `SELECT
        id,
        proposal_id,
        contract_id,
        message,
        type,
        is_read,
        created_at
      FROM entrepreneur_notifications
      WHERE entrepreneur_id = ?
      ORDER BY created_at DESC`,
      [entrepreneurId]
    );

    // Get unread count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as unread_count
      FROM entrepreneur_notifications
      WHERE entrepreneur_id = ? AND is_read = FALSE`,
      [entrepreneurId]
    );

    res.json({
      success: true,
      notifications,
      unreadCount: countResult[0].unread_count,
      total: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching entrepreneur notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

/**
 * Mark a notification as read
 * PATCH /entrepreneur-notifications/:id/read
 */
const markEntrepreneurNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      `UPDATE entrepreneur_notifications
      SET is_read = TRUE
      WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

/**
 * Mark all notifications as read for an entrepreneur
 * PATCH /entrepreneur-notifications/read-all/:entrepreneurId
 */
const markAllEntrepreneurNotificationsAsRead = async (req, res) => {
  try {
    const { entrepreneurId } = req.params;

    await pool.execute(
      `UPDATE entrepreneur_notifications
      SET is_read = TRUE
      WHERE entrepreneur_id = ? AND is_read = FALSE`,
      [entrepreneurId]
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

/**
 * Delete a notification
 * DELETE /entrepreneur-notifications/:id
 */
const deleteEntrepreneurNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      `DELETE FROM entrepreneur_notifications WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

/**
 * Create a notification for an entrepreneur
 * (Helper function - called internally)
 */
const createEntrepreneurNotification = async (
  entrepreneurId,
  message,
  type = "general",
  proposalId = null,
  contractId = null
) => {
  try {
    await pool.execute(
      `INSERT INTO entrepreneur_notifications
      (entrepreneur_id, proposal_id, contract_id, message, type)
      VALUES (?, ?, ?, ?, ?)`,
      [entrepreneurId, proposalId, contractId, message, type]
    );
    return { success: true };
  } catch (error) {
    console.error("Error creating entrepreneur notification:", error);
    return { success: false, error };
  }
};

module.exports = {
  getEntrepreneurNotifications,
  markEntrepreneurNotificationAsRead,
  markAllEntrepreneurNotificationsAsRead,
  deleteEntrepreneurNotification,
  createEntrepreneurNotification,
};
