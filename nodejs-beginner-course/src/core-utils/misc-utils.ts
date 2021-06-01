import { ColorConsole, textStyle1, textStyle2 } from "./color-console-utils"
import * as prettyBytes from "pretty-bytes"
import { _also } from "./kotlin-lang-utils"
import * as _ from "lodash"
import axios, { AxiosResponse } from "axios"

export const sleep = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * https://www.dynatrace.com/news/blog/understanding-garbage-collection-and-hunting-memory-leaks-in-node-js/
 * https://www.npmjs.com/package/pretty-bytes
 */
export const printMemoryUsage = (
  message: string,
  printInPlace: boolean = true,
  padding: number = 20
): void => {
  const memoryUsage: NodeJS.MemoryUsage = process.memoryUsage()
  const snapshot: {
    heapUsed: string
    rss: string
    heapTotal: string
    external: string
    arrayBuffers: string
  } = {
    rss: textStyle2(prettyBytes(memoryUsage.rss)),
    heapUsed: textStyle2(prettyBytes(memoryUsage.heapUsed)),
    heapTotal: textStyle2(prettyBytes(memoryUsage.heapTotal)),
    external: textStyle2(prettyBytes(memoryUsage.external)),
    arrayBuffers: textStyle2(prettyBytes(memoryUsage.arrayBuffers)),
  }
  const consoleLogOutput = _also(new Array<string>(), (it) => {
    for (const snapshotKey in snapshot) {
      it.push(snapshotKey + "-" + _.get(snapshot, snapshotKey))
    }
  })
  ColorConsole.create(textStyle1.red)(
    message.padStart(padding, ">") + " " + consoleLogOutput.join(", ")
  ).consoleLogInPlace(!printInPlace)
}

export const fetchLoremIpsumFromAPI = async (): Promise<string> => {
  try {
    const response: AxiosResponse<string> = await axios.get<string>(
      "https://baconipsum.com/api/?type=meat-and-filler&paras=5&format=text"
    )
    return response.data
  } catch (err) {
    console.error(err)
    return `${Date.now()} Tenderloin dolore chislic sint cow short ribs pork minim veniam turkey`.repeat(
      10
    )
  }
}
