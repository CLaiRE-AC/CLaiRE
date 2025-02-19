import { Command } from "@oclif/core";
import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";

export default class Info extends Command {
  static description = "Display current project and configuration information.";

  async run() {
    const claireDir = path.join(os.homedir(), ".claire");
    const claireLogsDir = path.join(os.homedir(), ".claire", "logs");
    const projectsDir = path.join(claireDir, "projects");
    const projectFilePath = path.join(claireDir, "project.json");
    const configFilePath = path.join(claireDir, "config.json");
    const executablePath = process.execPath;

    this.log(chalk.bold(`📍 Claire CLI Information`));

    // Display the directory storing configuration files
    this.log(chalk.cyan(`\n📂 Config Directory: ${claireDir}`));
    this.log(chalk.cyan(`\n📂 Projects Directory: ${projectsDir}`));
    this.log(chalk.cyan(`\n📂 Conversation Logs Directory: ${claireLogsDir}`));

    // List the folders in projectsDir
    if (fs.existsSync(projectsDir)) {
      try {
        const projectFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        if (projectFolders.length > 0) {
          this.log(chalk.blue(`\n📁 Projects:`));
          projectFolders.forEach(folder => this.log(chalk.whiteBright(` - ${folder}`)));
        } else {
          this.log(chalk.gray(`\n🚫 No projects found in ${projectsDir}.`));
        }
      } catch (error) {
        this.log(chalk.red(`\n⚠️ Failed to read projects directory: ${projectsDir}`));
      }
    } else {
      this.log(chalk.gray(`\n🚫 Projects directory does not exist: ${projectsDir}`));
    }

    // Read Project Information
    if (fs.existsSync(projectFilePath)) {
      try {
        const projectData = JSON.parse(fs.readFileSync(projectFilePath, "utf-8"));
        this.log(chalk.yellow(`\n📝 Project Information (project.json)`));
        this.log(chalk.whiteBright(JSON.stringify(projectData, null, 2))); // Pretty print
      } catch (error) {
        this.log(chalk.red("\n⚠️ Failed to read project.json. Ensure it's valid JSON."));
      }
    } else {
      this.log(chalk.gray("\n🚫 No project.json found."));
    }

    // Read Config Information
    if (fs.existsSync(configFilePath)) {
      try {
        const configData = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
        this.log(chalk.green(`\n⚙️ Configuration Settings (config.json)`));
        this.log(chalk.whiteBright(JSON.stringify(configData, null, 2))); // Pretty print
      } catch (error) {
        this.log(chalk.red("\n⚠️ Failed to read config.json. Ensure it's valid JSON."));
      }
    } else {
      this.log(chalk.gray("\n🚫 No config.json found."));
    }

    // Display the Claire executable path
    this.log(chalk.magenta(`\n🏃 Claire Executable Path: ${executablePath}\n`));
  }
}
