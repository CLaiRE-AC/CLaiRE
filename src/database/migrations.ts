import db from "../utils/database.js";

export function setupDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      user_message TEXT NOT NULL,
      ai_response TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      details TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL
    );
  `);

  console.log("✅ Database setup completed.");
}

// ✅ Use `import.meta.url` in ESM to check if this file is executed directly
if (import.meta.url === process.argv[1]) {
  setupDatabase();
}