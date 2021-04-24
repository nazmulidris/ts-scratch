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

import * as chalk from "chalk"
import * as readline from "readline"
import {
  getSearchResultsFromWikipediaAsynchronously,
  saveStringToFileAsynchronously,
} from "./wikipedia-api-utils"

enum UIStrings {
  closeCommand = "exit",
  searchWikipediaPrompt = "Search Wikipedia: "
}

class CommandShell {
  readonly ourWaiter: readline.Interface
  readonly ourArgs: string[]
  
  constructor() {
    this.ourArgs = process.argv.splice(2)
    
    this.ourWaiter = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    this.setupReadlineWaiter()
    
    console.log(`Type "${chalk.red(UIStrings.closeCommand)}" or ${chalk.red("Ctrl+C")} to exit 🐾`)
    console.log(`Command line args passed: ${chalk.yellow(this.ourArgs)}`)
    
    this.promptUserForSearchTermAsynchronous()
  }
  
  /**
   * https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
   */
  setupReadlineWaiter = () => {
    const handleOnCloseRequest = () => {
      console.log(chalk.yellow("Goodbye!"))
      this.ourWaiter.close()
    }
    this.ourWaiter.on("close", handleOnCloseRequest)
  }
  
  promptUserForSearchTermAsynchronous = () => {
    const handleWhatUserTyped = (whatTheUserTyped: string) =>
      this.onSearchWikipediaRequest(whatTheUserTyped.toLowerCase())
    this.ourWaiter.question(UIStrings.searchWikipediaPrompt, handleWhatUserTyped)
  }
  
  onSearchWikipediaRequest = async (searchTerm: string) => {
    // closeCommand issued. Stop the program by shutting the waiter down.
    if (searchTerm === UIStrings.closeCommand) {
      this.ourWaiter.close()
      return
    }
    
    // BLOCKING (RESPONSE)
    const response: string = await getSearchResultsFromWikipediaAsynchronously(searchTerm)
    console.log(`🚀 Got response from Wikipedia API: ${response} 💪`)
    const filename = `${searchTerm.replace(" ", "-")}.json`
    
    // BLOCKING (WRITE DATA TO FILE)
    await saveStringToFileAsynchronously(response, filename)
    console.log(`🚀 Saved file ${filename} 🧚`)
    
    this.promptUserForSearchTermAsynchronous()
  }
  
}

const main = async () => {
  new CommandShell()
}

/**
 * Dump all the command line arguments to console.
 * More info: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
 */
main()
