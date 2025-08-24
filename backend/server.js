const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const db = require("./db");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser")

const authenticateJWT = require("./middleware/authenticateJWT");
require("dotenv").config();

const app = express();
app.use(
  (req, res, next) => {
    console.log("Incoming request:", req.method, req.url, req.body);
    next();
  },
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);


app.use(bodyParser.json());
app.use(express.json());

// Developer signup
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
            res
              .status(201)
              .json({ message: "Developer account created successfully" });
          }
        );
      }
    );
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

    db.query(
      "SELECT * FROM entrepreneur WHERE email = ?",
      [email],
      async (err, result) => {
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
            res
              .status(201)
              .json({ message: "Entrepreneur account created successfully" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login API

app.post("/api/login", (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const table = userType === "developer" ? "developers" : "entrepreneur";

  db.query(
    `SELECT * FROM ${table} WHERE email = ?`,
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0)
        return res.status(400).json({ message: "User not found" });

      try {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ message: "Invalid password" });

        // Generate JWT
        const token = jwt.sign(
          { id: user.id, email: user.email, userType },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({
          message: "Login successful",
          id: user.id,
          fullName: user.fullName || user.name,
          email: user.email,
          userType,
          token,
        });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    }
  );
});
app.get("/developer-profile/:id", authenticateJWT, (req, res) => {
  const { id } = req.params;

  console.log(`⬅️ Fetching profile for userId=${id}`);

  // 1️⃣ Get main developer info
  db.query(
    `SELECT id, fullName, email, bio, location FROM developers WHERE id = ?`,
    [id],
    (err, devResults) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Internal server error", error: err });
      }

      if (devResults.length === 0) {
        return res.status(404).json({ message: "Developer not found" });
      }

      const developer = devResults[0];

      // 2️⃣ Get skills
      db.query(
        `SELECT skill FROM developer_skills WHERE developer_id = ?`,
        [id],
        (err, skillResults) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Failed to fetch skills", error: err });

          developer.skills = skillResults.map((row) => row.skill);

          // 3️⃣ Get social links
          db.query(
            `SELECT platform, url FROM developer_links WHERE developer_id = ?`,
            [id],
            (err, linkResults) => {
              if (err)
                return res
                  .status(500)
                  .json({
                    message: "Failed to fetch social links",
                    error: err,
                  });

              developer.socialLinks = linkResults.map((row) => ({
                platform: row.platform,
                url: row.url,
              }));

              // 4️⃣ Get projects
              db.query(
                `SELECT project_name, project_url, description FROM developer_projects WHERE developer_id = ?`,
                [id],
                (err, projectResults) => {
                  if (err)
                    return res
                      .status(500)
                      .json({
                        message: "Failed to fetch projects",
                        error: err,
                      });

                  developer.projects = projectResults.map((row) => ({
                    project_name: row.project_name,
                    project_url: row.project_url,
                    description: row.description,
                  }));

                  console.log("✅ Profile fetched successfully:", developer);
                  res.json(developer);
                }
              );
            }
          );
        }
      );
    }
  );
});

app.put("/developer-profile/:id", (req, res) => {
  const { id } = req.params;
  const { fullName, email, bio, location, skills, socialLinks, projects } =
    req.body;

  console.log(`⬅️ Received update request for userId=${id}`);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  // 1️⃣ Update main developer info
  const updateDeveloperQuery = `
    UPDATE developers
    SET fullName = ?, email = ?, bio = ?, location = ?
    WHERE id = ?
  `;

  db.query(
    updateDeveloperQuery,
    [fullName, email, bio, location, id],
    (err) => {
      if (err) {
        console.error("❌ Error updating developer table:", err);
        return res
          .status(500)
          .json({ message: "Failed to update developer", error: err });
      }
      console.log("✅ Developer table updated");

      // 2️⃣ Update skills
      db.query(
        `DELETE FROM developer_skills WHERE developer_id = ?`,
        [id],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Failed to delete old skills", error: err });

          if (skills && skills.length) {
            const skillValues = skills.map((skill) => [id, skill]);
            db.query(
              `INSERT INTO developer_skills (developer_id, skill) VALUES ?`,
              [skillValues],
              (err) => {
                if (err)
                  return res
                    .status(500)
                    .json({ message: "Failed to insert skills", error: err });
                updateLinks();
              }
            );
          } else {
            updateLinks();
          }
        }
      );

      // 3️⃣ Update social links
      function updateLinks() {
        db.query(
          `DELETE FROM developer_links WHERE developer_id = ?`,
          [id],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Failed to delete old links", error: err });

            if (socialLinks && socialLinks.length) {
              const linkValues = socialLinks.map((link) => [
                id,
                link.platform,
                link.url,
              ]);
              db.query(
                `INSERT INTO developer_links (developer_id, platform, url) VALUES ?`,
                [linkValues],
                (err) => {
                  if (err)
                    return res
                      .status(500)
                      .json({ message: "Failed to insert links", error: err });
                  updateProjects();
                }
              );
            } else {
              updateProjects();
            }
          }
        );
      }

      // 4️⃣ Update projects
      function updateProjects() {
        db.query(
          `DELETE FROM developer_projects WHERE developer_id = ?`,
          [id],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Failed to delete old projects", error: err });

            if (projects && projects.length) {
              console.log("Projects received:", projects);

              const projectValues = projects.map((p) => [
                id,
                p.project_name,
                p.project_url,
                p.description,
              ]);
              db.query(
                `INSERT INTO developer_projects (developer_id, project_name, project_url, description) VALUES ?`,
                [projectValues],
                (err) => {
                  if (err)
                    return res
                      .status(500)
                      .json({
                        message: "Failed to insert projects",
                        error: err,
                      });
                  return res.json({ message: "Profile updated successfully" });
                }
              );
            } else {
              return res.json({ message: "Profile updated successfully" });
            }
          }
        );
      }
    }
  ); // end updateDeveloperQuery
});

app.post("/forgot-password", (req, res) => {
  console.log("----- Processing Forgot Password -----");

  const { role, email } = req.body;
  console.log("Received Role:", role);
  console.log("Received Email:", email);

  // Check for missing fields
  if (!role || !email) {
    console.log("Error: Missing role or email!");
    return res.status(400).json({ message: "Role and email are required" });
  }

  // Choose table
  const table = role === "developer" ? "developers" : "entrepreneur";
  console.log(`Selected Table: ${table}`);

  const query = `SELECT * FROM ${table} WHERE email = ?`;
  console.log("Executing SQL Query:", query);

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("Database Result:", result);

    if (result.length === 0) {
      console.log("Email not found in database.");
      return res.status(404).json({ message: "Email not registered" });
    }

    // Generate token
    const token = Math.random().toString(36).substring(2, 15);
    console.log("Generated Verification Token:", token);

    // Simulate sending email
    console.log(`Sending verification link to ${email} with token: ${token}`);

    // Response
    console.log("Forgot password process completed successfully.");
    res.json({ message: "Verification link sent to your email!" });
  });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
