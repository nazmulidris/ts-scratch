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

import * as process from "process"
import { printHeader, StyledColorConsole, Styles } from "r3bl-ts-utils"
import * as _ from "lodash"

const main = async () => {
  printHeader(`Print stats for current process`)
  printProcessStats()

  printHeader(`Attaching event listeners to process: ${Styles.Secondary("exit, beforeExit")}`)
  attachExitHandler()
  attachBeforeExitHandler()

  printHeader(`Attaching event listeners to process: ${Styles.Secondary("uncaughtException")}`)
  attachUncaughtExceptionHandler()
  throwUncaughtException()
}

const printProcessStats = () => {
  const data: Object = {
    cpu_arch: process.arch,
    args: process.argv,
    os: process.platform,
    cwd: process.cwd(),
    pid: process.pid,
    version: process.version,
    env: JSON.stringify(process.env, null, 4),
  }
  for (const key in data) {
    // https://gomakethings.com/how-to-get-the-value-of-an-object-from-a-specific-path-with-vanilla-js/
    StyledColorConsole.Primary(
      Styles.Primary(key) + " -> " + Styles.Secondary(_.get(data, key))
    ).consoleLog()
  }
}

const throwUncaughtException = () => {
  throw new Error("this exception does not have a catch block")
}

const attachExitHandler = () => {
  process.on("exit", (code) => {
    StyledColorConsole.Secondary(
      `exit event is fired, running this handler synchronously`
    ).consoleLog()
  })
}

const attachBeforeExitHandler = () => {
  // Note that this event is not fired if `process.exit()` is called.
  process.on("beforeExit", (code) => {
    StyledColorConsole.Secondary(
      `beforeExit event is fired, running this handler synchronously`
    ).consoleLog()
  })
}

// You should just exit after this is run since the Node.js app is in an unknown state. This is
// not meant for recovery.
// https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
// https://shapeshed.com/uncaught-exceptions-in-node/
const attachUncaughtExceptionHandler = () => {
  process.on("uncaughtException", (err) => {
    StyledColorConsole.Secondary(`uncaughtException handler triggered ${err}`).consoleLog()
    // process.exit(1) // No need for this since the Node.js process should exit automatically.
  })
}

/**
 * You have to be careful because main is async (returns a promise). And when promises throw
 * uncaught exceptions, the Node.js interpreter does not cleanly exit as of May 2021 (need to use
 * `--unhandled-rejections=strict` to start Node.js). Apparently this behavior will change in
 * future releases.
 */
main().catch((err) => {
  // https://javascript.info/promise-error-handling
  console.error(err)
})
