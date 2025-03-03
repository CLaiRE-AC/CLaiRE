import { Command, Args } from "@oclif/core";
import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";

export default class Init extends Command {
  static description = "Initialize CLaiRE CLI.";

  async run() {
    // Define paths
    const claireDir = path.join(os.homedir(), ".claire");
    const projectsDir = path.join(claireDir, "projects");
    const projectDir = path.join(projectsDir, "default");

    // Ensure ~/.claire directory exists
    if (!fs.existsSync(claireDir)) {
      fs.mkdirSync(claireDir, { recursive: true });
      this.log(chalk.green(`✅ Created 'CLaiRE' directory at ${claireDir}`));
    }

    // Ensure ~/.claire/projects directory exists
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
      this.log(chalk.green(`✅ Created 'projects' directory at ${projectsDir}`));
    }

    // Create specific project folder (e.g., ~/.claire/projects/my_project)
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
      this.log(chalk.green(`✅ Created project directory: ${projectDir}`));
    }

    this.log(chalk.blue(`🎯 Claire successfully initialized.`));
  }
}