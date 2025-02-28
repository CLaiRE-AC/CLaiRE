import { Command, Flags, Args } from '@oclif/core';
import axios, { AxiosError } from "axios";
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";
import chalk from "chalk";

export default class Question extends Command {
	static description = 'Show details for CLaiRE question';

	static args = {
		questionId: Args.string({ description: "ID of question to display" }),
	};

	static flags = {
		list: Flags.boolean({ description: 'List questions and select to view' }),
		questionId: Flags.string({ char: "q", description: 'ID of question to display' }),
		skipResponse: Flags.boolean({ char: "s", description: 'Do not include question response in output' }),
	};

	async run() {
		const { flags } = await this.parse(Question);
	    const { args } = await this.parse(Question);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		if (args.questionId && flags.questionId) {
			this.error("Supplied both flag and argument. Only use one.")
			return;
		}

		let response;
		let selectedquestion;

		try {
			if (flags.list) {
				response = await axios.get(`${apiUrl}/questions`, {
					headers: { Authorization: `Bearer ${authToken}` }
				})

				const questions = response.data?.reverse();

				if (!questions || questions.length === 0) {
					this.log("No questions found.");
					return;
				}

				// Prompt the user to select a project
				selectedquestion = await inquirer.prompt([
					{
						type: 'list',
						name: 'id',
						message: 'Select a project:',
						choices: questions.map((question: { id: string; content: string }) => ({
							name: question.content.substring(0, 80),
							value: question.id
						})),
						pageSize: 10
					}
				]);
			}

			response = await axios.get(`${apiUrl}/questions/${selectedquestion?.id || flags.questionId || args.questionId}`, {
				headers: { Authorization: `Bearer ${authToken}` }
			});

			this.log(chalk.whiteBright(`\n${"*".repeat(30)} BEGIN Question (${response.data?.question?.id}): ${"*".repeat(30)}`))
			this.log(chalk.cyan(response.data?.question?.content));
			this.log(chalk.whiteBright(`\n${"*".repeat(35)} END Question ${"*".repeat(35)}\n`))

			if (!flags.skipResponse || response.data?.response?.data === null) {
				this.log(chalk.whiteBright(`${"*".repeat(30)} BEGIN Response (${response.data?.response?.id}): ${"*".repeat(30)}`))
				this.log(chalk.cyan(response.data?.response?.content));
				this.log(chalk.whiteBright(`${"*".repeat(35)} END Response ${"*".repeat(35)}\n`))
			}
		} catch (error: any) {
		    if (axios.isAxiosError(error)) {
		      console.error(chalk.red(`❌ API request failed: ${error.response?.status} - ${error.response?.statusText}`));
		    } else {
		      console.error(chalk.red(`❌ Unexpected error occurred: ${error}`));
		    }
		}

		return;
	}
}