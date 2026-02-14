const express = require("express");
const router = express.Router();
const pool = require("../db");

// ============================================
// GET OLD MESSAGES (Load chat history)
// ============================================
router.get("/messages/:contractId", async (req, res) => {
  const { contractId } = req.params;

  try {
    const [messages] = await pool.query(
      `SELECT id, contract_id, sender_id, message, created_at
       FROM messages
       WHERE contract_id = ?
       ORDER BY created_at ASC`,
      [contractId]
    );

    res.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


// ============================================
// GET USER CHAT CONTRACTS
// ============================================
router.get("/chat-list/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
const [contracts] = await pool.query(
  `SELECT c.id,
          c.project_title,
          c.entrepreneur_id,
          c.developer_id,
          e.fullName AS entrepreneur_name,
          d.fullName AS developer_name
   FROM contracts c
   JOIN entrepreneur e ON c.entrepreneur_id = e.id
   JOIN developers d ON c.developer_id = d.id
   WHERE (c.entrepreneur_id = ? OR c.developer_id = ?)
   AND c.signed_by_developer = 1
   AND c.signed_by_entrepreneur = 1`,
  [userId, userId]
);

    res.json({ success: true, contracts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ============================================
// SOCKET SETUP
// ============================================
function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // ================================
    // JOIN ROOM (SECURE VERSION)
    // ================================
    socket.on("join_room", async ({ contractId, userId }) => {
      try {
        const [contracts] = await pool.query(
          `SELECT id 
           FROM contracts 
           WHERE id = ?
           AND (entrepreneur_id = ? OR developer_id = ?)`,
          [contractId, userId, userId]
        );

        if (contracts.length === 0) {
          console.log("❌ Unauthorized room access attempt");
          return socket.emit("error_message", "Unauthorized access");
        }

        socket.join(`contract_${contractId}`);
        console.log(`✅ User ${userId} joined contract_${contractId}`);

      } catch (error) {
        console.error("Join room error:", error);
      }
    });

    // ================================
    // SEND MESSAGE
    // ================================
    socket.on("send_message", async (data) => {
      const { contractId, senderId, message } = data;

      try {
        // Save to DB
        const [result] = await pool.query(
          `INSERT INTO messages (contract_id, sender_id, message)
           VALUES (?, ?, ?)`,
          [contractId, senderId, message]
        );

        const messagePayload = {
          id: result.insertId,
          contractId,
          senderId,
          message,
          created_at: new Date(),
        };

        // Emit only to that contract room
        io.to(`contract_${contractId}`).emit(
          "receive_message",
          messagePayload
        );

      } catch (error) {
        console.error("❌ Message save error:", error);
      }
    });

    // ================================
    // DISCONNECT
    // ================================
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

module.exports = { router, setupSocket };
