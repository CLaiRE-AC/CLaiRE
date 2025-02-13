import { Command, Flags } from "@oclif/core";
import axios, { AxiosError } from "axios";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { loadConfig, getHistoryFilePath } from "../utils/config.js";
import { formatCodeBlocks } from "../utils/codeFormatter.js";

export default class Ask extends Command {
  static description = "Send a prompt to OpenAI and maintain conversation history";

  static flags = {
    prompt: Flags.string({ char: "p", description: "Prompt to send", required: true }),
    model: Flags.string({ char: "m", description: "OpenAI model", default: "chatgpt-4o-latest" }),
    save: Flags.boolean({ char: "s", description: "Save conversation history without prompting" }),
    readHistory: Flags.boolean({ char: "r", description: "Include conversation history in context" }),
    file: Flags.string({ char: "f", description: "Optional file path to save conversation history", default: getHistoryFilePath() }),
  };

  async run() {
    const { flags } = await this.parse(Ask);
    const config = loadConfig();
    const apiKey = config.openai_api_key;

    if (!apiKey) {
      this.error("Missing OpenAI API key. Set it using `claire config -k YOUR_API_KEY`.");
    }

    let historyFile = flags.file ? path.resolve(flags.file) : getHistoryFilePath();
    let messages = flags.readHistory ? this.loadConversation(historyFile) : [];

    messages.push({ role: "user", content: flags.prompt });

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: flags.model,
          messages: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      this.log(formatCodeBlocks(reply));

      // Prompt user to save conversation if not using --save flag
      if (!flags.save) {
        const { confirmSave } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirmSave",
            message: "Would you like to save this conversation to history?",
            default: true,
          },
        ]);

        if (!confirmSave) return;
      }

      // Save conversation
      messages.push({ role: "assistant", content: reply });
      this.saveConversation(messages, historyFile);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private loadConversation(filePath: string | null): { role: string; content: string }[] {
    if (!filePath || !fs.existsSync(filePath)) return [];

    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      this.warn(`Failed to load conversation history from ${filePath}. Starting fresh.`);
      return [];
    }
  }

  private saveConversation(messages: { role: string; content: string }[], filePath: string | null): void {
    if (!filePath) return;

    try {
      fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), "utf-8");
      this.log(`Conversation saved to ${filePath}.`);
    } catch (error) {
      this.warn(`Failed to save conversation history to ${filePath}.`);
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      this.error(`OpenAI API Error: ${errorMessage}`);
    } else if (error instanceof Error) {
      this.error(`Unexpected Error: ${error.message}`);
    } else {
      this.error("An unknown error occurred.");
    }
  }
}
