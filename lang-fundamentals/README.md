# ts-scratch

This project contains a bunch of TypeScript experiments, in the process of learning the language. The project is built
using webpack, and is a command line project.

## Docs

- Language guide

  - [5 minute quick start](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
  - [Basic types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
  - [30m guide](https://www.typescriptlang.org/docs/handbook/intro.html)
  - [Module system](https://www.typescriptlang.org/docs/handbook/modules.html)
  - [Scoping and variables](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)
  - [Functions](https://www.typescriptlang.org/docs/handbook/functions.html)

- Webpack configuration

  - [Configure webpack for TypeScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
  - [Install webpack](https://webpack.js.org/guides/getting-started/)

- IDEA configuration
  - [IDEA & Typescript](https://www.jetbrains.com/help/idea/typescript-support.html)
    - [Debugging TypeScript](https://www.jetbrains.com/help/idea/running-and-debugging-typescript.html)
    - [ts-node](https://github.com/TypeStrong/ts-node)
    - [ts-node-dev](https://github.com/whitecolor/ts-node-dev)

## Steps taken to get this working w/ Webpack

1. Run `npm init` to create a node module in the project's root folder.
2. Install webpack using the "Install webpack" guide above.

- Deps: `webpack`, `webpack-cli`, `typescript`

3. Use the "Configured webpack for TypeScript" link above to:

- Install the npm deps: `awesome-typescript-loader`, `source-map-loader`
- Create the `webpack.config.js` file

4. Update the package.json file w/ scripts to:

- "build" - simply runs `npx webpack` to build the project
- "start" - simply runs the `dist/bundle.js` in node

## Steps taken to get this working w/ IDEA

1. Create a NodeJS run configuration for the TS file called "ts-node index.ts"

- Install the npm deps: `ts-node` so there's no need to compile TS file to JS before running/debugging it
- Pass `--require ts-node/register` to the node parameters, so that `ts-node` is loaded at the start
- Select the `src/index.ts` file to actually run (there is no need to compile the TS file since we are using `ts-node`)

2. Create a `ts-node` run configuration for the TS file called "ts-node index.ts (alt)"

- Install the npm deps: `ts-node` so there's no need to compile TS file to JS before running/debugging it
- Instead of the `node` runtime, pass the `$PROJECT_ROOT/node_modules/ts-node/dist/bin.js` as the node interpreter
- Select the `src/index.ts` file to actually run (there is no need to compile the TS file since we are using `ts-node`)

## Steps taken to get this working w/ Visual Studio Code

1. A `launch.json` file is provided to run the program in the VSCode debugger. This basically uses `tsconfig.js` (and
   not Webpack) in order to compile (and debug) the TS files. The compiled output is dumped into the `build` folder and
   not the `dist` folder (used by Webpack).

## Instructions for you to run this

1. In your terminal

```
npm i
npm run build
npm run start
```

2. To run / debug this in IDEA, you can use the "ts-node index.ts" or "ts-node index.ts (alt)" run config.
