const pool = require("../db");

// Get all notifications for a developer
const notificationGet = async (req, res) => {
  const { developerId } = req.params;

  try {
    const [rows] = await pool.execute(
      `SELECT id, developer_id, proposal_id, message, is_read, created_at
       FROM notifications
       WHERE developer_id = ?
       ORDER BY created_at DESC`,
      [developerId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark single notification as read
const markAsRead = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    await pool.execute(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark all notifications as read for a developer
const markAllAsRead = async (req, res) => {
  const { developerId } = req.params;
  console.log(developerId);

  try {
    await pool.execute(`UPDATE notifications SET is_read = 1 WHERE developer_id = ?`, [developerId]);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute(`DELETE FROM notifications WHERE id = ?`, [id]);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  notificationGet,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
