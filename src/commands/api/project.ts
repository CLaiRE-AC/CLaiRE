import { Command, Flags } from '@oclif/core';
import axios from 'axios';
import inquirer from 'inquirer';
import { loadConfig } from "../../utils/config.js";

const API_URL = 'http://localhost:3000/api';

export default class Project extends Command {
  static description = 'Manage projects (list, show, create)';

  static flags = {
    list: Flags.boolean({ description: 'List all projects' }),
    show: Flags.string({ description: 'Show a specific project by ID' }),
    create: Flags.boolean({ description: 'Create a new project' }),
    name: Flags.string({ description: 'Project name' }),
    description: Flags.string({ description: 'Project description' }),
    token_spend_limit: Flags.integer({ description: 'Token spend limit (default 100000)' }),
    team_id: Flags.string({ description: 'Team ID' }),
  };

  async run() {
    const { flags } = await this.parse(Project);
    const config = loadConfig();

    const authToken = config.authToken;

    if (!authToken) {
      this.error("Missing Claire API token. Set it using `claire config -k YOUR_AUTH_TOKEN`.");
    }

    if (flags.list) {
      const response = await axios.get(`${API_URL}/projects`, {
      	headers: { Authorization: `Bearer ${authToken}` }
      });
      this.log(JSON.stringify(response.data, null, 2));
      return;
    }

    if (flags.show) {
      const response = await axios.get(`${API_URL}/projects/${flags.show}`, {
      	headers: { Authorization: `Bearer ${authToken}` }
      });
      this.log(JSON.stringify(response.data, null, 2));
      return;
    }

    if (flags.create) {
      let teamId = flags.team_id;

      if (!teamId) {
        const teamsResponse = await axios.get(`${API_URL}/teams`, {
      	headers: { Authorization: `Bearer ${authToken}` }
      });
        const teams = teamsResponse.data;

        if (teams.length > 0) {
          const teamSelection = await inquirer.prompt([
            { name: 'team_id', message: 'Select a team:', type: 'list', choices: teams.map((team: any) => ({ name: team.name, value: team.id })) },
          ]);
          teamId = teamSelection.team_id;
        }
      }

      const answers = await inquirer.prompt([
        { name: 'name', message: 'Enter project name:', type: 'input', when: !flags.name },
        { name: 'description', message: 'Enter project description:', type: 'input', when: !flags.description },
        { name: 'token_spend_limit', message: 'Enter token spend limit (default 100000):', type: 'number', when: !flags.token_spend_limit, default: 100000 },
      ]);

      const payload = {
        project: {
          name: flags.name || answers.name,
          description: flags.description || answers.description,
          token_spend_limit: flags.token_spend_limit || answers.token_spend_limit,
          team_id: teamId,
        },
      };

      const response = await axios.post(`${API_URL}/projects`, payload, {
      	headers: { Authorization: `Bearer ${authToken}` }
      });
      this.log('Project created successfully:', JSON.stringify(response.data, null, 2));
    }
  }
}