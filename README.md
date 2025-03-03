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
* [`claire api:config:get`](#claire-apiconfigget)
* [`claire api:config:set`](#claire-apiconfigset)
* [`claire api:invitation:create`](#claire-apiinvitationcreate)
* [`claire api:invitation:list`](#claire-apiinvitationlist)
* [`claire api:project:create`](#claire-apiprojectcreate)
* [`claire api:project:set`](#claire-apiprojectset)
* [`claire api:project:show [PROJECTID]`](#claire-apiprojectshow-projectid)
* [`claire api:question:show [QUESTIONID]`](#claire-apiquestionshow-questionid)
* [`claire api:team:create`](#claire-apiteamcreate)
* [`claire api:team:list`](#claire-apiteamlist)
* [`claire api:team:show`](#claire-apiteamshow)
* [`claire ask`](#claire-ask)
* [`claire config`](#claire-config)
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

## `claire api:config:get`

Manage teams (list, show, create)

```
USAGE
  $ claire api:config:get

DESCRIPTION
  Manage teams (list, show, create)
```

_See code: [src/commands/api/config/get.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/config/get.ts)_

## `claire api:config:set`

Manage teams (list, show, create)

```
USAGE
  $ claire api:config:set [-t <value>] [-p <value>]

FLAGS
  -p, --project_id=<value>  Set project to use with CLaiRE API
  -t, --team_id=<value>     Set team to use with CLaiRE API

DESCRIPTION
  Manage teams (list, show, create)
```

_See code: [src/commands/api/config/set.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/config/set.ts)_

## `claire api:invitation:create`

Manage invitations (list, show, create)

```
USAGE
  $ claire api:invitation:create [--email <value>]

FLAGS
  --email=<value>  Email of the invitee

DESCRIPTION
  Manage invitations (list, show, create)
```

_See code: [src/commands/api/invitation/create.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/invitation/create.ts)_

## `claire api:invitation:list`

Manage invitations (list, show, create)

```
USAGE
  $ claire api:invitation:list [-t <value>] [-p <value>]

FLAGS
  -p, --project_id=<value>  Project ID
  -t, --team_id=<value>     Team ID

DESCRIPTION
  Manage invitations (list, show, create)
```

_See code: [src/commands/api/invitation/list.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/invitation/list.ts)_

## `claire api:project:create`

Create new project in CLaiRE API

```
USAGE
  $ claire api:project:create [--name <value>] [--description <value>] [--token_allowance <value>] [--team_id <value>]

FLAGS
  --description=<value>      Project description
  --name=<value>             Project name
  --team_id=<value>          Team ID
  --token_allowance=<value>  Token spend limit (default 100000)

DESCRIPTION
  Create new project in CLaiRE API
```

_See code: [src/commands/api/project/create.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/project/create.ts)_

## `claire api:project:set`

List users projects and set active project in CLaiRE config.

```
USAGE
  $ claire api:project:set

DESCRIPTION
  List users projects and set active project in CLaiRE config.
```

_See code: [src/commands/api/project/set.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/project/set.ts)_

## `claire api:project:show [PROJECTID]`

Show information for CLaiRE project

```
USAGE
  $ claire api:project:show [PROJECTID] [--list] [-p <value>]

ARGUMENTS
  PROJECTID  ID of project to display

FLAGS
  -p, --projectId=<value>  ID of project to display
      --list               List projects and select to view

DESCRIPTION
  Show information for CLaiRE project
```

_See code: [src/commands/api/project/show.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/project/show.ts)_

## `claire api:question:show [QUESTIONID]`

Show details for CLaiRE question

```
USAGE
  $ claire api:question:show [QUESTIONID] [--list] [-q <value>] [-s]

ARGUMENTS
  QUESTIONID  ID of question to display

FLAGS
  -q, --questionId=<value>  ID of question to display
  -s, --skipResponse        Do not include question response in output
      --list                List questions and select to view

DESCRIPTION
  Show details for CLaiRE question
```

_See code: [src/commands/api/question/show.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/question/show.ts)_

## `claire api:team:create`

Manage teams (list, show, create)

```
USAGE
  $ claire api:team:create [--name <value>] [--description <value>] [--token_allowance <value>]

FLAGS
  --description=<value>      Team description
  --name=<value>             Team name
  --token_allowance=<value>  Token spend limit (default 100000)

DESCRIPTION
  Manage teams (list, show, create)
```

_See code: [src/commands/api/team/create.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/team/create.ts)_

## `claire api:team:list`

Manage teams (list, show, create)

```
USAGE
  $ claire api:team:list

DESCRIPTION
  Manage teams (list, show, create)
```

_See code: [src/commands/api/team/list.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/team/list.ts)_

## `claire api:team:show`

Manage teams (list, show, create)

```
USAGE
  $ claire api:team:show [-t <value>]

FLAGS
  -t, --team=<value>  Show a specific team

DESCRIPTION
  Manage teams (list, show, create)
```

_See code: [src/commands/api/team/show.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/api/team/show.ts)_

## `claire ask`

Send a prompt to Claire API and retrieve a response.

```
USAGE
  $ claire ask [-p <value>] [-F <value>...] [-m <value>]

FLAGS
  -F, --inputFile=<value>...  Path to file(s) containing the question input
  -m, --model=<value>         [default: default-model] Claire API model selection
  -p, --prompt=<value>        Prompt to send

DESCRIPTION
  Send a prompt to Claire API and retrieve a response.
```

_See code: [src/commands/ask.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/ask.ts)_

## `claire config`

Configure API settings such as API key, email, API URL, and selected project.

```
USAGE
  $ claire config [-k <value>] [-e <value>] [-u <value>] [-p <value>] [-n <value>]

FLAGS
  -e, --email=<value>        Set user email
  -k, --authToken=<value>    Set CLaiRE API key
  -n, --projectName=<value>  Set selected project name
  -p, --projectId=<value>    Set selected project ID
  -u, --apiUrl=<value>       Set API base URL

DESCRIPTION
  Configure API settings such as API key, email, API URL, and selected project.
```

_See code: [src/commands/config.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/config.ts)_

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
