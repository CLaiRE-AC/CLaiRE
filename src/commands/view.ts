import { Command, Flags } from "@oclif/core";
import fs from "fs";
import chalk from "chalk";
import { getHistoryFilePath } from "../utils/config.js";

type ConversationEntry = {
  role: "user" | "assistant";
  content: string;
};

export default class View extends Command {
  static description = "View conversation history from a saved JSON file.";

  static flags = {
    questionsOnly: Flags.boolean({
      char: "q",
      description: "Show only user questions",
      default: false,
    }),
    last: Flags.integer({
      char: "l",
      description: "Show only the last X number of entries",
      default: undefined,
    }),
  };

  async run() {
    const { flags } = await this.parse(View);
    const filePath = getHistoryFilePath();

    if (!fs.existsSync(filePath)) {
      this.error(`Error: Conversation file not found at ${filePath}`);
    }

    const history: ConversationEntry[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Filter history based on flags
    let filteredHistory = history;

    if (flags.questionsOnly) {
      filteredHistory = filteredHistory.filter((entry) => entry.role === "user");
    }

    if (flags.last !== undefined && flags.last > 0) {
      filteredHistory = filteredHistory.slice(-flags.last);
    }

    // Display the filtered history
    filteredHistory.forEach((entry) => {
      const prefix = entry.role === "user" ? chalk.blue("User:") : chalk.green("Assistant:");
      this.log(`${prefix} ${entry.content}\n`);
    });
  }
}
