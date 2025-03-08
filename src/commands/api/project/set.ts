import { Command } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig, saveConfig } from '../../../utils/config.js';

export default class Project extends Command {
	static description = 'List users projects and set active project in CLaiRE config.';

	async run() {
		let config = loadConfig();
		const { token: authToken, host: apiHost } = config.api;

		if (!authToken) {
			this.error("Missing CLaiRE API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		try {
			const response = await axios.get(`${apiHost}/api/projects`, {
				headers: { Authorization: `Bearer ${authToken}` }
			});

			const projects = response.data;

			if (!projects || projects.length === 0) {
				this.log("No projects found.");
				return;
			}

			// Prompt the user to select a project
			const { selectedProject } = await inquirer.prompt([
				{
					type: 'list',
					name: 'selectedProject',
					message: 'Select a project:',
					choices: projects.sort((a: any, b: any) => (b.id - a.id)).map((project: { id: string; name: string, description: string }) => ({
						name: project.name,
						value: {id: project.id, name: project.name, description: project.description}
					})),
					pageSize: 10
				}
			]);

			// Save the selected project ID to the config
			saveConfig({ ...config, project: selectedProject });

			this.log(`✅ Project selected and saved (ID: ${selectedProject.id}).`);
		} catch (error: any) {
			this.error(`Error fetching projects: ${error.message}`);
		}
	}
}