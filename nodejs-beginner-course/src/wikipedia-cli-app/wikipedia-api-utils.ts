// Import instead of require: https://stackoverflow.com/a/43708548/2085356
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
 * Note that writeFile() is an asynchronous function, meaning that it returns
 * immediately, but writes the file at some later time.
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

export {getSearchResultsFromWikipediaAsynchronously, saveStringToFileAsynchronously}
