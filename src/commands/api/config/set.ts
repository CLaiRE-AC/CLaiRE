import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

export default class Set extends Command {
	static description = 'Manage teams (list, show, create)';

	static flags = {
		team_id: Flags.string({ char: "t", description: 'Set team to use with CLaiRE API' }),
		project_id: Flags.string({ char: "p", description: 'Set project to use with CLaiRE API' }),
	};

	async run() {
		const { flags } = await this.parse(Set);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const apiConfig = await axios.get(`${apiUrl}/api_config`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});

		const payload = {
			api_config: {
				team_id: flags.team_id || apiConfig.data.team_id,
				project_id: flags.project_id || apiConfig.data.project_id,
			},
		};

		const response = await axios.post(`${apiUrl}/api_config`, payload, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log(JSON.stringify(response.data, null, 2));
	}
}