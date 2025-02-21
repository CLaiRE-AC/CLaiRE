import { Command, Flags } from "@oclif/core";
import { saveConfig, loadConfig } from "../utils/config.js";

export default class Config extends Command {
  static description = "Configure API key and email for automatic use.";

  static flags = {
    authToken: Flags.string({ char: "k", description: "Set CLaiRE API key" }),
    email: Flags.string({ char: "e", description: "Set user email" }),
    show: Flags.boolean({ char: "s", description: "Show current config" }),
  };

  async run() {
    const { flags } = await this.parse(Config);
    const config = loadConfig();

    if (flags.show) {
      this.log(`Current Config:\nEmail: ${config.email || "Not Set"}\nCLaiRE API Key: ${config.authToken || "Not Set"}\}`);
      return;
    }

    if (flags.apiKey || flags.email) {
      saveConfig({
        email: flags.email || config.email,
        authToken: flags.apiKey || config.authToken
      })
      this.log("✅ Configuration updated.");
    } else {
      this.error("Use --show to view settings or provide --apiKey and/or --email to update.");
    }
  }
}
