import { Command, Flags } from "@oclif/core";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { getHistoryFilePath } from "../utils/config.js";
import { formatCodeBlocks } from "../utils/codeFormatter.js";

export default class View extends Command {
  static description = "View saved questions interactively and display responses.";

  static flags = {
    file: Flags.string({ char: "f", description: "Path to conversation history file", default: getHistoryFilePath() }),
  };

  async run() {
    const { flags } = await this.parse(View);
    const historyFile = flags.file ? path.resolve(flags.file) : getHistoryFilePath();

    if (!fs.existsSync(historyFile)) {
      this.error(`No conversation history found at ${historyFile}.`);
    }

    const data = JSON.parse(fs.readFileSync(historyFile, "utf-8"));

    const questions = data
      .map((entry: any, index: number) => (entry.role === "user" ? { name: entry.content, value: index } : null))
      .filter(Boolean);

    if (questions.length === 0) {
      this.log("No questions found in the conversation history.");
      return;
    }

    const { selectedIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedIndex",
        message: "Select a question to view its response:",
        choices: questions,
        pageSize: 10, // Allows scrolling
      },
    ]);

    // Find the next "assistant" response after the selected question
    let response = "No response found.";
    for (let i = selectedIndex + 1; i < data.length; i++) {
      if (data[i].role === "assistant") {
        response = data[i].content;
        break;
      } else if (data[i].role === "user") {
        break; // Stop searching if another user entry is found
      }
    }

    this.log(`\nResponse:\n${formatCodeBlocks(response)}\n`);
  }
}
