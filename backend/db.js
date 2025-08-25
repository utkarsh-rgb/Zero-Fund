const mysql = require("mysql2/promise");

async function initDB() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "12345678",
      multipleStatements: true,
    });

    console.log("✅ MySQL Connected");

    // Create database if not exists
    await db.query("CREATE DATABASE IF NOT EXISTS skill_invest");
    console.log("✅ Database skill_invest ready");

    await db.query("USE skill_invest");
    console.log("✅ Using database skill_invest");

    // Developers table
    await db.query(
      `CREATE TABLE IF NOT EXISTS developers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        bio TEXT,
        location VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        profile_pic VARCHAR(500)
      )`
    );
    console.log("✅ Developers table ready");

    // Entrepreneur table
    await db.query(
      `CREATE TABLE IF NOT EXISTS entrepreneur (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    console.log("✅ Entrepreneur table ready");

    // Developer Skills table
    await db.query(
      `CREATE TABLE IF NOT EXISTS developer_skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        developer_id INT,
        skill VARCHAR(50),
        FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE
      )`
    );
    console.log("✅ Developer skills table ready");

    // Developer Links table
    await db.query(
      `CREATE TABLE IF NOT EXISTS developer_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        developer_id INT,
        platform VARCHAR(50),
        url VARCHAR(255),
        FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE
      )`
    );
    console.log("✅ Developer links table ready");

    // Developer Projects table
    await db.query(
      `CREATE TABLE IF NOT EXISTS developer_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        developer_id INT,
        project_name VARCHAR(100),
        project_url VARCHAR(255),
        description TEXT,
        FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE
      )`
    );
    console.log("✅ Developer projects table ready");

    return db;
  } catch (err) {
    console.error("❌ DB Initialization Error:", err);
    process.exit(1);
  }
}

// Export a promise connection
module.exports = initDB();
