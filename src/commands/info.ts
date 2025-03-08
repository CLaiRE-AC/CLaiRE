import { Command } from "@oclif/core";
import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";

export default class Info extends Command {
  static description = "Display current project and configuration information.";

  async run() {
    const claireDir = path.join(os.homedir(), ".claire");

    const configFilePath = path.join(claireDir, "config.json");
    const executablePath = process.execPath;

    this.log(chalk.bold(`\n📍 CLaiRE CLI Information\n`));

    // Display the directory storing configuration files
    this.log(chalk.cyan(`\n📂 Config Directory: ${claireDir}`));

    // Display the CLaiRE executable path
    this.log(chalk.magenta(`\n🏃 CLaiRE Executable Path: ${executablePath}\n`));
  }
}
