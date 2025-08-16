const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());

// Developer signup
app.post("/developers/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    db.query("SELECT * FROM developers WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO developers (fullName, email, password) VALUES (?, ?, ?)",
        [fullName, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error" });
          res.status(201).json({ message: "Developer account created successfully" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Entrepreneur signup
app.post("/entrepreneur/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    db.query("SELECT * FROM entrepreneur WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO entrepreneur (name, email, password) VALUES (?, ?, ?)",
        [fullName, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error" });
          res.status(201).json({ message: "Entrepreneur account created successfully" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const table = userType === "developer" ? "developers" : "entrepreneur";

    db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0) return res.status(400).json({ message: "User not found" });

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({
  message: "Login successful",
  id: user.id,
  fullName: user.fullName || user.name,
  email: user.email,
  userType,
  token: "dummy-token-or-generate-jwt-here"
});
 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/developer-profile/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT fullName,email FROM developers WHERE id = ?`;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        message: 'Internal server error' 
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ 
        message: 'Developer not found' 
      });
    }
    res.json(results[0]);
    
  });
});


app.listen(5000, () => console.log("🚀 Server running on port 5000"));
