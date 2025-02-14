import db from "./database.js";

interface ConversationEntry {
  id: number;
  timestamp: string;
  user_message: string;
  ai_response: string;
}

interface LogEntry {
  id: number;
  timestamp: string;
  event: string;
  details: string | null;
}

// Insert a conversation history item
export function saveConversation(userMessage: string, aiResponse: string) {
  const stmt = db.prepare(`INSERT INTO conversations (user_message, ai_response) VALUES (?, ?)`);
  stmt.run(userMessage, aiResponse);
}

// Fetch conversation history (latest first)
export function getConversationHistory(limit = 10): ConversationEntry[] {
  const stmt = db.prepare(`SELECT * FROM conversations ORDER BY timestamp DESC LIMIT ?`);
  return stmt.all(limit) as ConversationEntry[];
}

// Insert a log entry
export function saveLog(event: string, details?: string) {
  const stmt = db.prepare(`INSERT INTO logs (event, details) VALUES (?, ?)`);
  stmt.run(event, details || null);
}

// Fetch log entries (latest first)
export function getLogs(limit = 20): LogEntry[] {
  const stmt = db.prepare(`SELECT * FROM logs ORDER BY timestamp DESC LIMIT ?`);
  return stmt.all(limit) as LogEntry[];
}

// Save a source code file into the database
export function saveFile(filePath: string, content: string) {
  const stmt = db.prepare(`INSERT OR REPLACE INTO files (file_path, content) VALUES (?, ?)`);
  stmt.run(filePath, content);
}

// Retrieve file contents
export function getFile(filePath: string) {
  const stmt = db.prepare(`SELECT content FROM files WHERE file_path = ?`);
  return stmt.get(filePath);
}
