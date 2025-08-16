const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  multipleStatements: true, // allow multiple queries
});

// Connect and setup DB
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
    return;
  }
  console.log("✅ MySQL Connected");

  // Create database if not exists
  db.query("CREATE DATABASE IF NOT EXISTS skill_invest", (err) => {
    if (err) {
      console.error("❌ Error creating database:", err);
      return;
    }
    console.log("✅ Database skill_invest ready");

    // Switch to database
    db.query("USE skill_invest", (err) => {
      if (err) {
        console.error("❌ Error selecting database:", err);
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

module.exports = db;
