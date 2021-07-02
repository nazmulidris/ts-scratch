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

import { _also, ColorConsole, Styles } from "r3bl-ts-utils"
import * as prettyBytes from "pretty-bytes"
import * as _ from "lodash"
import axios, { AxiosResponse } from "axios"

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
