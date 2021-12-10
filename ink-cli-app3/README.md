# ink-cli-app3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Template repo for this project](#template-repo-for-this-project)
- [Code structure - main sample, and smaller single file samples](#code-structure---main-sample-and-smaller-single-file-samples)
- [Emoji problems on Linux](#emoji-problems-on-linux)
- [Keyboard issues on Pop_OS! 21.04 & Node.js v17.x.x](#keyboard-issues-on-pop_os-2104--nodejs-v17xx)
  - [nvm installation](#nvm-installation)
  - [iohook installation](#iohook-installation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Template repo for this project

This project is based on the [ts-ink-template](https://github.com/nazmulidris/ts-ink-template)
template repo that allows you to create CLI apps using Ink v3. Please refer to this
[README](https://github.com/nazmulidris/ts-ink-template/blob/main/README.md) in order to learn more
about the npm scripts provided, IDEA run configurations, getting template updates, etc.

## Code structure - main sample, and smaller single file samples

In addition to the main sample in the `src` folder that's launched via `cli.tsx`, there's an
`examples` folder which contains a lot of smaller single file samples which are really useful
snippets to understand how a specific feature or library work. You can simply run each of them from
the terminal by executing their TS file, eg: `npm -r tsm src/examples/use-input-example.tsx`.

Here is the list of 1 file samples (in `src/examples/`).

1. `use-input-example.tsx`
2. `use-focus.tsx`

## Emoji problems on Linux

When using emoji on Linux (Pop_OS! 21.04 w/ X11) there are some serious problems related to figuring
out the width of Unicode emoji characters which breaks the layout that Yoga generates. And sometimes
it produces some strange extra characters and other whacky rendering artifacts. These problems arise
when running the CLI app in Tilix, GNOME Terminal, VSCode terminal, and IDEA terminal (which doesn't
show emoji at all, just strange characters where the emoji characters are supposed to be).

Here are some references to similar problems in other Linux software:

1. https://bugs.launchpad.net/ubuntu/+source/gnome-terminal/+bug/1665140
2. https://lists.gnu.org/archive/html/bug-ncurses/2019-02/msg00003.html
3. https://gitlab.freedesktop.org/terminal-wg/specifications/-/issues/9
4. https://github.com/microsoft/terminal/issues/4345
5. https://github.com/xtermjs/xterm.js/issues/1709

## Keyboard issues on Pop_OS! 21.04 & Node.js v17.x.x

The default Node.js keypress handler doesn't really work properly for all key input events. It may
have something to do w/ Ubuntu 21.04 that I'm using, or the tiling window manager that Pop_OS! has.
I tried using `keypress` event directly on Node.js (which is what the `keypress` npm package does)
and it works the same as Ink `useInput()`.

Then I tried `iohook` which only works on Node.js v15 & Ubuntu 20.04, and I couldn't get it work. I
used nvm for v15, but couldn't do anything about the wrong Ubuntu version.

### nvm installation

To install `nvm` use:

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

After installation, you will get output like this if you used homebrew to install node.

```text
=> Appending nvm source string to /home/nazmul/.profile
=> bash_completion source string already in /home/nazmul/.profile
=> You currently have modules installed globally with `npm`. These will no
=> longer be linked to the active version of Node when you install a new node
=> with `nvm`; and they may (depending on how you construct your `$PATH`)
=> override the binaries of modules installed with `nvm`:

/home/linuxbrew/.linuxbrew/lib
├── @cspotcode/source-map-consumer@0.8.0
├── @cspotcode/source-map-support@0.7.0
├── @types/node@16.11.10
├── doctoc@2.1.0
├── prettier@2.4.1
├── ts-node-dev@1.1.8
├── ts-node@10.4.0
└── typescript@4.5.2
=> If you wish to uninstall them at a later point (or re-install them under your
=> `nvm` Nodes), you can remove them from the system Node as follows:

     $ nvm use system
     $ npm uninstall -g a_module

=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
```

Use [with fish](https://eshlox.net/2019/01/27/how-to-use-nvm-with-fish-shell).

```text
function nvm
  bass source ~/.nvm/nvm.sh --no-use ';' nvm $argv
end
```

You can create an `.nvmrc` file in your project, and then run `nvm install ; nvm use` to activate
it. This file just contains a single string which is the output of `node -v`. A sample file can look
like this.

```text
v15.8.0
```

### iohook installation

[iohook 0.9.3](https://wilix-team.github.io/iohook/installation.html) only works on Node.js v15.x.x.
The latest v15 is [`v15.8.0`](https://nodejs.org/uk/blog/release/v15.8.0/).

iohook can be installed in the project using this command `npm install iohook --save`.

Then `package.json` has to be updated w/ the
[ABI version number](https://nodejs.org/en/download/releases/) for the Node.js version used here.
The ABI number for `v15.8.0` is `88`. Here's
[documentation](https://wilix-team.github.io/iohook/usage.html#generic-node-application) on how to
use this in a Node.js application.

```json
{
  "iohook": {
    "targets": ["node-88"],
    "platforms": ["win32", "darwin", "linux"],
    "arches": ["x64", "ia32"]
  }
}
```

Finally here's some a hook that can be used to debug these events.

```tsx
/**
 * https://wilix-team.github.io/iohook/usage.html#generic-node-application
 * https://wilix-team.github.io/iohook/usage.html#available-events
 */
function useIoHook() {
  const DEBUG = true
  useEffect(fun, [])
  function fun() {
    iohook.on("keyup", (event) => console.log("keyup", event))
    iohook.on("keydown", (event) => console.log("keydown", event))
    iohook.on("mousemove", (event) => console.log("mousemove", event))
    iohook.start(DEBUG) // enable logging in debug mode.
  }
}
```
