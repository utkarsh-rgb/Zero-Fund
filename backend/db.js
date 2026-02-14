const mysql = require("mysql2/promise");
require("dotenv").config();

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

// Convert UTC → IST
function convertUTCtoIST(utcValue) {
  const date = new Date(utcValue);

  const ist = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  return (
    "\x1b[35m" +
    ist.toISOString().replace("T", " ").split(".")[0] +
    " IST" +
    "\x1b[0m"
  );
}

// Test connection
(async () => {
  try {
    const [rows] = await pool.query("SELECT UTC_TIMESTAMP() AS currentTime");

    console.log(
      "RDS Connected! Current Time: " + convertUTCtoIST(rows[0].currentTime),
    );
  } catch (err) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "❌ DB Connection Error: " + err.message,
    );
  }
})();

module.exports = pool;
