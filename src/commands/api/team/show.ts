import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import { loadConfig } from "../../../utils/config.js";

export default class Team extends Command {
	static description = 'Manage teams (list, show, create)';

	static flags = {
		team: Flags.string({ char: "t", description: 'Show a specific team' }),
	};

	async run() {
		const { flags } = await this.parse(Team);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing CLaiRE API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		if (!apiUrl) {
			this.error("Missing API URL. Set it using `claire config -u API_URL`.");
		}

		const response = await axios.get(`${apiUrl}/teams/${flags.team}`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log(JSON.stringify(response.data, null, 2));
	}
}