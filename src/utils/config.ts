import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_FILE = path.join(os.homedir(), ".claire", "config.json");

export type ConfigData = {
  openai_api_key?: string;
  email?: string;
  history_file?: string;
};

/**
 * Load existing config or return an empty object.
 */
export function loadConfig(): Record<string, any> {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return {};
  }
}

/**
 * Save configuration
 */
export function saveConfig(newConfig: Record<string, any>) {
  const config = { ...loadConfig(), ...newConfig };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Get the conversation history file path
 */
export function getHistoryFilePath(): string {
  const config = loadConfig();
  return path.join(os.homedir(), ".claire", config.history_file) || path.join(os.homedir(), ".claire", "history.json");
}

/**
 * Set the conversation history file path
 */
export function setHistoryFilePath(fileName: string) {
  saveConfig({ history_file: fileName });
}

