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
    prompt: Flags.string({ char: "p", description: "Prompt to send" }),
    inputFile: Flags.string({ char: "F", description: "Path to a file containing the question input" }),
    model: Flags.string({ char: "m", description: "OpenAI model", default: "chatgpt-4o-latest" }),
    save: Flags.boolean({ char: "s", description: "Save conversation history automatically" }),
    readHistory: Flags.boolean({ char: "r", description: "Include entire conversation history in context" }),
    interactive: Flags.boolean({ char: "i", description: "Interactively select previous questions for context" }),
    file: Flags.string({ char: "f", description: "Optional file path to save conversation history", default: getHistoryFilePath() }),
  };

  async run() {
    const { flags } = await this.parse(Ask);
    const config = loadConfig();
    const apiKey = config.openai_api_key;

    if (!apiKey) {
      this.error("Missing OpenAI API key. Set it using `claire config -k YOUR_API_KEY`.");
    }

    // Ensure at least one input method is provided
    if (!flags.prompt && !flags.inputFile) {
      this.error("You must provide a prompt using --prompt (-p) or specify an input file using --input-file (-F).");
    }

    let questionParts: string[] = [];

    // Process --prompt if provided
    if (flags.prompt) {
      questionParts.push(`User prompt:\n${flags.prompt.trim()}`);
    }

    // Process --input-file if provided
    if (flags.inputFile) {
      const filePath = path.resolve(flags.inputFile);
      if (!fs.existsSync(filePath)) {
        this.error(`Input file not found: ${filePath}`);
      }
      const fileContent = fs.readFileSync(filePath, "utf-8").trim();
      questionParts.push(`Input file (${filePath}):\n${fileContent}`);
    }

    // Construct the full question
    const question = questionParts.join("\n---\n");

    if (!question) {
      this.error("No valid question provided after processing inputs.");
    }

    let historyFile = flags.file ? path.resolve(flags.file) : getHistoryFilePath();
    let messages = flags.readHistory ? this.loadConversation(historyFile) : [];

    // Interactive mode: Let the user pick specific previous questions
    if (flags.interactive && fs.existsSync(historyFile)) {
      const history = this.loadConversation(historyFile);
      const questions = history
        .map((entry, index) => (entry.role === "user" ? { name: entry.content, value: index } : undefined))
        .filter((entry): entry is { name: string; value: number } => entry !== undefined);

      if (questions.length > 0) {
        const { selectedIndices } = await inquirer.prompt([
          {
            type: "checkbox",
            name: "selectedIndices",
            message: "Select previous questions to include in context:",
            choices: questions,
          },
        ]);

        // Add selected questions and their responses to the context
        for (const index of selectedIndices) {
          messages.push(history[index]);
          const responseIndex = index + 1;
          if (responseIndex < history.length && history[responseIndex].role === "assistant") {
            messages.push(history[responseIndex]);
          }
        }
      }
    }

    // Append user question
    messages.push({ role: "user", content: question });

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

      // Ask user whether to save the conversation unless --save is specified
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
      let existingMessages: { role: string; content: string }[] = [];

      // Load existing conversation history if the file exists
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        existingMessages = JSON.parse(data);
      }

      // Append only new messages (avoid re-saving duplicates)
      existingMessages.push(...messages.slice(-2));

      // Save JSON with correct formatting
      fs.writeFileSync(filePath, JSON.stringify(existingMessages, null, 2), "utf-8");

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