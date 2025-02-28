import { Command, Args } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";
import chalk from "chalk";

export default class Question extends Command {
	static description = 'Show details for CLaiRE question';

	static args = {
		questionId: Args.string({ description: "ID of question to display", required: true }),
	};

	// static flags = {
	// 	question: Flags.string({ char: "p", description: 'Show a specific question' }),
	// };

	async run() {
		// const { flags } = await this.parse(Question);
	    const { args } = await this.parse(Question);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const response = await axios.get(`${apiUrl}/questions/${args.questionId}`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log(chalk.whiteBright(`\n${"*".repeat(30)} Question (${response.data.question.id}): ${"*".repeat(30)}`))
		this.log(chalk.cyan(response.data?.question?.content));
		this.log("\n\n")
		this.log(chalk.whiteBright(`${"*".repeat(30)} Response (${response.data.response.id}): ${"*".repeat(30)}`))
		this.log(chalk.cyan(response.data?.response?.content));
		this.log(chalk.whiteBright(`${"*".repeat(80)}\n`));
		return;
	}
}