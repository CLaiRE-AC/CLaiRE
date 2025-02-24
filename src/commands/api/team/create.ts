import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

export default class Team extends Command {
	static description = 'Manage teams (list, show, create)';

	static flags = {
		name: Flags.string({ description: 'Team name' }),
		description: Flags.string({ description: 'Team description' }),
		token_allowance: Flags.integer({ description: 'Token spend limit (default 100000)' }),
	};

	async run() {
		const { flags } = await this.parse(Team);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const answers = await inquirer.prompt([
			{ name: 'name', message: 'Enter team name:', type: 'input', when: !flags.name },
			{ name: 'description', message: 'Enter team description:', type: 'input', when: !flags.description },
			{ name: 'token_allowance', message: 'Enter token spend limit (default 100000):', type: 'number', when: !flags.token_allowance, default: 100000 },
		]);

		const payload = {
			team: {
				name: flags.name || answers.name,
				description: flags.description || answers.description,
				token_allowance: flags.token_allowance || answers.token_allowance,
			},
		};

		const response = await axios.post(`${apiUrl}/teams`, payload, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log('Team created successfully:', JSON.stringify(response.data, null, 2));
	}
}