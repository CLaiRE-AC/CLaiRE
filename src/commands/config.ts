import { Command, Flags } from "@oclif/core";
import { saveConfig, loadConfig } from "../utils/config.js";
import chalk from "chalk";

export default class Config extends Command {
  static description = "Configure API settings such as API key, email, API URL, and selected project.";

  static flags = {
    authToken: Flags.string({ char: "k", description: "Set CLaiRE API key" }),
    email: Flags.string({ char: "e", description: "Set user email" }),
    apiUrl: Flags.string({ char: "u", description: "Set API base URL" }),
    projectId: Flags.string({ char: "p", description: "Set selected project ID" }),
    projectName: Flags.string({ char: "n", description: "Set selected project name" }),
  };

  async run() {
    const { flags } = await this.parse(Config);
    const config = loadConfig();

    if (flags.authToken || flags.email || flags.apiUrl || flags.projectId || flags.projectName) {
      saveConfig({
        email: flags.email || config.email || "",
        authToken: flags.authToken || config.authToken || "",
        apiUrl: flags.apiUrl || config.apiUrl || "",
        project: {
          id: flags.projectId || config.project?.id || "",
          name: flags.projectName || config.project?.name || "",
        },
      });
      this.log("✅ Configuration updated.");
    } else {
      this.log(chalk.cyan(JSON.stringify(config, null, 2)));
    }
  }
}