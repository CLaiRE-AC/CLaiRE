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
* [`claire ask`](#claire-ask)
* [`claire config`](#claire-config)
* [`claire help [COMMAND]`](#claire-help-command)
* [`claire plugins`](#claire-plugins)
* [`claire plugins add PLUGIN`](#claire-plugins-add-plugin)
* [`claire plugins:inspect PLUGIN...`](#claire-pluginsinspect-plugin)
* [`claire plugins install PLUGIN`](#claire-plugins-install-plugin)
* [`claire plugins link PATH`](#claire-plugins-link-path)
* [`claire plugins remove [PLUGIN]`](#claire-plugins-remove-plugin)
* [`claire plugins reset`](#claire-plugins-reset)
* [`claire plugins uninstall [PLUGIN]`](#claire-plugins-uninstall-plugin)
* [`claire plugins unlink [PLUGIN]`](#claire-plugins-unlink-plugin)
* [`claire plugins update`](#claire-plugins-update)

## `claire ask`

Send a prompt to OpenAI and maintain conversation history

```
USAGE
  $ claire ask -p <value> [-m <value>] [-s] [-f <value>]

FLAGS
  -f, --file=<value>    [default: /Users/himnme/Workspace/claire/history.json] Optional file path to save conversation
                        history
  -m, --model=<value>   [default: chatgpt-4o-latest] OpenAI model
  -p, --prompt=<value>  (required) Prompt to send
  -s, --save            Save conversation history

DESCRIPTION
  Send a prompt to OpenAI and maintain conversation history
```

_See code: [src/commands/ask.ts](https://github.com/netuoso/claire/claire/blob/v0.0.0/src/commands/ask.ts)_

## `claire config`

Configure API key and email for automatic use.

```
USAGE
  $ claire config [-k <value>] [-e <value>] [-s]

FLAGS
  -e, --email=<value>   Set user email
  -k, --apiKey=<value>  Set OpenAI API key
  -s, --show            Show current config

DESCRIPTION
  Configure API key and email for automatic use.
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

## `claire plugins add PLUGIN`

Installs a plugin into claire.

```
USAGE
  $ claire plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

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
  $ claire plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ claire plugins add myplugin

  Install a plugin from a github url.

    $ claire plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ claire plugins add someuser/someplugin
```

## `claire plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ claire plugins inspect PLUGIN...

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
  $ claire plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/inspect.ts)_

## `claire plugins install PLUGIN`

Installs a plugin into claire.

```
USAGE
  $ claire plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

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
  $ claire plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ claire plugins install myplugin

  Install a plugin from a github url.

    $ claire plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ claire plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/install.ts)_

## `claire plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ claire plugins link PATH [-h] [--install] [-v]

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
  $ claire plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/link.ts)_

## `claire plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ claire plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ claire plugins unlink
  $ claire plugins remove

EXAMPLES
  $ claire plugins remove myplugin
```

## `claire plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ claire plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/reset.ts)_

## `claire plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ claire plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ claire plugins unlink
  $ claire plugins remove

EXAMPLES
  $ claire plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/uninstall.ts)_

## `claire plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ claire plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ claire plugins unlink
  $ claire plugins remove

EXAMPLES
  $ claire plugins unlink myplugin
```

## `claire plugins update`

Update installed plugins.

```
USAGE
  $ claire plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.31/src/commands/plugins/update.ts)_
<!-- commandsstop -->
