import fs from "fs";
import inquirer from "inquirer";

/**
 * Loads the conversation history from the given file.
 * @param filePath Path to the conversation history file.
 */
export function loadConversation(filePath: string | null): { role: string; content: string }[] {
    if (!filePath || !fs.existsSync(filePath)) return [];

    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const conversations = JSON.parse(data);

      // Flatten all messages across the conversations
      return conversations.flatMap((entry: { messages: { role: string; content: string }[] }) => entry.messages);
    } catch (error) {
      console.warn(`Failed to load conversation history from ${filePath}. Starting fresh.`);
      return [];
    }
  }

/**
 * Prompts the user to confirm whether to save the conversation history.
 */
export async function confirmSaveConversation(): Promise<boolean> {
  const { confirmSave } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmSave",
      message: "Would you like to save this conversation to history?",
      default: true,
    },
  ]);
  return confirmSave;
}

/**
 * Saves the conversation history to the specified file.
 * @param messages The conversation messages to save.
 * @param filePath Path to the conversation history file.
 */
export function saveConversation(messages: { role: string; content: string }[], filePath: string | null): void {
  if (!filePath) return;

  let history: { timestamp: string; messages: { role: string; content: string }[] }[] = [];

  // Load existing history if the file exists
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      history = JSON.parse(data);
    } catch (error) {
      console.warn(`⚠️ Failed to load existing conversation history from ${filePath}. Initializing new history.`);
    }
  }

  // Append the new conversation session with a timestamp
  const newSession = {
    timestamp: new Date().toISOString(),
    messages: messages,
  };
  history.push(newSession);

  try {
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2), "utf-8");
    console.log(`✅ Conversation history updated in ${filePath}.`);
  } catch (error) {
    console.warn(`⚠️ Failed to save conversation history to ${filePath}.`);
  }
}