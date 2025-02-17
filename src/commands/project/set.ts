import { Command, Args } from "@oclif/core";
import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";

export default class SetProject extends Command {
  static description = "Set the current project for Claire.";

  static args = {
    projectName: Args.string({ description: "Project name", required: true }),
  };

  async run() {
    const { args } = await this.parse(SetProject);
    const projectName = args.projectName.trim();

    // Define paths
    const claireDir = path.join(os.homedir(), ".claire");
    const projectsDir = path.join(claireDir, "projects");
    const projectDir = path.join(projectsDir, projectName);
    const projectFilePath = path.join(claireDir, "project.json");

    // Ensure ~/.claire directory exists
    if (!fs.existsSync(claireDir)) {
      fs.mkdirSync(claireDir, { recursive: true });
      this.log(chalk.green(`✅ Created 'projects' directory at ${claireDir}`));
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

    // Save the selected project in project.json
    const projectData = { project_name: projectName, selected_at: new Date().toISOString() };
    fs.writeFileSync(projectFilePath, JSON.stringify(projectData, null, 2), "utf-8");

    this.log(chalk.blue(`🎯 Current project set to: ${projectName}`));
  }
}