import { Command } from "@oclif/core";
import { importHistory } from "../../database/importHistory.js"; // ✅ Use named import

export default class ImportHistory extends Command {
  static description = "Import conversation history from history.json into the database.";

  async run() {
    this.log("📥 Importing conversation history...");
    importHistory();
  }
}