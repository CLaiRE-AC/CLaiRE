import { Command, Flags } from "@oclif/core";
import axios, { AxiosError } from "axios";
import inquirer from "inquirer";
import cliSpinners from "cli-spinners"; // Animated status indicator
import ora from "ora"; // Loading spinner
import { loadConfig } from "../utils/config.js";
import { loadConversation, saveConversation, saveQuestion } from "../utils/conversation.js";

export default class Ask extends Command {
  static description = "Send a prompt to Claire API and retrieve a response.";

  static flags = {
    prompt: Flags.string({ char: "p", description: "Prompt to send" }),
    inputFile: Flags.string({ char: "F", description: "Path to a file containing the question input" }),
    model: Flags.string({ char: "m", description: "Claire API model selection", default: "default-model" }),
    nocontext: Flags.boolean({ description: "Bypass reading project conversation history" }),
    interactive: Flags.boolean({ char: "i", description: "Interactively select previous questions for context" }),
    apiHost: Flags.string({ char: "h", description: "Hostname for Claire API", default: "http://localhost:3000" }),
  };

  async run() {
    const { flags } = await this.parse(Ask);
    const config = loadConfig();
    const apiHost = flags.apiHost || config.apiHost;
    const authToken = config.authToken;

    if (!authToken) {
      this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
    }

    // Ensure user provides a prompt or input file
    let question = await this.getInitialQuestion(flags);
    let messages = flags.nocontext ? [] : loadConversation();

    messages.push({ role: "user", content: question });

    // **1️⃣ Send Question to Claire API**
    const questionId = await this.submitQuestion(apiHost, authToken, question);
    if (!questionId) {
      this.error("Failed to submit question to Claire API.");
    }

    // **2️⃣ Fetch API Response with Polling**
    const response = await this.pollForResponse(apiHost, authToken, questionId);

    // **3️⃣ Display Response**
    this.log("\n💡 Claire API Response:");
    this.log(response);

    // Save the conversation for history
    saveQuestion(question, response);
    // saveConversation(messages);
  }

  /**
   * 🎯 Fetch API Response Using Polling Every 3 Seconds
   */
  private async pollForResponse(apiHost: string, authToken: string, questionId: number): Promise<string> {
    const spinner = ora({ text: "🔄 Waiting for response from Claire API...", spinner: cliSpinners.dots }).start();
    const maxRetries = 10; // Set a limit to prevent infinite loops
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
        if (error.response?.data?.errors?.includes("Response doesn't exist")) {
          spinner.text = `⏳ Still waiting for Claire API response... [Attempt: ${attempt + 1}/10]`;
        } else {
          spinner.fail("❌ Error fetching response.");
          throw error;
        }
      }

      attempt++;
    }

    spinner.fail("❌ Timed out waiting for Claire API response.");
    throw new Error("No response received from Claire API after multiple attempts.");
  }

  /**
   * 🎯 Submit User Question to Claire API
   */
  private async submitQuestion(apiHost: string, authToken: string, question: string): Promise<number | null> {
    try {
      const response = await axios.post(
        `${apiHost}/api/questions`,
        { question: { content: question } },
        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
      );

      return response.data?.id || null;
    } catch (error) {
      this.error(`❌ Error submitting question: ${(error as AxiosError).message}`);
      return null;
    }
  }

  /**
   * 🎯 Get User Input (Prompt and/or File Content)
   */
  private async getInitialQuestion(flags: any): Promise<string> {
    let prompt = flags.prompt ? flags.prompt.trim() : "";
    let fileContent = "";

    if (flags.inputFile) {
      const fs = await import("fs/promises");
      try {
        fileContent = (await fs.readFile(flags.inputFile, "utf-8")).trim();
      } catch (error) {
        this.error(`❌ Failed to read input file: ${flags.inputFile}`);
      }
    }

    // Combine both prompt and file content if available
    if (prompt && fileContent !== "") {
      return `${prompt}\n\n---\n📄 **File Content:**\n${fileContent}`;
    }

    if (prompt) return prompt;
    if (fileContent) return fileContent;

    // Ask for the prompt if nothing is provided
    const { userPrompt } = await inquirer.prompt([
      { type: "input", name: "userPrompt", message: "Please enter a prompt:" },
    ]);

    return userPrompt.trim();
  }
}