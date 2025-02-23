import { Command, Flags } from "@oclif/core";
import { saveConfig, loadConfig } from "../utils/config.js";

export default class Config extends Command {
  static description = "Configure API settings such as API key, email, and API URL.";

  static flags = {
    authToken: Flags.string({ char: "k", description: "Set CLaiRE API key" }),
    email: Flags.string({ char: "e", description: "Set user email" }),
    apiUrl: Flags.string({ char: "u", description: "Set API base URL" })
  };

  async run() {
    const { flags } = await this.parse(Config);
    const config = loadConfig();

    if (flags.authToken || flags.email || flags.apiUrl) {
      saveConfig({
        email: flags.email || config.email,
        authToken: flags.authToken || config.authToken,
        apiUrl: flags.apiUrl || config.apiUrl,
      });
      this.log("✅ Configuration updated.");
    } else {
      this.log(`Current Config:
        Email: ${config.email || "Not Set"}
        CLaiRE API Key: ${config.authToken || "Not Set"}
        API URL: ${config.apiUrl || "Not Set"}`);
      return;
    }
  }
}