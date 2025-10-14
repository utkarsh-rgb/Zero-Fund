const express = require("express");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/dist/spa')));

// For all routes, serve SPA index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/spa', 'index.html'));
});
// Serve uploads folder
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

// ------------------------
// Routes
// ------------------------
const { router: messageRouter, setupSocket } = require('./messages/message');
app.use('/messages', messageRouter);

const forgotPasswordRouter = require("./utils/forgotPassword");
const resetPasswordRouter = require("./utils/resetPassword");
const authRoutes = require("./routes/authRoutes");
const developerRoutes = require("./routes/developerRoutes");
const entrepreneurRoutes = require("./routes/entrepreneurRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const collaborationsRoutes = require("./routes/collaborationsRoutes");
const contractBuilderController = require("./routes/contractBuilderRoutes");
const signedRoutes = require("./routes/signedRoutes");

app.use("/", forgotPasswordRouter);
app.use("/", resetPasswordRouter);
app.use("/", authRoutes);
app.use("/", ideaRoutes);
app.use("/", developerRoutes);
app.use("/", entrepreneurRoutes);
app.use("/", proposalRoutes);
app.use("/", bookmarkRoutes);
app.use("/", notificationRoutes);
app.use("/", collaborationsRoutes);
app.use("/", contractBuilderController);
app.use("/", signedRoutes);

// ------------------------
// HTTP server + Socket.IO
// ------------------------
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Setup Socket.IO events
setupSocket(io);

// ------------------------
// Start server
// ------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
