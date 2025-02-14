import { Command, Flags } from "@oclif/core";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { getHistoryFilePath } from "../utils/config.js";
import { formatCodeBlocks } from "../utils/codeFormatter.js";
import chalk from "chalk";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationEntry {
  timestamp: string;
  messages: Message[];
}

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

    let historyData: ConversationEntry[];

    try {
      historyData = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
    } catch (error) {
      this.error(`Failed to parse conversation history. Ensure ${historyFile} contains valid JSON.`);
      return;
    }

    // Flattens all user messages while keeping track of their index in the history
    let questions = historyData.flatMap((entry, entryIndex) =>
      entry.messages
        .map((message, messageIndex) =>
          message.role === "user"
            ? {
                name: message.content,
                value: { entryIndex, messageIndex },  // Use both indices to locate responses
              }
            : null
        )
        .filter(Boolean)
    ) as { name: string; value: { entryIndex: number; messageIndex: number } }[];

    if (flags.search) {
      const keyword = flags.search.toLowerCase();
      questions = questions.filter((q) => q.name.toLowerCase().includes(keyword));

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

    const { entryIndex, messageIndex } = selectedIndex;
    const selectedEntry = historyData[entryIndex];
    const selectedMessages = selectedEntry.messages;

    let responses: string[] = [];

    // Collect responses after the selected user message
    for (let i = messageIndex + 1; i < selectedMessages.length; i++) {
      if (selectedMessages[i].role === "assistant") {
        let sanitizedContent = selectedMessages[i].content.replace(/\\(["'])/g, "$1"); // Unescape quotes
        responses.push(sanitizedContent);
      } else if (selectedMessages[i].role === "user") {
        break; // Stop when the next user message is encountered
      }
    }

    const selectedQuestion = questions.find((q) => q.value.entryIndex === entryIndex && q.value.messageIndex === messageIndex);

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