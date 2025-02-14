import { Command, Args } from "@oclif/core";
import { saveFile } from "../../utils/dbOperations.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export default class SaveFile extends Command {
  static description = "Save a file into the SQLite database.";

  static args = {
    file: Args.string({ description: "Path to the file", required: true }),
  };

  async run() {
    const { args } = await this.parse(SaveFile);
    const filePath = path.resolve(args.file);

    if (!fs.existsSync(filePath)) {
      this.error(`File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    saveFile(filePath, content);
    this.log(chalk.green(`File ${filePath} has been saved in the database.`));
  }
}
