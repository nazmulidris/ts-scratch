#!/usr/bin/env ts-node

import * as chalk from "chalk"

import { Console } from "console"
import * as fs from "fs"

function main() {
  console.log(chalk.green("Begin generating logs in /home/nazmul/Downloads/std*log "))

  const stdoutFile = fs.createWriteStream("/home/nazmul/Downloads/stdout.log")
  const stderrFile = fs.createWriteStream("/home/nazmul/Downloads/stderr.log")

  const logger = new Console({
    stdout: stdoutFile,
    stderr: stderrFile,
  })

  let counter = 100
  while (--counter > 0) {
    logger.log(chalk.blue(`counter: ${counter}`))
    if (counter % 10 === 0) {
      logger.trace(chalk.red(`counter: ${counter}`))
    }
  }

  console.log(chalk.red("Finished generating log, look at /home/nazmul/Downloads/std*log "))
}

main()
