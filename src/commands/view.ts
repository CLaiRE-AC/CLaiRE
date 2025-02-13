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
  };

  async run() {
    const { flags } = await this.parse(View);
    const filePath = getHistoryFilePath(); // Get path from config

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      this.error(`Error: Conversation file not found at ${filePath}`);
    }

    const history: ConversationEntry[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Filter and display content
    history.forEach((entry: ConversationEntry) => {
      if (flags.questionsOnly && entry.role !== "user") return;

      const prefix = entry.role === "user" ? chalk.blue("User:") : chalk.green("Assistant:");
      this.log(`${prefix} ${entry.content}\n`);
    });
  }
}
