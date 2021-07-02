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

import { printHeader } from "r3bl-ts-utils"
import { printMemoryUsage } from "../core-utils/misc-utils"
import { WriteFileEfficiently } from "./WriteFileEfficiently"
import { Constants } from "./Constants"
import { CompressLargeFileEfficiently } from "./CompressLargeFileEfficiently"
import { ReadLargeFileEfficiently } from "./ReadLargeFileEfficiently"
import { WriteLargeFileInefficiently } from "./WriteLargeFileInefficiently"

const main = async (): Promise<void> => {
  printHeader(`1) Write file efficiently using piping... ${Constants.filePath}`)
  printMemoryUsage("Before W-", false)
  await new WriteFileEfficiently().performWrite()
  printMemoryUsage("After W-", false)

  printHeader(`2) Reading large file efficiently using piping... ${Constants.filePath}`)
  printMemoryUsage("Before R-", false)
  await new ReadLargeFileEfficiently().performRead()
  printMemoryUsage("After R-", false)

  printMemoryUsage("Before (Hi RAM) W-", false)
  printHeader(`3) Write large file inefficiently (no piping, hi RAM)... ${Constants.filePath}`)
  await new WriteLargeFileInefficiently().performWrite()
  printMemoryUsage("After (Hi RAM) W-", false)

  printMemoryUsage("Before (compress) RW-", false)
  printHeader(`3) Compress with piping... ${Constants.filePath}`)
  await new CompressLargeFileEfficiently().performCompression()
  printMemoryUsage("After (compress) RW-", false)
}

main().catch(console.error)
