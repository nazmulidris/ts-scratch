import { ColorConsole, textStyle1, textStyle2 } from "../core-utils/color-console-utils"
import { ConsoleLogSkip, Constants } from "./Constants"
import { fetchLoremIpsumFromAPI, printMemoryUsage, sleep } from "../core-utils/misc-utils"
import { Readable, Writable } from "stream"
import { _also } from "../core-utils/kotlin-lang-utils"
import * as fs from "fs"
import * as zlib from "zlib"
import { pipeline } from "stream/promises"
import { fileURLToPath } from "url"

/**
 * Use a transform stream in between a read and write stream, with the use of backpressure.
 *
 * In other words the following:
 * - Reader(UncompressedFile) -> gzip transform -> Writer(NewCompressedFile)
 *
 * Or:
 * - Reader(UncompressedFile) | gzip transform | Writer(NewCompressedFile)
 *
 * -----------------------------------------------------------------------------------------------
 * Version 1 - The simple version of the code looks like this (using pipe):
 * -----------------------------------------------------------------------------------------------
 * ```javascript
 * const uncompressedSrcFileReader = fs.createReadStream("/home/nazmul/Downloads/large-file.txt")
 * const compressedDestFileWriter = fs.createWriteStream("/home/nazmul/Downloads/large-file.gzip")
 * const gzipTransformer = zlib.createGzip()
 * ```
 *
 * -----------------------------------------------------------------------------------------------
 * Version 2 - Using pipeline instead of pipe (that handles error conditions):
 * -----------------------------------------------------------------------------------------------
 * ```javascript
 * import { pipeline } from "stream"
 * const _handleErr = (err) => {
 *   err ? console.error("Pipeline failed", err) : console.err("Pipeline succeeded")
 * }
 * pipeline(uncompressedSrcFileReader, gzipTransformer, compressedDestFileWriter, _handleErr)
 * ```
 *
 * -----------------------------------------------------------------------------------------------
 * Version 3 - Promisified version of pipeline (only works on Node.JS v15 and higher):
 * -----------------------------------------------------------------------------------------------
 * ```javascript
 * import { pipeline } from "stream/promises"
 * async function run() {
 *   await pipeline(uncompressedSrcFileReader, gzipTransformer, compressedDestFileWriter)
 * }
 * run().catch(console.error)
 * ```
 *
 * More info:
 * - https://nodejs.org/en/docs/guides/backpressuring-in-streams/#the-problem-with-data-handling
 * - https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback
 * - [Difference between pipe and pipeline](https://stackoverflow.com/a/60459320/2085356)
 * - [Get latest version of Node.js TS bindings](https://stackoverflow.com/a/67435044/2085356)
 * - [Latest version of Node.js and stream promises](https://github.com/nodejs/node/issues/35731)
 */
export class CompressLargeFileEfficiently {
  performCompression = async (): Promise<void> => {
    await this.actuallyCompress().catch(console.error)

    // Wait for disk flush.
    ColorConsole.create(textStyle1.blue)(
      "Waiting for disk to flush the write to file for 5s..."
    ).consoleLog()
    await sleep(5000)
  }

  private actuallyCompress = async (): Promise<void> => {
    const uncompressedSrcFileReader = fs.createReadStream(Constants.filePath)
    const compressedDestFileWriter = fs.createWriteStream(Constants.compressedFilePath)

    const gzipTransformer = zlib.createGzip()

    ColorConsole.create(textStyle1)(`Using pipeline() to compress file`).consoleLog()
    await pipeline(uncompressedSrcFileReader, gzipTransformer, compressedDestFileWriter)
  }
}
