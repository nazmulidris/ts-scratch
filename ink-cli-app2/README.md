# ts-ink-template

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What is this?](#what-is-this)
  - [npm scripts](#npm-scripts)
  - [IDEA Run Configurations](#idea-run-configurations)
- [How to update the template](#how-to-update-the-template)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is this?

This project is based on the [ts-ink-template](https://github.com/nazmulidris/ts-ink-template)
template repo that allows you to create CLI apps using Ink v3. Please refer to this
[README](https://github.com/nazmulidris/ts-ink-template/blob/main/README.md) in order to learn more
about the npm scripts provided, IDEA run configurations, getting template updates, etc.

## Running this executable node module

After cloning or forking this repo, you can change the `name` of your CLI app in `package.json`.
Then you can run the following commands to make your CLI app executable and be able to run it from
anywhere on your machine.

```shell
$ npm run build
$ chmod +x /dist/cli.js
$ npm link
```

## Watch mode

You can execute the following independent of each other.

1. Compiling - `npm run build-watch` starts `tsc` and watches for changes.
2. Running - `npm run dev` starts `nodemon` to watch for changes in `ts`, `tsx`, and `json` files
   and runs `npm run build-and-run` when they do.
