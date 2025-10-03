// fetch_image.js
import mysql from 'mysql2/promise'; // mysql2 with promise support
import fs from 'fs';

// Async IIFE to use await at top-level
(async () => {
  try {
    // MySQL connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',           // your MySQL username
      password: '12345678', // your MySQL password
      database: 'skill_invest'
    });

    const id = 1; // id of the entrepreneur
    const [rows] = await connection.execute(
      'SELECT profile_pic FROM entrepreneur WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      console.log('No image found for this id.');
      await connection.end();
      return;
    }

    const imageData = rows[0].profile_pic; // BLOB column

    // Save image
    fs.writeFileSync('Ritul_from_db.png', imageData);
    console.log('Image saved as Ritul_from_db.png');

    await connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
})();
