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

import {createInterface, Interface} from "readline";
import {
  getSearchResultsFromWikipediaAsynchronously,
  saveStringToFileAsynchronously,
} from "./wikipedia-api-utils";

const closeCommand: string = "close!";
const searchWikipediaPrompt: string = "Search Wikipedia: ";

const promptUserForSearchTermAsynchronous = (myWaiter: Interface) => {
  myWaiter.question(searchWikipediaPrompt, (whatTheUserTyped: string) =>
    onSearchWikipediaRequest(whatTheUserTyped.toLowerCase(), myWaiter)
  );
};

const onSearchWikipediaRequest = async (searchTerm: string, myWaiter: Interface) => {
  // closeCommand issued. Stop the program by shutting the waiter down.
  if (searchTerm === closeCommand) {
    myWaiter.close();
    return;
  }
  
  // NON BLOCKING (🐾 RESPONSE)
  // const promiseForTheResponse: Promise<string> = getSearchResultsFromWikipediaAsynchronously(
  //   searchTerm
  // );
  // promiseForTheResponse.then((actualResponse) => {
  //   console.log(actualResponse);
  // });
  
  // BLOCKING (🐾 RESPONSE)
  const response: string = await getSearchResultsFromWikipediaAsynchronously(searchTerm);
  console.log(`🚀 Got response from Wikipedia API: ${response}`);
  const filename = `${searchTerm.replace(" ", "-")}.json`;
  
  // BLOCKING (WRITE DATA TO FILE)
  await saveStringToFileAsynchronously(response, filename);
  console.log(`🚀 Saved file ${filename} 🧚`);
  
  // NON BLOCKING
  // const myPromise: Promise<void> = saveStringToFileAsynchronously(
  //   response,
  //   filename
  // );
  // myPromise.then((bla) => {
  //   console.log(bla);
  // });
  
  promptUserForSearchTermAsynchronous(myWaiter);
};

/**
 * https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
 */
function createReadlineWaiter(): Interface {
  const onCloseRequest = () => {
    console.log("Goodbye!");
    process.exit();
  };
  const waiter: Interface = createInterface({
                                              input: process.stdin,
                                              output: process.stdout,
                                            });
  waiter.on("close", onCloseRequest);
  return waiter;
}

const main = async (argv: Array<string>) => {
  console.log(`Please type "${closeCommand}" or "Ctrl+C" in order to exit this app 🐾`);
  const myWaiter: Interface = createReadlineWaiter();
  promptUserForSearchTermAsynchronous(myWaiter);
};

/**
 * Dump all the command line arguments to console.
 * More info: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
 */
main(process.argv.splice(2));
