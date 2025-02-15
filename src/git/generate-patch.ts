import { Command, Flags } from "@oclif/core";
import axios, { AxiosError } from "axios";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";
import { loadConfig } from "../utils/config.js";

export default class GeneratePatch extends Command {
  static description = "Generate AI-suggested code modifications as a Git patch.";

  static flags = {
    file: Flags.string({ char: "f", description: "Path to the source file in git repository", required: true }),
    output: Flags.string({ char: "o", description: "Optional output directory for the patch file", default: "./patches" }),
    model: Flags.string({ char: "m", description: "OpenAI model", default: "chatgpt-4o-latest" }),
    prompt: Flags.string({ char: "p", description: "Custom modification request (e.g., 'Optimize this function')" }),
  };

  async run() {
    const { flags } = await this.parse(GeneratePatch);
    const config = loadConfig();
    const apiKey = config.openai_api_key;

    if (!apiKey) {
      this.error("Missing OpenAI API key. Set it using `claire config -k YOUR_API_KEY`.");
    }

    // Ensure file exists and is inside a Git repository
    const filePath = path.resolve(flags.file);
    if (!fs.existsSync(filePath)) {
      this.error(`File not found: ${filePath}`);
    }
    if (!this.isFileInGitRepo(filePath)) {
      this.error(`The file is not inside a valid Git repository: ${filePath}`);
    }

    // Get file content & latest diff for context
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const gitDiff = this.getGitDiffForFile(filePath);

    // Ask AI for modifications
    const userRequest = flags.prompt || ""; // Capture user's prompt (default to empty)
    const prompt = this.buildPrompt(filePath, fileContent, gitDiff, userRequest);
    const aiResponse = await this.getAIResponse(prompt, apiKey, flags.model);

    // Save patch file
    const outputDir = path.resolve(flags.output);
    fs.mkdirSync(outputDir, { recursive: true });

    const patchFileName = `patch-${path.basename(filePath)}-${Date.now()}.patch`;
    const patchFilePath = path.join(outputDir, patchFileName);
    fs.writeFileSync(patchFilePath, aiResponse, "utf-8");

    this.log(`✅ Patch file saved: ${patchFilePath}`);

    // Offer to apply the patch
    const { applyPatch } = await inquirer.prompt([
      {
        type: "confirm",
        name: "applyPatch",
        message: "Would you like to apply the patch now using `git apply`?",
        default: false,
      },
    ]);

    if (applyPatch) {
      try {
        execSync(`git apply --verbose "${patchFilePath}"`, { stdio: "inherit" });
        this.log("✅ Patch applied successfully!");
      } catch (error) {
        this.error(`Failed to apply patch. You can apply it manually using:\n  git apply ${patchFilePath}`);
      }
    }
  }

  /** Verifies if a file is inside a Git repository */
  private isFileInGitRepo(filePath: string): boolean {
    try {
      execSync(`git ls-files --error-unmatch "${filePath}"`, { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }

  /** Gets the latest Git diff for a file */
  private getGitDiffForFile(filePath: string): string {
    try {
      return execSync(`git diff --unified=3 -- "${filePath}"`).toString();
    } catch (error) {
      this.warn(`No recent Git changes detected for ${filePath}. Sending unmodified content.`);
      return "";
    }
  }

  /** Constructs the OpenAI prompt */
  private buildPrompt(filePath: string, fileContent: string, gitDiff: string, userPrompt: string | undefined): string {
    return `You are a professional software engineer experienced in Git patch formatting.

  I have the following file: ${filePath}
  ---
  # Original Code:
  \`\`\`
  ${fileContent}
  \`\`\`

  # Recent Changes from Git Diff:
  \`\`\`
  ${gitDiff}
  \`\`\`

  # User Request:
  ${userPrompt ? userPrompt : "Improve the code with best practices and optimizations."}

  # Expected Output:
  - Return a valid, unified diff Git patch formatted for "git apply".
  - Do not include explanations—provide **only** the raw patch.

  Now generate the patch:`;
  }

  /** Queries OpenAI for a patch suggestion */
  private async getAIResponse(prompt: string, apiKey: string, model: string): Promise<string> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: model,
          messages: [
            { role: "system", content: "You are a code assistant that generates Git patches." },
            { role: "user", content: prompt },
          ],
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
      return "An error occurred while generating the patch.";
    }
  }

  /** Handles errors */
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