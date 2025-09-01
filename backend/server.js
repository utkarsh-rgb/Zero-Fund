const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Routers
const forgotPasswordRouter = require("./utils/forgotPassword");
const resetPasswordRouter = require("./utils/resetPassword");
const authRoutes = require("./routes/authRoutes");
const developerRoutes = require("./routes/developerRoutes");
const entrepreneurRoutes = require("./routes/entrepreneurRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/", forgotPasswordRouter);
app.use("/", resetPasswordRouter);
app.use("/", authRoutes);
app.use("/", ideaRoutes);
app.use("/", developerRoutes);
app.use("/", entrepreneurRoutes);
app.use("/", proposalRoutes);
app.use("/",bookmarkRoutes);
app.use("/",notificationRoutes);








// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
