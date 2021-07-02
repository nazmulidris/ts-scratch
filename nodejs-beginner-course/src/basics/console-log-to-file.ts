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
