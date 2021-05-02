#!/usr/bin/env ts-node

/*
  Note that this script is a TypeScript self executing file.
  1. Make sure that you have `ts-node` installed in your system using
    `sudo npm install -g typescript ts-node`.
    More info: https://www.npmjs.com/package/ts-node.
  2. Make sure to make this file executable using `chmod +x <filename>`
   - In order to make any file executable, you have to run `chmod +x <filename>`.
   - Note that the `she-bang` line MUST be the first line in your executable script.
   - More about `she-bang`: https://en.wikipedia.org/wiki/Shebang_(Unix)
*/

import * as readline from "readline"
import * as chalk from "chalk"

enum Messages {
  closeCommand = "quit",
  userPrompt = "Type something",
}

type ConsoleInterfaceCallbackFn = (whatTheUserTyped: string) => void

function promptUserForInputViaConsoleInterface() {
  const processWhatTheUserTyped: ConsoleInterfaceCallbackFn = (whatTheUserTyped) =>
    userInputHandler(whatTheUserTyped.toLowerCase())
  ourConsoleInterface.question(chalk.green(`${Messages.userPrompt}: `), processWhatTheUserTyped)
}

function userInputHandler(userInput: string) {
  // closeCommand issued. Stop the program by shutting the waiter down.
  if (userInput === Messages.closeCommand) {
    ourConsoleInterface.close()
    return
  }
  console.log(`🚀 You typed: ${chalk.yellow(userInput)}`)
  promptUserForInputViaConsoleInterface()
}

/**
 * https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
 * - `Interface` can be file or console.
 */
function createReadlineConsoleInterface(): readline.Interface {
  const onCloseRequest = () => {
    console.log(chalk.red("Goodbye!"))
    consoleInterface.close()
  }
  const consoleInterface: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  consoleInterface.on("close", onCloseRequest)
  return consoleInterface
}

const ourConsoleInterface: readline.Interface = createReadlineConsoleInterface()

const main = async (argv: Array<string>) => {
  console.log(`Please type "${Messages.closeCommand}" or ${chalk.red("Ctrl+C")} to exit 🐾`)
  promptUserForInputViaConsoleInterface()
}

/**
 * Dump all the command line arguments to console.
 * More info: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
 */
main(process.argv.splice(2))
