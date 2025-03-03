import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../../utils/config.js";

export default class Invitation extends Command {
	static description = 'Manage invitations (list, show, create)';

	static flags = {
		email: Flags.string({ description: 'Email of the invitee' }),
	};

	async run() {
		const { flags } = await this.parse(Invitation);
		const config = loadConfig();
		const authToken = config.authToken;
		const apiUrl = config.apiUrl;

		if (!authToken) {
			this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
		}

		const answers = await inquirer.prompt([{ name: 'email', message: 'Enter invitee email:', type: 'input' }]);

		const payload = {
			invitation: {
				email: flags.email || answers.email
			},
		};

		const response = await axios.post(`${apiUrl}/invitations`, payload, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		this.log('Invitation sent successfully:', JSON.stringify(response.data, null, 2));
	}
}