# ink-cli-app3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Template repo for this project](#template-repo-for-this-project)
- [Emoji problems on Linux](#emoji-problems-on-linux)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Template repo for this project

This project is based on the [ts-ink-template](https://github.com/nazmulidris/ts-ink-template)
template repo that allows you to create CLI apps using Ink v3. Please refer to this
[README](https://github.com/nazmulidris/ts-ink-template/blob/main/README.md) in order to learn more
about the npm scripts provided, IDEA run configurations, getting template updates, etc.

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
