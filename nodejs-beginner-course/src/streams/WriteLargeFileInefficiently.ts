import * as fs from "fs"
import { WriteStream } from "fs"
import { ConsoleLogSkip, Constants } from "./Constants"
import { fetchLoremIpsumFromAPI, printMemoryUsage, sleep } from "../core-utils/misc-utils"
import { ColorConsole, textStyle1, textStyle2 } from "../core-utils/color-console-utils"

export class WriteLargeFileInefficiently {
  /**
   * This method consumes a huge amount of RAM because data is created faster than it can be
   * written do disk, causing the system to buffer the data that hasn't been written to disk into
   * RAM! This is not efficient, and the better way to do this is to use `pipe()` which
   * automatically applies "back pressure".
   * https://medium.com/dev-bits/writing-memory-efficient-software-applications-in-node-js-5575f646b67f
   *
   * Additionally just because the `fs` API reports that the file has been written does not mean
   * that it has been flushed to disk by the OS file system. If a `fs.stat()` is done just after
   * a large file is written to disk, the file size might be reported incorrectly, since it is
   * still being buffered and written to disk in the background by the OS.
   */
  performWrite = async (): Promise<void> => {
    const fileOutputStream: WriteStream = fs.createWriteStream(Constants.filePath)
    const line: string = await fetchLoremIpsumFromAPI()
    let charCount = 0
    for (let lineCount: number = 0; lineCount < Constants.maxLinesToWrite; lineCount++) {
      fileOutputStream.write(line, Constants.encoding)
      if (lineCount % ConsoleLogSkip.WriteLargeFileInefficiently === 0) {
        printMemoryUsage(`line: ${textStyle2(lineCount)}`)
      }
      charCount += line.length
    }
    fileOutputStream.end()
    ColorConsole.create(textStyle1)(`Total string length = ${charCount} chars`).consoleLog(true)

    // Wait for disk flush.
    ColorConsole.create(textStyle1.blue)(
      "Waiting for disk to flush the write to file for 5s..."
    ).consoleLog()
    await sleep(5000)
  }
}
