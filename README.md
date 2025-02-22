claire
=================

Command Line AI Request Experience


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/claire.svg)](https://npmjs.org/package/claire)
[![Downloads/week](https://img.shields.io/npm/dw/claire.svg)](https://npmjs.org/package/claire)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g claire
$ claire COMMAND
running command...
$ claire (--version)
claire/0.0.0 darwin-arm64 node-v23.3.0
$ claire --help [COMMAND]
USAGE
  $ claire COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`claire api:invitation`](#claire-apiinvitation)
* [`claire api:project`](#claire-apiproject)
* [`claire api:team`](#claire-apiteam)
* [`claire ask`](#claire-ask)
* [`claire config`](#claire-config)
* [`claire db:import-history`](#claire-dbimport-history)
* [`claire db:save-file FILE`](#claire-dbsave-file-file)
* [`claire db:view-history`](#claire-dbview-history)
* [`claire db:view-logs`](#claire-dbview-logs)
* [`claire git:generate-patch`](#claire-gitgenerate-patch)
* [`claire help [COMMAND]`](#claire-help-command)
* [`claire info`](#claire-info)
* [`claire init`](#claire-init)
* [`claire plugins`](#claire-plugins)
* [`claire plugins:add PLUGIN`](#claire-pluginsadd-plugin)
* [`claire plugins:inspect PLUGIN...`](#claire-pluginsinspect-plugin)
* [`claire plugins:install PLUGIN`](#claire-pluginsinstall-plugin)
* [`claire plugins:link PATH`](#claire-pluginslink-path)
* [`claire plugins:remove [PLUGIN]`](#claire-pluginsremove-plugin)
* [`claire plugins:reset`](#claire-pluginsreset)
* [`claire plugins:uninstall [PLUGIN]`](#claire-pluginsuninstall-plugin)
* [`claire plugins:unlink [PLUGIN]`](#claire-pluginsunlink-plugin)
* [`claire plugins:update`](#claire-pluginsupdate)
* [`claire project:set PROJECTNAME`](#claire-projectset-projectname)
* [`claire view`](#claire-view)

## `claire api:invitation`

Manage invitations (list, show, create)

```
USAGE
  $ claire api:invitation [--list] [--show <value>] [--create] [--email <value>] [--team_id <value>] [--project_id
    <value>]

FLAGS
  --create              Create a new invitation
  --email=<value>       Email of the invitee
  --list                List all invitations
  --project_id=<value>  Project ID
  --show=<value>        Show a specific invitation by ID
  --team_id=<value>     Team ID

DESCRIPTION
  Manage invitations (list, show, create)
```

_See code: [src/commands/api/invitation.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/invitation.ts)_

## `claire api:project`

Manage projects (list, show, create)

```
USAGE
  $ claire api:project [--list] [--show <value>] [--create] [--name <value>] [--description <value>]
    [--token_spend_limit <value>] [--team_id <value>]

FLAGS
  --create                     Create a new project
  --description=<value>        Project description
  --list                       List all projects
  --name=<value>               Project name
  --show=<value>               Show a specific project by ID
  --team_id=<value>            Team ID
  --token_spend_limit=<value>  Token spend limit (default 100000)

DESCRIPTION
  Manage projects (list, show, create)
```

_See code: [src/commands/api/project.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/project.ts)_

## `claire api:team`

Manage teams (list, show, create)

```
USAGE
  $ claire api:team [--list] [--show <value>] [--create] [--name <value>] [--description <value>]
    [--token_spend_limit <value>]

FLAGS
  --create                     Create a new team
  --description=<value>        Team description
  --list                       List all teams
  --name=<value>               Team name
  --show=<value>               Show a specific team by ID
  --token_spend_limit=<value>  Token spend limit (default 100000)

DESCRIPTION
  Manage teams (list, show, create)
```

_See code: [src/commands/api/team.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/team.ts)_

## `claire ask`

Send a prompt to Claire API and retrieve a response.

```
USAGE
  $ claire ask [-p <value>] [-F <value>] [-m <value>] [--nocontext] [-i] [-h <value>]

FLAGS
  -F, --inputFile=<value>  Path to a file containing the question input
  -h, --apiHost=<value>    [default: http://localhost:3000] Hostname for Claire API
  -i, --interactive        Interactively select previous questions for context
  -m, --model=<value>      [default: default-model] Claire API model selection
  -p, --prompt=<value>     Prompt to send
      --nocontext          Bypass reading project conversation history

DESCRIPTION
  Send a prompt to Claire API and retrieve a response.
```

_See code: [src/commands/ask.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/ask.ts)_

## `claire config`

Configure API key and email for automatic use.

```
USAGE
  $ claire config [-k <value>] [-e <value>] [-s]

FLAGS
  -e, --email=<value>      Set user email
  -k, --authToken=<value>  Set CLaiRE API key
  -s, --show               Show current config

DESCRIPTION
  Configure API key and email for automatic use.
```

_See code: [src/commands/config.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/config.ts)_

## `claire db:import-history`

Import conversation history from history.json into the database.

```
USAGE
  $ claire db:import-history

DESCRIPTION
  Import conversation history from history.json into the database.
```

_See code: [src/commands/db/import-history.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/db/import-history.ts)_

## `claire db:save-file FILE`

Save a file into the SQLite database.

```
USAGE
  $ claire db:save-file FILE

ARGUMENTS
  FILE  Path to the file

DESCRIPTION
  Save a file into the SQLite database.
```

_See code: [src/commands/db/save-file.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/db/save-file.ts)_

## `claire db:view-history`

View stored conversation history.

```
USAGE
  $ claire db:view-history

DESCRIPTION
  View stored conversation history.
```

_See code: [src/commands/db/view-history.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/db/view-history.ts)_

## `claire db:view-logs`

View stored logs.

```
USAGE
  $ claire db:view-logs

DESCRIPTION
  View stored logs.
```

_See code: [src/commands/db/view-logs.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/db/view-logs.ts)_

## `claire git:generate-patch`

Generate AI-suggested code modifications as a Git patch.

```
USAGE
  $ claire git:generate-patch -f <value> [-o <value>] [-m <value>] [-p <value>]

FLAGS
  -f, --file=<value>    (required) Path to the source file in git repository
  -m, --model=<value>   [default: chatgpt-4o-latest] OpenAI model
  -o, --output=<value>  [default: ./patches] Optional output directory for the patch file
  -p, --prompt=<value>  Custom modification request (e.g., 'Optimize this function')

DESCRIPTION
  Generate AI-suggested code modifications as a Git patch.
```

_See code: [src/commands/git/generate-patch.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/git/generate-patch.ts)_

## `claire help [COMMAND]`

Display help for claire.

```
USAGE
  $ claire help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for claire.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.25/src/commands/help.ts)_

## `claire info`

Display current project and configuration information.

```
USAGE
  $ claire info

DESCRIPTION
  Display current project and configuration information.
```

_See code: [src/commands/info.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/info.ts)_

## `claire init`

Initialize CLaiRE CLI.

```
USAGE
  $ claire init

DESCRIPTION
  Initialize CLaiRE CLI.
```

_See code: [src/commands/init.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/init.ts)_

## `claire plugins`

List installed plugins.

```
USAGE
  $ claire plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ claire plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/index.ts)_

## `claire plugins:add PLUGIN`

Installs a plugin into claire.

```
USAGE
  $ claire plugins:add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into claire.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the CLAIRE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the CLAIRE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ claire plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ claire plugins:add myplugin

  Install a plugin from a github url.

    $ claire plugins:add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ claire plugins:add someuser/someplugin
```

## `claire plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ claire plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ claire plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/inspect.ts)_

## `claire plugins:install PLUGIN`

Installs a plugin into claire.

```
USAGE
  $ claire plugins:install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into claire.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the CLAIRE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the CLAIRE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ claire plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ claire plugins:install myplugin

  Install a plugin from a github url.

    $ claire plugins:install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ claire plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/install.ts)_

## `claire plugins:link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ claire plugins:link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ claire plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/link.ts)_

## `claire plugins:remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ claire plugins:remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ claire plugins:unlink
  $ claire plugins:remove

EXAMPLES
  $ claire plugins:remove myplugin
```

## `claire plugins:reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ claire plugins:reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/reset.ts)_

## `claire plugins:uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ claire plugins:uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ claire plugins:unlink
  $ claire plugins:remove

EXAMPLES
  $ claire plugins:uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/uninstall.ts)_

## `claire plugins:unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ claire plugins:unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ claire plugins:unlink
  $ claire plugins:remove

EXAMPLES
  $ claire plugins:unlink myplugin
```

## `claire plugins:update`

Update installed plugins.

```
USAGE
  $ claire plugins:update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/update.ts)_

## `claire project:set PROJECTNAME`

Set the current project for Claire.

```
USAGE
  $ claire project:set PROJECTNAME

ARGUMENTS
  PROJECTNAME  Project name

DESCRIPTION
  Set the current project for Claire.
```

_See code: [src/commands/project/set.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/project/set.ts)_

## `claire view`

View saved questions interactively and display responses.

```
USAGE
  $ claire view [-s <value>]

FLAGS
  -s, --search=<value>  Search for a question containing this keyword

DESCRIPTION
  View saved questions interactively and display responses.
```

_See code: [src/commands/view.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/view.ts)_
<!-- commandsstop -->
