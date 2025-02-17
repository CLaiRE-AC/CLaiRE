import { Command, Flags } from "@oclif/core";
import { saveConfig, loadConfig } from "../utils/config.js";

export default class Config extends Command {
  static description = "Configure API key and email for automatic use.";

  static flags = {
    apiKey: Flags.string({ char: "k", description: "Set OpenAI API key" }),
    email: Flags.string({ char: "e", description: "Set user email" }),
    show: Flags.boolean({ char: "s", description: "Show current config" }),
  };

  async run() {
    const { flags } = await this.parse(Config);
    const config = loadConfig();

    if (flags.show) {
      this.log(`Current Config:\nAPI Key: ${config.openai_api_key || "Not Set"}\nEmail: ${config.email || "Not Set"}\nHistory File: ${config.history_file || "Not Set"}`);
      return;
    }

    if (flags.apiKey || flags.email) {
      saveConfig({
        openai_api_key: flags.apiKey || config.openai_api_key, 
        email: flags.email || config.email
      })
      this.log("✅ Configuration updated.");
    } else {
      this.error("Use --show to view settings or provide --apiKey and/or --email to update.");
    }
  }
}
