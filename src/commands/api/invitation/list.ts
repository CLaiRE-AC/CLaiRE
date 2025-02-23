import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

const apiUrl = 'http://localhost:3000/api';

export default class Invitation extends Command {
	static description = 'Manage invitations (list, show, create)';

	static flags = {
		team_id: Flags.string({ char: "t", description: 'Team ID' }),
		project_id: Flags.string({ char: "p", description: 'Project ID' }),
	};

	async run() {
		const { flags } = await this.parse(Invitation);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		if (flags.team_id || flags.project_id) {
			let requestUrl = `${apiUrl}/invitations/`;
			if(flags.team_id) {
				requestUrl += `team/${flags.team_id}`;
			} else {
				requestUrl += `project/${flags.project_id}`;
			}
			const response = await axios.get(requestUrl, {
				headers: { Authorization: `Bearer ${authToken}` }
			});
			this.log(JSON.stringify(response.data, null, 2));
			return;
		}

		const response = await axios.get(`${apiUrl}/invitations`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log(JSON.stringify(response.data, null, 2));
		return;
	}
}