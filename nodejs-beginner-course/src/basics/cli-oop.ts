#!/usr/bin/env ts-node

import * as readline from "readline"
import * as chalk from "chalk"

class UIStrings {
  public static readonly closeCommand = "quit"
  public static readonly userPrompt = `> Please type "${UIStrings.closeCommand}" or ${chalk.red(
    "Ctrl+C"
  )} to exit 🐾`
}

class CommandLineInterface {
  private readonly consoleInterface: readline.Interface

  constructor(message: string) {
    this.consoleInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    this.consoleInterface.on("line", this.onLineEntered)
    this.consoleInterface.on("close", this.onControlCPressed)
    this.setPrompt(message)
  }

  stop = () => {
    this.consoleInterface.close()
  }

  start = () => {
    this.consoleInterface.prompt()
  }

  setPrompt = (message: string) => {
    this.consoleInterface.setPrompt(message)
  }

  private onLineEntered = (line: string) => {
    switch (line) {
      case UIStrings.closeCommand:
        this.stop()
        return
      default:
        console.log(`> 🚀 You typed: ${chalk.yellow(line)}`)
        this.start()
    }
  }

  private onControlCPressed = () => {
    console.log(chalk.red("Goodbye!"))
    this.stop()
  }
}

const main = async (argv: Array<string>) => {
  const cli = new CommandLineInterface(UIStrings.userPrompt)
  cli.start()
}

/**
 * Dump all the command line arguments to console.
 * More info: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
 */
main(process.argv.splice(2))
