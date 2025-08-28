const mysql = require("mysql2/promise");


    const pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "12345678",
      database: "skill_invest",
      waitForConnections: true,
      connectionLimit: 10, // adjust as needed
      queueLimit: 0,
      multipleStatements: true,
    });

    console.log("✅ MySQL Pool Created");

module.exports = pool

