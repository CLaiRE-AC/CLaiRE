import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_PATH = path.join(os.homedir(), ".claire.json");

export type ConfigData = {
  openai_api_key?: string;
  email?: string;
};

/**
 * Load existing config or return an empty object.
 */
export function loadConfig(): ConfigData {
  if (!fs.existsSync(CONFIG_PATH)) return {};
  
  try {
    const data = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("⚠️ Failed to read config file.");
    return {};
  }
}

/**
 * Save or update config values.
 */
export function saveConfig(newData: Partial<ConfigData>): void {
  const existingConfig = loadConfig();
  const updatedConfig = { ...existingConfig, ...newData };

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updatedConfig, null, 2), "utf-8");
    console.log("✅ Configuration saved.");
  } catch (error) {
    console.error("❌ Failed to save configuration.");
  }
}

