import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../utils/config.js";

const API_URL = 'http://localhost:3000/api'; // Change to your actual API URL

export default class Team extends Command {
  static description = 'Manage teams (list, show, create)';

  static flags = {
    list: Flags.boolean({ description: 'List all teams' }),
    show: Flags.string({ description: 'Show a specific team by ID' }),
    create: Flags.boolean({ description: 'Create a new team' }),
    name: Flags.string({ description: 'Team name' }),
    description: Flags.string({ description: 'Team description' }),
    token_spend_limit: Flags.integer({ description: 'Token spend limit (default 100000)' }),
  };

  async run() {
    const { flags } = await this.parse(Team);
    const config = loadConfig();

    const authToken = config.authToken;

    if (!authToken) {
      this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
    }

    if (flags.list) {
      const response = await axios.get(`${API_URL}/teams`, {
      	headers: { Authorization: `Bearer ${authToken}` }
      });
      this.log(JSON.stringify(response.data, null, 2));
      return;
    }

    if (flags.show) {
      const response = await axios.get(`${API_URL}/teams/${flags.show}`, {
      	headers: { Authorization: `Bearer ${authToken}` }
      });
      this.log(JSON.stringify(response.data, null, 2));
      return;
    }

    if (flags.create) {
      const answers = await inquirer.prompt([
        { name: 'name', message: 'Enter team name:', type: 'input', when: !flags.name },
        { name: 'description', message: 'Enter team description:', type: 'input', when: !flags.description },
        { name: 'token_spend_limit', message: 'Enter token spend limit (default 100000):', type: 'number', when: !flags.token_spend_limit, default: 100000 },
      ]);

      const payload = {
        team: {
          name: flags.name || answers.name,
          description: flags.description || answers.description,
          token_spend_limit: flags.token_spend_limit || answers.token_spend_limit,
        },
      };

      const response = await axios.post(`${API_URL}/teams`, payload, {
      	headers: { Authorization: `Bearer ${authToken}` }
      });
      this.log('Team created successfully:', JSON.stringify(response.data, null, 2));
    }
  }
}