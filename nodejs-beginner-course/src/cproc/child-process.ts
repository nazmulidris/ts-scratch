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

import { printHeader, sleep } from "r3bl-ts-utils"
import { SpawnCProcToRunLinuxCommandAndGetOutput } from "./SpawnCProcToRunLinuxCommandAndGetOutput"
import { SpawnCProcAndPipeStdinToLinuxCommand } from "./SpawnCProcAndPipeStdinToLinuxCommand"
import { SpawnCProcToPipeOutputOfOneLinuxCommandIntoAnother } from "./SpawnCProcToPipeOutputOfOneLinuxCommandIntoAnother"
import { SpawnCProcToReplaceFunctionalityOfFishScript } from "./SpawnCProcToReplaceFunctionalityOfFishScript"

const main = async (): Promise<void> => {
  printHeader(`Example 1 - spawn a child process to execute a command`)
  await new SpawnCProcToRunLinuxCommandAndGetOutput().run()
  await sleep(1000)

  printHeader(`Example 2 - pipe process.stdin into child process command`)
  await new SpawnCProcAndPipeStdinToLinuxCommand().run()
  await sleep(1000)

  printHeader(`Example 3 - pipe the output of one child process command into another one`)
  await new SpawnCProcToPipeOutputOfOneLinuxCommandIntoAnother().run()
  await sleep(1000)

  printHeader(`Example 4 - replace the functionality of a fish shell script`)
  await new SpawnCProcToReplaceFunctionalityOfFishScript().run()
  await sleep(1000)
}

main().catch(console.error)
