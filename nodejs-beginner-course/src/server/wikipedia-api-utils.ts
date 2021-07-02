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

import fetch from "node-fetch"
import * as fs from "fs"

const getSearchResultsFromWikipediaAsynchronously = async (searchTerm: string): Promise<string> => {
  const urlToFetch =
    "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=5"
  const searchArgumentToEncode = `gsrsearch=${searchTerm}`

  try {
    const response = await fetch(`${urlToFetch}&${searchArgumentToEncode}`)
    const json = await response.json()
    const jsonString: string = JSON.stringify(json, null, 2)
    return jsonString
  } catch (error) {
    console.error(error.response.body)
    return "Error!"
  }
}

/**
 * Note that writeFile() is an asynchronous function, meaning that it returns immediately, but
 * writes the file at some later time.
 * @param stringData
 * @param filename
 */
const saveStringToFileAsynchronously = async (
  stringData: string,
  filename: string
): Promise<void> => {
  try {
    return fs.promises.writeFile(filename, stringData)
  } catch (error) {
    console.error(error)
  }
}

export { getSearchResultsFromWikipediaAsynchronously, saveStringToFileAsynchronously }
