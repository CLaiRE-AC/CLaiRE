import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

const API_URL = 'http://localhost:3000/api'; // Change to your actual API URL

export default class Team extends Command {
	static description = 'Manage teams (list, show, create)';

	async run() {
		const config = loadConfig();
		const authToken = config.authToken;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const response = await axios.get(`${API_URL}/teams`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log(JSON.stringify(response.data, null, 2));
		return;
	}
}