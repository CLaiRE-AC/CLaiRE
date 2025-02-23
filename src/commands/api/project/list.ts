import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

const API_URL = 'http://localhost:3000/api';

export default class Project extends Command {
	static description = 'List all projects from CLaiRE API';

	async run() {
		const config = loadConfig();
		const authToken = config.authToken;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const response = await axios.get(`${API_URL}/projects`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});

		this.log(JSON.stringify(response.data, null, 2));
		return;
	}
}