import fs from "fs";
import path from "path";
import os from "os";
import inquirer from "inquirer";
import chalk from "chalk";

/**
 * Gets the current project name from `project.json`
 */
function getCurrentProject(): string | null {
  const projectFilePath = path.join(os.homedir(), ".claire", "project.json");

  if (fs.existsSync(projectFilePath)) {
    try {
      const projectData = JSON.parse(fs.readFileSync(projectFilePath, "utf-8"));
      return projectData.project_name || null;
    } catch (error) {
      console.warn(`⚠️ Failed to read project.json. Defaulting to history.json.`);
    }
  }
  return null;
}

/**
 * Loads the conversation history for the current project or default history file.
 */
export function loadConversation(): { role: string; content: string }[] {
  const currentProject = getCurrentProject();
  const fileName = currentProject ? `${currentProject}-history.json` : "history.json";
  const filePath = path.join(os.homedir(), ".claire", "logs", fileName);

  if (!fs.existsSync(filePath)) return [];

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const conversations = JSON.parse(data);

    return conversations.flatMap((entry: { messages: { role: string; content: string }[] }) => entry.messages);
  } catch (error) {
    console.warn(`⚠️ Failed to load conversation history from ${filePath}. Starting fresh.`);
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
 * Saves the conversation history to the corresponding project or default file.
 */
export function saveConversation(messages: { role: string; content: string }[]): void {
  const currentProject = getCurrentProject();
  const fileName = currentProject ? `${currentProject}-history.json` : "history.json";
  const filePath = path.join(os.homedir(), ".claire", "logs", fileName);

  let history: { timestamp: string; messages: { role: string; content: string }[] }[] = [];

  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      history = JSON.parse(data);
    } catch (error) {
      console.warn(`⚠️ Failed to load existing conversation history from ${filePath}. Initializing new history.`);
    }
  }

  // Append the new conversation session
  history.push({ timestamp: new Date().toISOString(), messages });

  try {
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2), "utf-8");
    console.log(`✅ Conversation history updated in ${filePath}.`);
  } catch (error) {
    console.warn(`⚠️ Failed to save conversation history to ${filePath}.`);
  }
}

/**
 * Saves a *single* question-response to a `{timestamp}-{index}.json` file inside the project directory.
 */
export function saveQuestion(question: string, response: string): void {
  const projectName = getCurrentProject();

  if (!projectName) {
    console.warn(`⚠️ No active project found. Please set a project before saving.`);
    return;
  }

  // Define project directory
  const projectDir = path.join(os.homedir(), ".claire", "projects", projectName);
  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });

  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/:/g, "-");

  // Count existing `{timestamp}-{index}.json` files
  const existingFiles = fs.readdirSync(projectDir).filter(file => file.match(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\d{3}-\d+\.json$/));
  const index = existingFiles.length + 1;

  // Define file path
  const fileName = `${index}-${timestamp}.json`;
  const filePath = path.join(projectDir, fileName);

  // Create JSON structure
  const questionData = {
    timestamp: new Date().toISOString(),
    question,
    response,
  };

  // Write to file
  try {
    fs.writeFileSync(filePath, JSON.stringify(questionData, null, 2), "utf-8");
    console.log(chalk.green(`✅ Saved question to "${filePath}"`));
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`⚠️ Failed to save detailed question file: ${error.message}`);
    } else {
      console.warn("⚠️ An unknown error occurred while saving the file.");
    }
  }
}