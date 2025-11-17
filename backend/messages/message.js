const express = require('express');
const router = express.Router();
const pool = require('../db'); // your MySQL pool connection
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-cbc';

// Encrypt message
function encryptMessage(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt message
function decryptMessage(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

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

// Fetch chat history between entrepreneur and developer (with decryption)
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

    // Decrypt messages before sending
    const decryptedMessages = rows.map(msg => ({
      ...msg,
      message: msg.message ? decryptMessage(msg.message) : msg.message
    }));

    res.json(decryptedMessages);
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
// Socket.IO with Authentication & Encryption
// ---------------------

// Store online users
const onlineUsers = new Map(); // Map of user_id -> socket_id
const typingUsers = new Map(); // Map of room -> set of typing users

const setupSocket = (io) => {
  // Middleware for Socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = verified;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user?.userType}_${socket.user?.id}`);

    // Join personal room
    socket.on('join', ({ type, id }) => {
      const roomId = `${type}_${id}`;
      socket.join(roomId);

      // Mark user as online
      onlineUsers.set(`${type}_${id}`, socket.id);

      // Broadcast online status
      io.emit('userOnline', { type, id, online: true });

      console.log(`👤 User joined room: ${roomId}`);
    });

    // Send message with encryption
    socket.on('sendMessage', async (data) => {
      const { sender_type, sender_id, receiver_type, receiver_id, message } = data;
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      try {
        // Encrypt message before saving
        const encryptedMessage = encryptMessage(message);

        // Save encrypted message to database
        const [result] = await pool.query(
          'INSERT INTO messages (sender_type, sender_id, receiver_type, receiver_id, message, timestamp, is_read) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [sender_type, sender_id, receiver_type, receiver_id, encryptedMessage, timestamp, 0]
        );

        // Send decrypted message to clients
        const messageWithTimestamp = {
          ...data,
          id: result.insertId,
          timestamp,
          is_read: false
        };

        // Emit to receiver room
        io.to(`${receiver_type}_${receiver_id}`).emit('newMessage', messageWithTimestamp);
        // Emit to sender room
        io.to(`${sender_type}_${sender_id}`).emit('newMessage', messageWithTimestamp);

        // Send delivery confirmation
        socket.emit('messageDelivered', { tempId: data.tempId, id: result.insertId });

        console.log(`📨 Encrypted message sent from ${sender_type}_${sender_id} to ${receiver_type}_${receiver_id}`);
      } catch (err) {
        console.error('❌ Error saving message:', err);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ sender_type, sender_id, receiver_type, receiver_id, isTyping }) => {
      const roomKey = `${sender_type}_${sender_id}_${receiver_type}_${receiver_id}`;

      if (isTyping) {
        if (!typingUsers.has(roomKey)) {
          typingUsers.set(roomKey, new Set());
        }
        typingUsers.get(roomKey).add(`${sender_type}_${sender_id}`);
      } else {
        if (typingUsers.has(roomKey)) {
          typingUsers.get(roomKey).delete(`${sender_type}_${sender_id}`);
        }
      }

      // Notify receiver
      io.to(`${receiver_type}_${receiver_id}`).emit('userTyping', {
        sender_type,
        sender_id,
        isTyping
      });
    });

    // Message read receipt
    socket.on('markAsRead', async ({ message_id, receiver_type, receiver_id }) => {
      try {
        await pool.query(
          'UPDATE messages SET is_read = 1 WHERE id = ?',
          [message_id]
        );

        // Notify sender that message was read
        socket.broadcast.to(`${receiver_type}_${receiver_id}`).emit('messageRead', { message_id });
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      // Remove from online users
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          const [type, id] = userId.split('_');
          io.emit('userOnline', { type, id, online: false });
          console.log(`❌ User disconnected: ${userId}`);
          break;
        }
      }
    });
  });
};

module.exports = { router, setupSocket };
