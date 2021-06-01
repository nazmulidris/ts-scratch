import { ColorConsole, textStyle1, textStyle2 } from "../core-utils/color-console-utils"
import { ConsoleLogSkip, Constants } from "./Constants"
import { fetchLoremIpsumFromAPI, printMemoryUsage, sleep } from "../core-utils/misc-utils"
import { Readable } from "stream"
import * as fs from "fs"

/**
 * Details on how to implement a readable stream.
 * https://nodejs.org/docs/latest/api/stream.html#stream_readable_read_size_1
 *
 * All Readable stream implementations must provide an implementation of the
 * readable._read() method to fetch data from the underlying resource.
 *
 * When readable._read() is called, if data is available from the resource, the
 * implementation should begin pushing that data into the read queue using the
 * this.push(dataChunk) method. _read() should continue reading from the resource and
 * pushing data until readable.push() returns false. Only when _read() is called again
 * after it has stopped should it resume pushing additional data onto the queue.
 *
 * Once the readable._read() method has been called, it will not be called again until more
 * data is pushed through the readable.push() method. Empty data such as empty buffers and
 * strings will not cause readable._read() to be called.
 */
class LineGeneratorReadableStream extends Readable {
  private charCount = 0
  private lineCount = 0

  constructor(readonly line: string) {
    super()
  }

  _read(size: number /* Ignore the size (size of buffer that can be read / pushed). */) {
    if (this.lineCount > Constants.maxLinesToWrite) {
      this.push(null) // Close the stream.
      ColorConsole.create(textStyle1)("Finished writing file").consoleLog(true)
      return
    }
    this.push(this.line) // Write bytes into the stream.
    this.lineCount++
    this.charCount += this.line.length
    if (this.lineCount % ConsoleLogSkip.WriteLargeFileEfficiently === 0) {
      printMemoryUsage(`size- ${textStyle2(size)}, line- ${textStyle2(this.lineCount)}`)
    }
  }
}

export class WriteFileEfficiently {
  /**
   * This uses piping and backpressure to write a lot of data to a file w/out taking up much
   * RAM. The key is that there is a Readable and Writable stream. The Readable stream generates
   * the data, and the Writeable stream dumps it to a file.
   */
  performWrite = async (): Promise<void> => {
    const lineGeneratorReadableStream = new LineGeneratorReadableStream(
      await fetchLoremIpsumFromAPI()
    )
    const fileWriteStream: fs.WriteStream = fs.createWriteStream(Constants.filePath)

    // The following line is asynchronous and there's no way to wait for it.
    lineGeneratorReadableStream.pipe(fileWriteStream)

    // Wait for disk flush.
    ColorConsole.create(textStyle1.blue)(
      "Waiting for disk to flush the write to file for 5s..."
    ).consoleLog()
    await sleep(5000)
  }
}
