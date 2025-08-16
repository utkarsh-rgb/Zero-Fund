const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:8080", 
    credentials: true,
  })
);
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  multipleStatements: true, // allow multiple queries
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
    return;
  }
  console.log("✅ MySQL Connected");

  // Create DB if not exists, then use it
  db.query("CREATE DATABASE IF NOT EXISTS skill_invest", (err) => {
    if (err) {
      console.error("❌ Error creating database:", err);
      return;
    }
    console.log("✅ Database skill_invest ready");

    db.query("USE skill_invest", (err) => {
      if (err) {
        console.error("❌ Error switching to database:", err);
        return;
      }
      console.log("✅ Using database skill_invest");

      // Create Developers table
      db.query(
        `CREATE TABLE IF NOT EXISTS developers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fullName VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) console.error("❌ Error creating developers table:", err);
          else console.log("✅ Developers table ready");
        }
      );

      // Create Entrepreneur table
      db.query(
        `CREATE TABLE IF NOT EXISTS entrepreneur (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) console.error("❌ Error creating entrepreneur table:", err);
          else console.log("✅ Entrepreneur table ready");
        }
      );
    });
  });
});



app.post("/developers/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
      "SELECT * FROM developers WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO developers (fullName, email, password) VALUES (?, ?, ?)",
          [fullName, email, hashedPassword],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Database error" });
            }
            res
              .status(201)
              .json({ message: "Developer account created successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/entrepreneur/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
      "SELECT * FROM entrepreneur WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO entrepreneur (name, email, password) VALUES (?, ?, ?)",
          [fullName, email, hashedPassword],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Database error" });
            }
            res
              .status(201)
              .json({ message: "Entrepreneur account created successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
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

      res.json({ message: "Login successful", userType, fullName: user.fullName });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
