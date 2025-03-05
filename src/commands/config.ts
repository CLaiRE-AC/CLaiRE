import { Command, Flags } from "@oclif/core";
import { saveConfig, loadConfig } from "../utils/config.js";
import chalk from "chalk";

export default class Config extends Command {
  static description = "View current or set new CLaiRE configuration values.";

  static flags = {
    host: Flags.string({ char: "h", description: "Set API base URL" }),
    token: Flags.string({ char: "t", description: "Set CLaiRE API key" }),
  };

  async run() {
    const { flags } = await this.parse(Config);
    const config = loadConfig();

    if (flags.host || flags.token) {
      saveConfig({
        api: {
          host: flags.host || config.api?.host || "https://claire.ac/api",
          token: flags.token || config.api?.token || "",
        },
        project: {
          id: config.project?.id || "",
          name: config.project?.name || "",
        },
      });
      this.log("✅ Configuration updated.");
    } else {
      this.log(chalk.cyan(JSON.stringify(config, null, 2)));
    }
  }
}