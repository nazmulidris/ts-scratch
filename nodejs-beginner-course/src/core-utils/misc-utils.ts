import { ColorConsole, Styles } from "./color-console-utils"
import * as prettyBytes from "pretty-bytes"
import { _also } from "./kotlin-lang-utils"
import * as _ from "lodash"
import axios, { AxiosResponse } from "axios"

export const sleep = (ms: number = 500) => {
  const sprites = ["-", "\\", "-", "/"]

  let count = 0
  const printDotsInterval = setInterval(() => {
    ColorConsole.create(Styles.Primary.cyan)(
      "Sleep " + sprites[count++ % sprites.length]
    ).consoleLogInPlace()
  }, 100)

  return new Promise<void>((resolveFn) => {
    setTimeout(() => {
      clearInterval(printDotsInterval)
      console.log()
      resolveFn()
    }, ms)
  })
}

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
    rss: Styles.Secondary(prettyBytes(memoryUsage.rss)),
    heapUsed: Styles.Secondary(prettyBytes(memoryUsage.heapUsed)),
    heapTotal: Styles.Secondary(prettyBytes(memoryUsage.heapTotal)),
    external: Styles.Secondary(prettyBytes(memoryUsage.external)),
    arrayBuffers: Styles.Secondary(prettyBytes(memoryUsage.arrayBuffers)),
  }
  const consoleLogOutput = _also(new Array<string>(), (it) => {
    for (const snapshotKey in snapshot) {
      it.push(snapshotKey + "-" + _.get(snapshot, snapshotKey))
    }
  })
  ColorConsole.create(Styles.Primary.red)(
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
