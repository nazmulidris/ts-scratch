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

import { ColorConsole, sleep, StyledColorConsole, Styles } from "r3bl-ts-utils"
import { Constants } from "./Constants"
import * as fs from "fs"
import * as zlib from "zlib"
import { pipeline } from "stream/promises"

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
    ColorConsole.create(Styles.Primary.blue)(
      "Waiting for disk to flush the write to file for 5s..."
    ).consoleLog()
    await sleep(5000)
  }

  private actuallyCompress = async (): Promise<void> => {
    const uncompressedSrcFileReader = fs.createReadStream(Constants.filePath)
    const compressedDestFileWriter = fs.createWriteStream(Constants.compressedFilePath)

    const gzipTransformer = zlib.createGzip()

    StyledColorConsole.Primary(`Using pipeline() to compress file`).consoleLog()
    await pipeline(uncompressedSrcFileReader, gzipTransformer, compressedDestFileWriter)
  }
}
