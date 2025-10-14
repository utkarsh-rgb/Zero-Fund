// const mysql = require("mysql2/promise");


//     const pool = mysql.createPool({
//       host: "localhost",
//       user: "root",
//       password: "12345678",
//       database: "skill_invest",
//       waitForConnections: true,
//       connectionLimit: 10, // adjust as needed
//       queueLimit: 0,
//       multipleStatements: true,
//     });

//     console.log("✅ MySQL Pool Created");

// module.exports = pool

const mysql = require("mysql2/promise");
require("dotenv").config(); // Load .env variables

// --- Create MySQL connection pool ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

console.log("✅ MySQL RDS Pool Created");

// --- Test Connection ---
(async () => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");
    console.log("RDS Connected! Current Time:", rows[0].currentTime);
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
})();

module.exports = pool;
