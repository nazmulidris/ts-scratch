import { printHeader } from "../core-utils/color-console-utils"
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
