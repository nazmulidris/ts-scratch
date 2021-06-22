import { printHeader } from "../core-utils/color-console-utils"
import { sleep } from "../core-utils/misc-utils"
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
