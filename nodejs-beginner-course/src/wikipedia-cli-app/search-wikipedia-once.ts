#!/usr/bin/env ts-node

/*
 * Copyright 2021 Nazmul Idris All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

import {
  getSearchResultsFromWikipediaAsynchronously,
  saveStringToFileAsynchronously,
} from "./wikipedia-api-utils"

const main = async (argv: Array<string>) => {
  if (argv.length === 0) {
    console.log("⚠️ Please pass the search term as an argument!")
    process.exit(1)
  }
  const searchTerm = argv.join(" ").toLowerCase()
  console.log(searchTerm)
  const response: string = await getSearchResultsFromWikipediaAsynchronously(searchTerm)

  console.log(`🚀 Got response from Wikipedia API: ${response}`)
  const filename = `${searchTerm.replace(" ", "-")}.json`

  await saveStringToFileAsynchronously(response, filename)
  console.log(`🚀 Saved file ${filename} 🧚`)
}

/**
 * Dump all the command line arguments to console.
 * More info: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
 */
main(process.argv.splice(2))
