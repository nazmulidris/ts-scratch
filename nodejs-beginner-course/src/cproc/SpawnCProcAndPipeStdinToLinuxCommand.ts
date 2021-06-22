import { ChildProcess, spawn } from "child_process"
import { ColorConsole, textStyle1, textStyle2 } from "../core-utils/color-console-utils"
import { _notNil } from "../core-utils/kotlin-lang-utils"

export class SpawnCProcAndPipeStdinToLinuxCommand {
  run = async (): Promise<void> => {
    ColorConsole.create(textStyle2)(`Type words, then press Ctrl+D to count them...`).consoleLog()

    const wcCommand: ChildProcess = spawn("wc")

    // Send input to command (from process.stdin), ie, process.stdin | wcCommand.stdin.
    _notNil(wcCommand.stdin, (wcCommandStdin) => {
      process.stdin.pipe(wcCommandStdin)
    })

    return new Promise<void>((resolveFn, rejectFn) => {
      wcCommand.on("exit", function (code, signal) {
        ColorConsole.create(textStyle1.blue)(
          `Child process exited with code ${code} and signal ${signal}`
        ).consoleLog(true)
        resolveFn()
      })
      wcCommand.stdout?.on("data", (data: Buffer) => {
        ColorConsole.create(textStyle1)(`Output: ${data}`).consoleLogInPlace()
      })
      wcCommand.stderr?.on("data", (data) => {
        ColorConsole.create(textStyle1.red)(`Error: ${data}`).consoleLog()
        rejectFn()
      })
    })
  }
}
