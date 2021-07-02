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

import { Writable } from "stream"
import { _also, ColorConsole, sleep, Styles } from "r3bl-ts-utils"
import { ConsoleLogSkip, Constants } from "./Constants"
import * as fs from "fs"

/**
 * Many different ways of creating a Writable - https://stackoverflow.com/a/21583831/2085356
 */
class DummyWritable extends Writable {
  totalCharsWritten = 0

  constructor() {
    super()
    this.on("finish", () => {
      ColorConsole.create(Styles.Primary.blue)("DummyWritable - finished writing").consoleLog()
    })
  }

  _write(data: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    this.totalCharsWritten += data.length
    if (this.totalCharsWritten % ConsoleLogSkip.DummyOutputStreamCharsWritten === 0) {
      ColorConsole.create(Styles.Primary.red)(
        `DummyOutputStream - written: ${this.totalCharsWritten} chars`
      ).consoleLog()
    }
    callback()
  }
}

export class ReadLargeFileEfficiently {
  /**
   * File reads are asynchronous by nature. So when the `pipe()` function is called on a stream that
   * happens asynchronously so there's no waiting for it to finish. `pipe()` returns an
   * `EventEmitter`.
   *
   * - https://nodejs.org/es/docs/guides/backpressuring-in-streams/
   * - https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/
   */
  performRead = async (): Promise<void> => {
    let totalBytesRead = 0
    let fileSizeInBytes = 0

    // 1. Create the DummyWritable.
    const dummyWritable = new DummyWritable()

    // 2. Setup the fileInputReadable.
    const fileInputReadable = _also(fs.createReadStream(Constants.filePath), (it) => {
      it.on("data", (data) => {
        totalBytesRead += data.length
        const percentCopied = Math.round((totalBytesRead / fileSizeInBytes) * 100)
        if (totalBytesRead % ConsoleLogSkip.ReadLargeFileEfficientlyBytesRead === 0) {
          ColorConsole.create(Styles.Primary.green)(
            `FileInputStream - Reading: ${percentCopied}%, data.length:${data.length}, totalBytesRead:${totalBytesRead}, fileSize:${fileSizeInBytes}`
          ).consoleLog()
        }
      })
    })

    // 3. Kick things off if Constants.filePath exists.
    const stats = await fs.promises.stat(Constants.filePath)
    fileSizeInBytes = stats.size
    // This kicks off an async operation. No awaiting on this.
    fileInputReadable.pipe(dummyWritable)

    // Wait for async pipe read to finish.
    ColorConsole.create(Styles.Primary.blue)(
      "Waiting for pipe read to finish for 5s..."
    ).consoleLog()
    await sleep(5000)
  }
}
