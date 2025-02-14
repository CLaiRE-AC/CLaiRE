import { Command } from "@oclif/core";
import { getLogs } from "../../utils/dbOperations.js";
import chalk from "chalk";

// Explicitly define the Log Entry type
interface LogEntry {
  id: number;
  timestamp: string;
  event: string;
  details: string | null;
}

export default class ViewLogs extends Command {
  static description = "View stored logs.";

  async run() {
    const logs: LogEntry[] = getLogs();

    if (logs.length === 0) {
      this.log(chalk.yellow("No logs found."));
      return;
    }

    logs.forEach((entry: LogEntry) => { // 👈 Explicitly specify the type
      this.log(chalk.blue(`[${entry.timestamp}] ${entry.event}`));
      this.log(chalk.gray(`Details: ${entry.details || "N/A"}\n`));
    });
  }
}