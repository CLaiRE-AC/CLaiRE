import { Command, Args } from "@oclif/core";
import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";
import { loadConfig, saveConfig} from "../utils/config.js";

export default class Init extends Command {
  static description = "Initialize CLaiRE CLI.";

  async run() {
    // Define paths
    const claireDir = path.join(os.homedir(), ".claire");
    const config = loadConfig();

    // Ensure ~/.claire directory exists
    if (!fs.existsSync(claireDir)) {
      fs.mkdirSync(claireDir, { recursive: true });
      this.log(chalk.green(`✅ Created 'CLaiRE' directory at ${claireDir}`));
    }

    saveConfig({
      api: {
        host: config.api?.host || "https://claire.ac",
        token: config.api?.token,
      }
    });

    this.log("✅ CLaiRE CLI Initialized.");
  }
}