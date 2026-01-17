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
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ["http://localhost:8080", "http://localhost:3000", "https://zero-fund-frontend.onrender.com"];

app.use(
  cors({
    origin: allowedOrigins,
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
const entrepreneurNotificationRoutes = require("./routes/entrepreneurNotificationRoutes");
const collaborationsRoutes = require("./routes/collaborationsRoutes");
const contractBuilderController = require("./routes/contractBuilderRoutes");
const contractRoutes = require("./routes/contractRoutes");
const signedRoutes = require("./routes/signedRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const verificationRoutes = require("./routes/verificationRoutes");

// Apply routes
app.use("/", forgotPasswordRouter);
app.use("/", resetPasswordRouter);
app.use("/", authRoutes);
app.use("/", ideaRoutes);
app.use("/", developerRoutes);
app.use("/", entrepreneurRoutes);
app.use("/", proposalRoutes);
app.use("/", bookmarkRoutes);
app.use("/", notificationRoutes);
app.use("/", entrepreneurNotificationRoutes);
app.use("/", collaborationsRoutes);
app.use("/", contractBuilderController);
app.use("/", contractRoutes);
app.use("/", signedRoutes);
app.use("/ai", geminiRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/", verificationRoutes);

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
// 4️⃣ (Optional) redirect everything else
app.use((req, res) => {
  res.redirect(302, "https://zerofundventure.com");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
