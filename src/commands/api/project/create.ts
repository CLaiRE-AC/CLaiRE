import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

export default class Project extends Command {
	static description = 'Create new project in CLaiRE API';

	static flags = {
		name: Flags.string({ description: 'Project name' }),
		description: Flags.string({ description: 'Project description' }),
		token_allowance: Flags.integer({ description: 'Token spend limit (default 100000)' }),
		team_id: Flags.string({ description: 'Team ID' }),
	};

	async run() {
		const { flags } = await this.parse(Project);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		let teamId = flags.team_id;

		if (!teamId) {
			const teamsResponse = await axios.get(`${apiUrl}/teams`, {
				headers: { Authorization: `Bearer ${authToken}` }
			});
			const teams = teamsResponse.data;

			if (teams.length > 0) {
				const teamSelection = await inquirer.prompt([
					{ name: 'team_id', message: 'Select a team:', type: 'list', choices: teams.map((team: any) => ({ name: team.name, value: team.id })) },
				]);
				teamId = teamSelection.team_id;
			}
		}

		const answers = await inquirer.prompt([
			{ name: 'name', message: 'Enter project name:', type: 'input', when: !flags.name },
			{ name: 'description', message: 'Enter project description:', type: 'input', when: !flags.description },
			{ name: 'token_allowance', message: 'Enter token spend limit (default 100000):', type: 'number', when: !flags.token_allowance, default: 100000 },
		]);

		const payload = {
			project: {
				name: flags.name || answers.name,
				description: flags.description || answers.description,
				token_allowance: flags.token_allowance || answers.token_allowance,
				team_id: teamId,
			},
		};

		const response = await axios.post(`${apiUrl}/projects`, payload, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log('Project created successfully:', JSON.stringify(response.data, null, 2));
	}
}