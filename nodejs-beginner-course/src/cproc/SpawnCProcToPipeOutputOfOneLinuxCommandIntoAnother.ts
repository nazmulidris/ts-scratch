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

import { ChildProcess, spawn } from "child_process"
import { ColorConsole, notNil, StyledColorConsole, Styles } from "r3bl-ts-utils"

export class SpawnCProcToPipeOutputOfOneLinuxCommandIntoAnother {
  run = async (): Promise<void> => {
    const findChildProcess: ChildProcess = spawn("find", [
      `${process.env.HOME}/github/notes/`,
      "-type",
      "f",
    ])

    const wcChildProcess: ChildProcess = spawn("wc", ["-l"])

    notNil(findChildProcess.stdout, (find) =>
      notNil(wcChildProcess.stdin, (wc) => {
        find.pipe(wc)
      })
    )

    return new Promise<void>((resolveFn, rejectFn) => {
      wcChildProcess.on("exit", function (code, signal) {
        ColorConsole.create(Styles.Primary.blue)(
          `Child process exited with code ${code} and signal ${signal}`
        ).consoleLog(true)
        resolveFn()
      })
      wcChildProcess.stdout?.on("data", (data: Buffer) => {
        StyledColorConsole.Primary(`Number of files ${data}`).consoleLogInPlace()
      })
      wcChildProcess.stderr?.on("data", (data) => {
        ColorConsole.create(Styles.Primary.red)(`Error: ${data}`).consoleLog()
        rejectFn()
      })
    })
  }
}
