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

## npm scripts

There are two sets of scripts, ones that just run a command once, and others that start them in
watch mode (very mich like webpack hot-reload).

- To run any of the following scripts you can execute `npm run <SCRIPT_NAME>`.
- However, to run the `run.fish` script, you have to just execute it using `./run.fish`.

### One off scripts

| Task                     | Script          | Notes                                                  |
| ------------------------ | --------------- | ------------------------------------------------------ |
| Compiling                | `build`         | run`tsc` to generate JS files in the `dist` folder.    |
| Running (no compilation) | `start`         | run the `dist/cli.js` file (make sure its executable). |
| Compiling and running    | `build-and-run` | run the `build` script, then the `dist/cli.js` file.   |
| Run tests                | `test`          | run all the Jest tests (no need for compiling).        |

Notes about `start` script:

1. Make sure to mark `dist/cli.js` file as executable so that this self executing module can run.
2. To pass command line arguments you can use `npm run start -- --name=Grogu`.
3. You can also run `npm exec -c 'ink-cli-app --name=Grogu'`.

### Watch mode scripts (hot-reload)

| Task                          | Script        | Notes                                                                                          |
| ----------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| Compiling                     | `build-watch` | run`tsc` and watch for changes.                                                                |
| Compiling and running         | `dev`         | run `nodemon` & watch for changes in `ts`, `tsx`, `json` files; run `build-and-run` on change. |
| Compiling and running forever | `run.fish`    | run `forever` to run the `dev` script & restart it when it fails.                              |
