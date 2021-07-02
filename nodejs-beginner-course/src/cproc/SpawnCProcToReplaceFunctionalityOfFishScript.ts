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

import { _also, ColorConsole, Optional, StyledColorConsole, Styles } from "r3bl-ts-utils"
import * as fs from "fs"

/**
 * Using constant object instead of enum (better choice here since it allows computed values).
 * More info:
 * - https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums
 * - https://blog.logrocket.com/const-assertions-are-the-killer-new-typescript-feature-b73451f35802/
 */
const MyConstants = {
  gnomeDotProfileFile: process.env.HOME + "/.profile",
  linuxbrewSearchTerm: "linuxbrew",
  defaultLinuxbrewPath: "/home/linuxbrew/.linuxbrew",
} as const

export class SpawnCProcToReplaceFunctionalityOfFishScript {
  run = async (): Promise<void> => {
    try {
      const isFound = await this.doesGnomeProfileContainLinuxbrewPath()
      if (isFound) {
        ColorConsole.create(Styles.Primary.green)(
          `Nothing to do, ${MyConstants.linuxbrewSearchTerm} is already in ${MyConstants.gnomeDotProfileFile}`
        ).consoleLog()
        return
      }
      await this.addPathToGnomeProfileFile()
    } catch (e) {
      ColorConsole.create(Styles.Primary.red)(`Error: ${e}`).consoleError()
    }
  }

  // https://nodesource.com/blog/understanding-streams-in-nodejs/
  doesGnomeProfileContainLinuxbrewPath = async (): Promise<boolean> => {
    return new Promise<boolean>((resolveFn, rejectFn) => {
      let isFound = false
      _also(fs.createReadStream(MyConstants.gnomeDotProfileFile), (it) => {
        it.on("data", (data: Buffer | string) => {
          isFound = data.includes(MyConstants.linuxbrewSearchTerm)
        })
        it.on("end", () => {
          resolveFn(isFound)
        })
        it.on("error", () => {
          rejectFn()
        })
      })
    })
  }

  addPathToGnomeProfileFile = async (): Promise<void> => {
    const overriddenLinuxbrewPath: Optional<string> = process.env.PATH?.split(":")
      .filter((pathElement) => pathElement.includes(MyConstants.linuxbrewSearchTerm))
      .shift()
    const linuxbrewPath: string = overriddenLinuxbrewPath ?? MyConstants.defaultLinuxbrewPath

    StyledColorConsole.Primary(`linuxbrewPath: ${linuxbrewPath}`).consoleLog()

    const snippetToAppend = `if [ -d "${linuxbrewPath}" ] ; then
  PATH="${linuxbrewPath}/bin:$PATH"
fi`

    StyledColorConsole.Primary(`snippet: ${snippetToAppend}`).consoleLog()

    return new Promise<void>((resolveFn, rejectFn) => {
      fs.appendFile(
        MyConstants.gnomeDotProfileFile,
        snippetToAppend,
        (err: NodeJS.ErrnoException | null) => {
          const _onErr = () => {
            rejectFn()
            ColorConsole.create(Styles.Primary.red)(
              `Problem appending file ${MyConstants.gnomeDotProfileFile}`
            ).consoleError()
          }
          const _onOk = () => {
            resolveFn()
            StyledColorConsole.Primary(
              `Appended file ${MyConstants.gnomeDotProfileFile}`
            ).consoleLog()
          }
          err ? _onErr() : _onOk()
        }
      )
    })
  }
}
