import { Command, Flags } from "@oclif/core";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import os from "os";
import { loadConversation } from "../utils/conversation.js";

export default class View extends Command {
  static description = "View saved questions interactively and display responses.";

  static flags = {
    search: Flags.string({ char: "s", description: "Search for a question containing this keyword" }),
  };

  async run() {
    const { flags } = await this.parse(View);
    const historyData = loadConversation();

    if (historyData.length === 0) {
      this.error("No conversation history found.");
      return;
    }

    // ✅ Extract only user messages
    let questions = historyData
      .map((message, index) => message.role === "user" ? { name: message.content, value: index } : null)
      .filter(Boolean) as { name: string; value: number }[];

    if (flags.search) {
      let query = flags.search || "";
      questions = questions.filter(q => q.name.toLowerCase().includes(query.toLowerCase()));
      if (questions.length === 0) {
        this.log(chalk.yellow(`No questions found containing "${flags.search}".`));
        return;
      }
    }

    if (questions.length === 0) {
      this.log(chalk.red("No questions found."));
      return;
    }

    // ✅ Prompt user to select a question
    const { selectedIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedIndex",
        message: chalk.cyan("Select a question to view its response:"),
        choices: questions,
        pageSize: 10,
      },
    ]);

    const selectedQuestion = historyData[selectedIndex];

    // ✅ Extract assistant responses for the selected question
    let responses: string[] = [];
    for (let i = selectedIndex + 1; i < historyData.length; i++) {
      if (historyData[i].role === "assistant") {
        responses.push(historyData[i].content);
      } else if (historyData[i].role === "user") {
        break; // Stop when a new question appears
      }
    }

    this.log(chalk.blue(`\nQuestion:\n${selectedQuestion.content}\n`));

    if (responses.length > 0) {
      this.log(chalk.green("\nResponse:\n") + responses.join("\n\n") + "\n");
    } else {
      this.log(chalk.yellow("\nNo response found for this question.\n"));
    }
  }
}