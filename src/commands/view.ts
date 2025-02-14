import { Command, Flags } from "@oclif/core";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { getHistoryFilePath } from "../utils/config.js";
import { formatCodeBlocks } from "../utils/codeFormatter.js";
import chalk from "chalk";

export default class View extends Command {
  static description = "View saved questions interactively and display responses.";

  static flags = {
    file: Flags.string({
      char: "f",
      description: "Path to conversation history file",
      default: getHistoryFilePath(),
    }),
    search: Flags.string({
      char: "s",
      description: "Search for a question containing this keyword",
    }),
  };

  async run() {
    const { flags } = await this.parse(View);
    const historyFile = flags.file ? path.resolve(flags.file) : getHistoryFilePath();

    if (!fs.existsSync(historyFile)) {
      this.error(`No conversation history found at ${historyFile}.`);
    }

    const data = JSON.parse(fs.readFileSync(historyFile, "utf-8"));

    let questions = data
      .map((entry: any, index: number) => (entry.role === "user" ? { name: entry.content, value: index } : null))
      .filter(Boolean);

    if (flags.search) {
      const keyword = flags.search.toLowerCase();
      questions = questions.filter((q: { name: string }) =>
        q.name.toLowerCase().includes(keyword)
      );

      if (questions.length === 0) {
        this.log(chalk.yellow(`No questions found containing keyword: "${flags.search}".`));
        return;
      }
    }

    if (questions.length === 0) {
      this.log(chalk.red("No questions found in the conversation history."));
      return;
    }

    const { selectedIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedIndex",
        message: chalk.cyan("Select a question to view its response:"),
        choices: questions,
        pageSize: 10, // Optimized user experience
      },
    ]);

    let responses: string[] = [];

    // ✅ Fix: Sanitize escaped quotes.
    for (let i = selectedIndex + 1; i < data.length; i++) {
      if (data[i].role === "assistant") {
        let sanitizedContent = data[i].content.replace(/\\"/g, '"'); // Unescape quotes
        responses.push(sanitizedContent);
      } else if (data[i].role === "user") {
        break; // Stop collecting when we hit the next user message
      }
    }

    const selectedQuestion = questions.find((q: { name: string; value: number }) => q.value === selectedIndex);

    if (selectedQuestion) {
      this.log(chalk.blue(`\nQuestion:\n${selectedQuestion.name}\n`));
    } else {
      this.log(chalk.red("Error: Selected question not found."));
    }

    if (responses.length > 0) {
      this.log(chalk.green("\nResponse:\n") + formatCodeBlocks(responses.join("\n\n")) + "\n");
    } else {
      this.log(chalk.yellow("\nNo response found for this question. The conversation may have been incomplete.\n"));
    }
  }
}