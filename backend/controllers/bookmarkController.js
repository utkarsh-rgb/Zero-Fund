const pool = require("../db");

const toggleBookmark = async (req, res) => {
  const { developer_id, idea_id, toggle } = req.body;
  if (!developer_id || !idea_id || toggle === undefined)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    if (toggle) {
      await pool.query(
        "INSERT INTO bookmarks (developer_id, idea_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE updated_at=NOW()",
        [developer_id, idea_id]
      );
      return res.json({ message: "Bookmark added" });
    } else {
      await pool.query("DELETE FROM bookmarks WHERE developer_id = ? AND idea_id = ?", [developer_id, idea_id]);
      return res.json({ message: "Bookmark removed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { toggleBookmark };
