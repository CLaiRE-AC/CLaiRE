import { Command, Flags } from "@oclif/core";
import axios, { AxiosError } from "axios";
import inquirer from "inquirer";
import cliSpinners from "cli-spinners"; // Animated status indicator: Maybe remove for cli-ux
import ora from "ora"; // Loading spinner: Maybe remove for cli-ux
import { loadConfig } from "../utils/config.js";
import { formatCodeBlocks } from "../utils/codeFormatter.js";

export default class Ask extends Command {
  static description = "Send a prompt to CLaiRE API and retrieve a response.";

  static flags = {
    prompt: Flags.string({ char: "p", description: "Prompt to send" }),
    inputFile: Flags.string({ char: "F", description: "Path to file(s) containing the question input", multiple: true }),
  };

  static examples = [
    '<%= config.bin %> <%= command.id %> -p "How do I add ActiveAdmin to a Rails 7 app?',
    '<%= config.bin %> <%= command.id %> -p "Refactor this file" -F path/to/src/file.ts',
    '<%= config.bin %> <%= command.id %> -F path/to/input.txt',
    '<%= config.bin %> <%= command.id %> -p "Help me combine these files:" -F path/to/file1.ts -F path/to/file2.ts',
  ]

  async run() {
    const { flags } = await this.parse(Ask);
    const { token: authToken, host: apiHost } = loadConfig().api;
    const { id: projectId } = loadConfig().project;

    if (!authToken) {
      this.error("Missing CLaiRE API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
    }

    if (!projectId) {
      this.error("CLaiRE Project Not Set. Set it using `claire api:project:set`.");
    }

    // Ensure user provides a prompt or input file
    const content = await this.getInitialQuestion(flags);

    // **1️⃣ Submit Question to CLaiRE API**
    try {
      const questionId = await this.submitQuestion(apiHost, authToken, projectId, content);
      if (!questionId) {
        return; // Error already handled inside `submitQuestion`
      }

      // **2️⃣ Fetch API Response with Polling**
      const response = await this.pollForResponse(apiHost, authToken, questionId);

      // **3️⃣ Display Response**
      this.log("\n💡 CLaiRE API Response:");
      this.log(formatCodeBlocks(response));
    } catch (error) {
      this.error(`${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 🎯 Submit the question to CLaiRE API
   */
  private async submitQuestion(apiHost: string, authToken: string, projectId: number, content: string): Promise<number | null> {
    try {
      const response = await axios.post(
        `${apiHost}/api/questions`,
        { question: { project_id: projectId, content } },
        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
      );

      return response.data?.id || null;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      this.error(`❌ ${errorMessage}`);
      return null;
    }
  }

  /**
   * 🎯 Fetch API Response Using Polling Every 3 Seconds
   */
  private async pollForResponse(apiHost: string, authToken: string, questionId: number): Promise<string> {
    const spinner = ora({ text: "🔄 Waiting for response from CLaiRE API...", spinner: cliSpinners.dots }).start();
    const maxRetries = 50;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
        const response = await axios.get(`${apiHost}/api/responses/${questionId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.data?.content) {
          spinner.succeed("✅ Response received!");
          return response.data.content;
        }
      } catch (error: any) {
        const errorMessage = this.extractErrorMessage(error);

        if (error.response?.data?.errors?.includes("Response doesn't exist")) {
          spinner.text = `⏳ Still waiting for CLaiRE API response... [Attempt: ${attempt + 1}/10]`;
        } else {
          spinner.fail(`❌ Error fetching response: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      }

      attempt++;
    }

    spinner.fail("❌ Timed out waiting for CLaiRE API response.");
    throw new Error("No response received from CLaiRE API after multiple attempts.");
  }

  /**
   * 🎯 Extract and return a meaningful error message from API response
   */
  private extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.messages || error.response?.data?.error || error.message || "Unknown API error";
    }
    return error instanceof Error ? error.message : "An unknown error occurred";
  }

  /**
   * 🎯 Get User Input (Prompt and/or File Content)
   */
  private async getInitialQuestion(flags: any): Promise<string> {
    let prompt = flags.prompt ? flags.prompt.trim() : "";
    let fileContents = [];

    if (flags.inputFile && flags.inputFile.length > 0) {
      const fs = await import("fs/promises");

      for (const filePath of flags.inputFile) {
        try {
          const content = (await fs.readFile(filePath, "utf-8")).trim();
          fileContents.push(`📄 **File: ${filePath}**\n${content}`);
        } catch (error) {
          this.error(`❌ Failed to read input file: ${filePath}`);
        }
      }
    }

    let combinedQuestion = prompt;

    if (fileContents.length > 0) {
      combinedQuestion += `\n\n---\n${fileContents.join("\n\n---\n")}`;
    }

    if (combinedQuestion.trim()) return combinedQuestion;

    // Ask for the prompt if nothing is provided
    const { userPrompt } = await inquirer.prompt([
      { type: "input", name: "userPrompt", message: "Please enter a prompt:" },
    ]);

    return userPrompt.trim();
  }
}