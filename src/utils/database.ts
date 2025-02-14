import Database from "better-sqlite3";
import type { Database as SqliteDatabase } from "better-sqlite3"; // Explicitly import the type
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Handling `__dirname` in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the database file path
const DB_PATH = path.resolve(__dirname, "../../data/claire.db");

// Ensure the database directory exists
const DB_DIR = path.dirname(DB_PATH);
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize SQLite database with an explicit type
const db: SqliteDatabase = new Database(DB_PATH, { verbose: console.log });

// Enable foreign key constraints
db.exec("PRAGMA foreign_keys = ON;");

// Default ESM export
export default db;