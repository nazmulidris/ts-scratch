#!/usr/bin/env ts-node

import { printHeader, textStyle1, textStyle2 } from "../core-utils/console-utils"
import * as fs from "fs"
import { Stats } from "fs"
import { isNil } from "lodash"
import { _with } from "../core-utils/kotlin-lang-utils"
import { sleep } from "../core-utils/misc"

const main = async () => {
  printHeader(`Files...`)
  console.log(`process.cwd: ${textStyle1(process.cwd())}`)
  console.log(`process.env.HOME: ${textStyle1(process.env.HOME)}`)

  await _with(new FileReadExample(), {
    fnWithReboundThis: async function (): Promise<void> {
      printHeader(`FileReadExample... async`)
      this.asyncFileRead()
      await sleep()
      printHeader(`FileReadExample... sync`)
      this.syncFileRead()
    },
  })

  await sleep()

  await _with(new FileWriteExample(), {
    fnWithReboundThis: async function (): Promise<void> {
      printHeader(`FileWriteExample... async`)
      this.asyncFileWrite()
      await sleep()
      printHeader(`FileWriteExample... sync`)
      this.syncFileWrite()
      printHeader(`FileWriteExample... stats`)
      this.printFileStats()
    },
  })
}

class FileReadExample {
  readonly validFilePath = `${process.env.HOME}/github/ts-scratch/nodejs-beginner-course/test/test-read-file.txt`
  readonly invalidFilePath = `${process.env.HOME}/github/ts-scratch/nodejs-beginner-course/test/test-read-file.txt_`
  readonly encoding = "utf-8"

  syncFileRead = () => {
    try {
      printHeader(`Read valid file 👍`)
      console.log(textStyle1(fs.readFileSync(this.validFilePath, this.encoding)))

      printHeader(`Can't read invalid file! ⛔`)
      console.log(textStyle1(fs.readFileSync(this.invalidFilePath, this.encoding)))
    } catch (err) {
      console.error(textStyle2(err.message))
    }
  }

  asyncFileRead = () => {
    const _processDataOrError = (err: NodeJS.ErrnoException | null, data: string) => {
      if (isNil(err)) {
        printHeader("Reading valid file 👍")
        console.log(textStyle1(data))
      } else {
        printHeader("Can't read invalid file! ⛔")
        console.error(textStyle2(err.message))
      }
    }
    for (const file of [this.validFilePath, this.invalidFilePath]) {
      fs.readFile(file, this.encoding, _processDataOrError)
    }
  }
}

class FileWriteExample {
  readonly validFilePath = `${process.env.HOME}/Downloads/files.txt`
  readonly content = "This line is written to the file"

  asyncFileWrite = () => {
    // https://nodejs.org/api/fs.html#fs_file_system_flags
    fs.writeFile(this.validFilePath, this.content, { flag: "w" }, (err) => {
      isNil(err)
        ? console.log(textStyle1(`Wrote file ${this.validFilePath} successfully. 👍`))
        : console.log(textStyle2(`Failed to write ${this.validFilePath} file! ⛔`))
    })
  }

  syncFileWrite = () => {
    try {
      // https://nodejs.org/api/fs.html#fs_file_system_flags
      fs.writeFileSync(this.validFilePath, this.content, { flag: "w" })
      console.log(textStyle1(`Wrote file ${this.validFilePath} successfully. 👍`))
    } catch (err) {
      console.log(textStyle2(`Failed to write ${this.validFilePath} file! ⛔`))
    }
  }

  printFileStats = () => {
    const _callback = (err: NodeJS.ErrnoException | null, stats: Stats) => {
      console.log(stats)
    }
    fs.stat(this.validFilePath, _callback)
  }
}

main()
