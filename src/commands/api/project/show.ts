import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

const API_URL = 'http://localhost:3000/api';

export default class Project extends Command {
	static description = 'Show information for CLaiRE project';

	static flags = {
		project: Flags.string({ char: "p", description: 'Show a specific project' }),
	};

	async run() {
		const { flags } = await this.parse(Project);
		const config = loadConfig();
		const authToken = config.authToken;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const response = await axios.get(`${API_URL}/projects/${flags.project}`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log(JSON.stringify(response.data, null, 2));
		return;
	}
}