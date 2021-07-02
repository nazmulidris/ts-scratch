#!/usr/bin/env ts-node

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

import { _with, printHeader, sleep, Styles } from "r3bl-ts-utils"
import * as fs from "fs"
import { Stats } from "fs"
import { isNil } from "lodash"

const main = async () => {
  printHeader(`Files...`)
  console.log(`process.cwd: ${Styles.Primary(process.cwd())}`)
  console.log(`process.env.HOME: ${Styles.Primary(process.env.HOME)}`)

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
      // Must specify encoding, otherwise readFileSync returns a Buffer!
      console.log(Styles.Primary(fs.readFileSync(this.validFilePath, this.encoding)))

      printHeader(`Can't read invalid file! ⛔`)
      // Must specify encoding, otherwise readFileSync returns a Buffer!
      console.log(Styles.Primary(fs.readFileSync(this.invalidFilePath, this.encoding)))
    } catch (err) {
      console.error(Styles.Secondary(err.message))
    }
  }

  asyncFileRead = () => {
    const _processDataOrError = (err: NodeJS.ErrnoException | null, data: string) => {
      if (isNil(err)) {
        printHeader("Reading valid file 👍")
        console.log(Styles.Primary(data))
      } else {
        printHeader("Can't read invalid file! ⛔")
        console.error(Styles.Secondary(err.message))
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
        ? console.log(Styles.Primary(`Wrote file ${this.validFilePath} successfully. 👍`))
        : console.error(Styles.Secondary(`Failed to write ${this.validFilePath} file! ⛔`))
    })
  }

  syncFileWrite = () => {
    try {
      // https://nodejs.org/api/fs.html#fs_file_system_flags
      fs.writeFileSync(this.validFilePath, this.content, { flag: "w" })
      console.log(Styles.Primary(`Wrote file ${this.validFilePath} successfully. 👍`))
    } catch (err) {
      console.error(Styles.Secondary(`Failed to write ${this.validFilePath} file! ⛔`))
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
