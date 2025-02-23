import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

export default class Set extends Command {
	static description = 'Manage teams (list, show, create)';

	async run() {
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const response = await axios.get(`${apiUrl}/api_config`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});

		this.log(JSON.stringify(response.data, null, 2));
	}
}