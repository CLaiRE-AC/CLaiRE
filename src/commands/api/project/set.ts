import { Command } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig, saveConfig } from '../../../utils/config.js';

export default class Project extends Command {
	static description = 'List users projects and set active project in CLaiRE config.';

	async run() {
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing CLaiRE API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		try {
			const response = await axios.get(`${apiUrl}/projects`, {
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
					choices: projects.map((project: { id: string; name: string }) => ({
						name: project.name,
						value: project.id
					})),
					pageSize: 10
				}
			]);

			// Save the selected project ID to the config
			saveConfig({ ...config, projectId: selectedProject });

			this.log(`✅ Project selected and saved (ID: ${selectedProject}).`);
		} catch (error: any) {
			this.error(`Error fetching projects: ${error.message}`);
		}
	}
}