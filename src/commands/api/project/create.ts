import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

export default class Project extends Command {
	static description = 'Create new project in CLaiRE API';

	static flags = {
		name: Flags.string({ description: 'Project name' }),
		description: Flags.string({ description: 'Project description' })
	};

	async run() {
		const { flags } = await this.parse(Project);
		const { token: authToken, host: apiHost } = loadConfig().api;

		if (!authToken) {
			this.error("Missing CLaiRE API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const answers = await inquirer.prompt([
			{ name: 'name', message: 'Enter project name:', type: 'input', when: !flags.name },
			{ name: 'description', message: 'Enter project description:', type: 'input', when: !flags.description }
		]);

		const payload = {
			project: {
				name: flags.name || answers.name,
				description: flags.description || answers.description
			},
		};

		const response = await axios.post(`${apiHost}/api/projects`, payload, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log('Project created successfully:', JSON.stringify(response.data, null, 2));
	}
}