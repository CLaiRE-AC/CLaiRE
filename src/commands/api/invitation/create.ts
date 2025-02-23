import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

export default class Invitation extends Command {
	static description = 'Manage invitations (list, show, create)';

	static flags = {
		email: Flags.string({ description: 'Email of the invitee' }),
		team_id: Flags.string({ description: 'Team ID' }),
		project_id: Flags.string({ description: 'Project ID' }),
	};

	async run() {
		const { flags } = await this.parse(Invitation);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const teamsResponse = await axios.get(`${apiUrl}/teams`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		const teams = teamsResponse.data;
		const teamSelection = await inquirer.prompt([
			{ name: 'team_id', message: 'Select a team:', type: 'list', choices: teams.map((team: any) => ({ name: team.name, value: team.id })) },
		]);

		const projectsResponse = await axios.get(`${apiUrl}/projects`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		const projects = projectsResponse.data;
		let projectId = null;

		if (projects.length > 0) {
			const projectSelection = await inquirer.prompt([
				{ name: 'project_id', message: 'Select a project (optional):', type: 'list', choices: [...projects.map((project: any) => ({ name: project.name, value: project.id })), { name: 'Skip', value: null }] },
			]);
			projectId = projectSelection.project_id;
		}

		const answers = await inquirer.prompt([{ name: 'email', message: 'Enter invitee email:', type: 'input' }]);

		const payload = {
			invitation: {
				email: flags.email || answers.email,
				team_id: teamSelection.team_id,
				project_id: projectId,
			},
		};

		const response = await axios.post(`${apiUrl}/invitations`, payload, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log('Invitation sent successfully:', JSON.stringify(response.data, null, 2));
	}
}