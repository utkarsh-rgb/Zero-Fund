const express = require("express");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// ------------------------
// Initialize app
// ------------------------
const app = express();

// ------------------------
// Allowed Origins (VERY IMPORTANT)
// ------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "https://zero-fund-frontend.onrender.com",
  "https://zerofundventure.com",
  "https://www.zerofundventure.com",
];

// ------------------------
// CORS (MOBILE SAFE)
// ------------------------
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl / mobile
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ------------------------
// Middleware
// ------------------------
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// Serve SPA frontend
// ------------------------
const spaPath = path.join(__dirname, "../frontend/dist/spa");
app.use(express.static(spaPath));

// ------------------------
// Uploads folder
// ------------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// ------------------------
// Routes
// ------------------------
const { router: messageRouter, setupSocket } = require("./messages/message");
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
const contractBuilderRoutes = require("./routes/contractBuilderRoutes");
const contractRoutes = require("./routes/contractRoutes");
const signedRoutes = require("./routes/signedRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const verificationRoutes = require("./routes/verificationRoutes");

// Apply API routes
app.use("/messages", messageRouter);
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
app.use("/", contractBuilderRoutes);
app.use("/", contractRoutes);
app.use("/", signedRoutes);
app.use("/ai", geminiRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/", verificationRoutes);


// ------------------------
// HTTP Server + Socket.IO
// ------------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

setupSocket(io);

// ------------------------
// Start server
// ------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
