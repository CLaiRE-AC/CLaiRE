import { Command, Flags } from "@oclif/core";
import axios, { AxiosError } from "axios";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { loadConfig } from "../utils/config.js";
import { formatCodeBlocks } from "../utils/codeFormatter.js";
import { loadConversation, saveConversation, saveQuestion, postConversationToAPI } from "../utils/conversation.js"; // ✅ Updated import

export default class Ask extends Command {
  static description = "Send a prompt to OpenAI and maintain conversation history, with optional follow-ups.";

  static flags = {
    prompt: Flags.string({ char: "p", description: "Prompt to send" }),
    inputFile: Flags.string({ char: "F", description: "Path to a file containing the question input" }),
    model: Flags.string({ char: "m", description: "OpenAI model", default: "chatgpt-4o-latest" }),
    nocontext: Flags.boolean({ description: "Bypass reading project conversation history" }),
    interactive: Flags.boolean({ char: "i", description: "Interactively select previous questions for context" }),
    api: Flags.boolean({ description: "Save question and response to CLaiRE Rails API" }),
    apiHost: Flags.string({ char: "h", description: "Hostname for CLaiRE Rails API", default: "http://localhost:3000" })
  };

  async run() {
    const { flags } = await this.parse(Ask);
    const config = loadConfig();
    const apiKey = config.openai_api_key;

    if (!apiKey) {
      this.error("Missing OpenAI API key. Set it using `claire config -k YOUR_API_KEY`.");
    }

    if (!flags.prompt && !flags.inputFile) {
      this.error("You must provide a prompt using --prompt (-p) or specify an input file using --input-file (-F).");
    }

    let messages = flags.nocontext ? [] : loadConversation();

    if (flags.interactive) {
      messages = await this.interactiveHistorySelection(messages);
    }

    let question = await this.getInitialQuestion(flags);
    messages.push({ role: "user", content: question });

    while (true) {
      const trimmedMessages = this.truncateHistory(messages);
      const response = await this.getAIResponse(trimmedMessages, apiKey, flags.model);
      this.log(formatCodeBlocks(response));
      messages.push({ role: "assistant", content: response });

      saveQuestion(question, response);

      // Post to CLaiRE API
      if (flags.api) {
        await postConversationToAPI(question, response, flags.apiHost);
      }

      const { followUp } = await inquirer.prompt([
        {
          type: "confirm",
          name: "followUp",
          message: "Would you like to ask a follow-up question?",
          default: false,
        },
      ]);

      if (!followUp) break;

      const { followUpQuestion } = await inquirer.prompt([
        {
          type: "input",
          name: "followUpQuestion",
          message: "Enter your follow-up question:",
        },
      ]);

      messages.push({ role: "user", content: followUpQuestion.trim() });
    }

    saveConversation(messages);
  }

  private async getInitialQuestion(flags: any): Promise<string> {
    let questionParts: string[] = [];

    if (flags.prompt) {
      questionParts.push(`Prompt:\t${flags.prompt.trim()}`);
    }

    if (flags.inputFile) {
      const filePath = path.resolve(flags.inputFile);
      if (!fs.existsSync(filePath)) {
        this.error(`Input file not found: ${filePath}`);
      }
      const fileContent = fs.readFileSync(filePath, "utf-8").trim();
      questionParts.push(`Input file:\t(${filePath}):\n${fileContent}`);
    }

    const question = questionParts.join("\n---\n");
    if (!question) {
      this.error("No valid question provided after processing inputs.");
    }

    return question;
  }

  private async interactiveHistorySelection(messages: any[]) {
    const history = loadConversation();
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

      for (const index of selectedIndices) {
        messages.push(history[index]);
        const responseIndex = index + 1;
        if (responseIndex < history.length && history[responseIndex].role === "assistant") {
          messages.push(history[responseIndex]);
        }
      }
    }

    return messages;
  }

  private async getAIResponse(messages: any[], apiKey: string, model: string): Promise<string> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: model,
          messages: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: unknown) {
      this.handleError(error);
      return "An error occurred while fetching a response.";
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error?.message || error.message;

      if (status === 429) {
        this.error(`Rate limit exceeded: ${errorMessage}. Try again later.`);
      } else if (status === 401) {
        this.error(`Unauthorized: Check if your API key is valid.`);
      } else {
        this.error(`OpenAI API Error (Status ${status}): ${errorMessage}`);
      }
    } else if (error instanceof Error) {
      this.error(`Unexpected Error: ${error.message}`);
    } else {
      this.error("An unknown error occurred.");
    }
  }

  private truncateHistory(messages: { role: string; content: string }[], maxTokens = 4096): { role: string; content: string }[] {
    let totalTokens = 0;

    // Traverse messages backwards and include only allowed context
    const truncated: { role: string; content: string }[] = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokenCount = message.content.split(" ").length; // Approximate token estimation

      if (totalTokens + tokenCount > maxTokens) break;
      totalTokens += tokenCount;
      truncated.unshift(message);
    }

    return truncated;
  }

  private safeReadHistory(filePath: string): { role: string; content: string }[] {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as { role: string; content: string }[];
    } catch (error) {
      this.warn(`Could not read history file. Resetting history.`);
      return [];
    }
  }
}