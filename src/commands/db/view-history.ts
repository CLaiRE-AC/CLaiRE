import { Command } from "@oclif/core";
import { getConversationHistory } from "../../utils/dbOperations.js";
import chalk from "chalk";

// Explicitly define the conversation entry type
interface ConversationEntry {
  id: number;
  timestamp: string;
  user_message: string;
  ai_response: string;
}

export default class ViewHistory extends Command {
  static description = "View stored conversation history.";

  async run() {
    const history: ConversationEntry[] = getConversationHistory();

    if (history.length === 0) {
      this.log(chalk.yellow("No conversation history found."));
      return;
    }

    history.forEach((entry: ConversationEntry) => {  // 👈 Explicitly define type
      this.log(chalk.blue(`\nUser: ${entry.user_message}`));
      this.log(chalk.green(`AI: ${entry.ai_response}\n`));
    });
  }
}