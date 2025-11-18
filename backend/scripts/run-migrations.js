// Migration runner script
// Purpose: Apply database migrations for performance improvements
// Usage: node scripts/run-migrations.js

const pool = require("../db");
const fs = require("fs");
const path = require("path");

async function runMigrations() {
  try {
    console.log("🚀 Starting database migrations...\n");

    // Create migrations table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Migrations table ready");

    // Read all migration files
    const migrationsDir = path.join(__dirname, "../migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log("⚠️  No migrations directory found");
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (migrationFiles.length === 0) {
      console.log("⚠️  No migration files found");
      return;
    }

    console.log(`\n📂 Found ${migrationFiles.length} migration file(s)\n`);

    // Apply each migration
    for (const file of migrationFiles) {
      const migrationName = file.replace(".sql", "");

      // Check if migration already applied
      const [rows] = await pool.execute(
        "SELECT * FROM migrations WHERE name = ?",
        [migrationName]
      );

      if (rows.length > 0) {
        console.log(`⏭️  Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`⚙️  Applying ${file}...`);

      // Read migration file
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, "utf8");

      // Split by semicolons to handle multiple statements
      const statements = migrationSQL
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

      // Execute each statement
      for (const statement of statements) {
        if (statement && !statement.startsWith("--")) {
          await pool.execute(statement);
        }
      }

      // Mark migration as applied
      await pool.execute(
        "INSERT INTO migrations (name) VALUES (?)",
        [migrationName]
      );

      console.log(`✓ Applied ${file}`);
    }

    console.log("\n🎉 All migrations completed successfully!");
    console.log("\n💡 Tip: Run ANALYZE TABLE to update query optimizer statistics");

  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations();
