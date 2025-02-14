import fs from "fs";
import path from "path";
import db from "../utils/database.js";
import { getHistoryFilePath } from "../utils/config.js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationEntry {
  timestamp: string;
  messages: Message[];
}

export function importHistory() {
  const historyFile = getHistoryFilePath();

  if (!fs.existsSync(historyFile)) {
    console.error(`❌ No history file found at ${historyFile}`);
    process.exit(1);
  }

  try {
    const fileData = fs.readFileSync(historyFile, "utf-8");
    const historyData: ConversationEntry[] = JSON.parse(fileData);

    // Prepare insert statement
    const stmt = db.prepare(`
      INSERT INTO conversations (timestamp, user_message, ai_response) VALUES (?, ?, ?)
    `);

    let importedCount = 0;
    historyData.forEach((entry) => {
      let userMessage = "";
      let aiResponse = "";

      entry.messages.forEach((message, index) => {
        if (message.role === "user") {
          userMessage = message.content;
        } else if (message.role === "assistant") {
          aiResponse = message.content;
        }

        // Insert when we have a complete user-assistant pair
        if (userMessage && aiResponse) {
          stmt.run(entry.timestamp, userMessage, aiResponse);
          importedCount++;
          userMessage = ""; // Reset for next conversation
          aiResponse = "";
        }
      });
    });

    console.log(`✅ Successfully imported ${importedCount} conversation entries into the database.`);
  } catch (error) {
    console.error("❌ Error importing history.json:", error);
  }
}

// Run script if executed directly
if (import.meta.url === process.argv[1]) {
  importHistory();
}