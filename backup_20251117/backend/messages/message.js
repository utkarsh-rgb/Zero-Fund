const express = require('express');
const router = express.Router();
const pool = require('../db'); // your MySQL pool connection

// ---------------------
// REST API
// ---------------------

// GET unique entrepreneurs who sent messages to a developer
router.get('/unique-entrepreneurs', async (req, res) => {
  const { developer_id } = req.query;
  console.log(req.query);
  console.log(developer_id);
  
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT sender_id AS entrepreneur_id 
       FROM messages 
       WHERE receiver_type = 'developer' AND receiver_id = ? AND sender_type = 'entrepreneur'`,
      [developer_id]
    );
    const entrepreneurIds = rows.map(row => row.entrepreneur_id);
    res.json({ entrepreneurIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fetch chat history between entrepreneur and developer
router.get('/:sender_type/:sender_id/:receiver_type/:receiver_id', async (req, res) => {
  const { sender_type, sender_id, receiver_type, receiver_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_type=? AND sender_id=? AND receiver_type=? AND receiver_id=?)
          OR (sender_type=? AND sender_id=? AND receiver_type=? AND receiver_id=?)
       ORDER BY timestamp ASC`,
      [
        sender_type, sender_id, receiver_type, receiver_id,
        receiver_type, receiver_id, sender_type, sender_id
      ]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Save message via REST API (optional)
router.post('/', async (req, res) => {
  const { sender_type, sender_id, receiver_type, receiver_id, message } = req.body;
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  try {
    await pool.query(
      'INSERT INTO messages (sender_type, sender_id, receiver_type, receiver_id, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
      [sender_type, sender_id, receiver_type, receiver_id, message, timestamp]
    );
    res.status(201).json({ success: true, timestamp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------
// Socket.IO
// ---------------------

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    // Join personal room
    socket.on('join', ({ type, id }) => {
      socket.join(`${type}_${id}`);
      console.log(`User joined room: ${type}_${id}`);
    });

    // Send message
    socket.on('sendMessage', async (data) => {
      const { sender_type, sender_id, receiver_type, receiver_id, message } = data;
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      try {
        // Save message
        await pool.query(
          'INSERT INTO messages (sender_type, sender_id, receiver_type, receiver_id, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
          [sender_type, sender_id, receiver_type, receiver_id, message, timestamp]
        );

        const messageWithTimestamp = { ...data, timestamp };

        // Emit to receiver room
        io.to(`${receiver_type}_${receiver_id}`).emit('newMessage', messageWithTimestamp);
        // Emit to sender room
        io.to(`${sender_type}_${sender_id}`).emit('newMessage', messageWithTimestamp);

        console.log(`Message sent from ${sender_type}_${sender_id} to ${receiver_type}_${receiver_id}`);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = { router, setupSocket };
