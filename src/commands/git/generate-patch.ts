import { Command, Flags } from "@oclif/core";
import axios, { AxiosError } from "axios";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";
import { loadConfig } from "../../utils/config.js";
import { loadConversation, saveConversation, confirmSaveConversation } from "../../utils/conversation.js"; // ✅ Updated import

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

    const filePath = path.resolve(flags.file);
    if (!fs.existsSync(filePath)) {
      this.error(`File not found: ${filePath}`);
    }
    if (!this.isFileInGitRepo(filePath)) {
      this.error(`The file is not inside a valid Git repository: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const gitDiff = this.getGitDiffForFile(filePath);

    // Load previous conversation history
    const historyFilePath = path.join(process.cwd(), "history.json");
    const history = loadConversation(historyFilePath);

    // Capture user prompt or fallback to generic improvements
    const userRequest = flags.prompt || "Apply best coding practices.";

    // Append user request to history
    history.push({ role: "user", content: userRequest });

    // Prepare AI prompt using history-aware context
    const prompt = this.buildPrompt(filePath, fileContent, gitDiff, history);

    // Fetch AI-generated patch
    const aiResponse = await this.getAIResponse(prompt, apiKey, flags.model);

    // Ask the user whether to save this interaction
    const shouldSave = await confirmSaveConversation();
    if (shouldSave) {
      history.push({ role: "assistant", content: aiResponse });
      saveConversation(history, historyFilePath);
    }

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

  /** Constructs the AI prompt using session history */
  private buildPrompt(filePath: string, fileContent: string, gitDiff: string, history: { role: string; content: string }[]): string {
    const conversationHistory = history
      .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
      .join("\n\n");

    return `You are an expert software engineer specialized in Git patches.

Previous conversations for context:
${conversationHistory}

---
# File: ${filePath}

## Current Code:
\`\`\`
${fileContent}
\`\`\`

## Git Diff:
\`\`\`
${gitDiff}
\`\`\`

Instructions:
- Follow provided modifications if specified.
- If no specific request is given, suggest best practices.
- Return only a valid Git patch (no explanations).

Now generate the patch:`;
  }

  /** Queries OpenAI for a patch suggestion */
  private async getAIResponse(prompt: string, apiKey: string, model: string): Promise<string> {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        { model, messages: [{ role: "system", content: "Generate Git patches." }, { role: "user", content: prompt }] },
        { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
      );

      return response.data.choices[0].message.content;
    } catch (error: unknown) {
      this.error("OpenAI API Error: " + (error as AxiosError)?.message);
    }
  }
}