#!/usr/bin/env ts-node

import { printHeader, textStyle1, textStyle2 } from "../core-utils/console-utils"
import * as fs from "fs"
import * as _ from "lodash"
import { _with } from "../core-utils/kotlin-lang-utils"

const main = () => {
  printHeader(`Files...`)
  console.log(`process.cwd: ${textStyle1(process.cwd())}`)
  console.log(`process.env.HOME: ${textStyle1(process.env.HOME)}`)

  printHeader(`FileReadExample...`)
  _with(new FileReadExample(), {
    fnWithReboundThis: function (): void {
      this.asyncFileRead()
      this.syncFileRead()
    },
  })
}

class FileReadExample {
  readonly validFilePath = `${process.env.HOME}/github/ts-scratch/nodejs-beginner-course/test/test-read-file.txt`
  readonly invalidFilePath = `${process.env.HOME}/github/ts-scratch/nodejs-beginner-course/test/test-read-file.txt_`
  readonly encoding = "utf-8"

  asyncFileRead = () => {
    const _handleRead = (err: NodeJS.ErrnoException | null, data: string) => {
      _.isNil(err) ? console.log(textStyle1(data)) : console.error(textStyle2(err.message))
    }

    fs.readFile(this.validFilePath, this.encoding, (err, data) => {
      printHeader(`asyncFileRead...valid file`)
      _handleRead(err, data)
    })

    fs.readFile(this.invalidFilePath, this.encoding, (err, data) => {
      printHeader(`asyncFileRead...invalid file`)
      _handleRead(err, data)
    })
  }

  syncFileRead = () => {
    try {
      printHeader(`syncFileRead...valid file`)
      console.log(textStyle1(fs.readFileSync(this.validFilePath, this.encoding)))

      printHeader(`syncFileRead...invalid file`)
      console.log(textStyle1(fs.readFileSync(this.invalidFilePath, this.encoding)))
    } catch (err) {
      console.error(textStyle2(err.message))
    }
  }
}

main()
