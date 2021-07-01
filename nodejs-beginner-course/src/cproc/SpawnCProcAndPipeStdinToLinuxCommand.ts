import { ChildProcess, spawn } from "child_process"
import { ColorConsole, StyledColorConsole, Styles } from "../core-utils/color-console-utils"
import { notNil } from "../core-utils/kotlin-lang-utils"

export class SpawnCProcAndPipeStdinToLinuxCommand {
  run = async (): Promise<void> => {
    ColorConsole.create(Styles.Secondary)(
      `Type words, then press Ctrl+D to count them...`
    ).consoleLog()

    const wcCommand: ChildProcess = spawn("wc")

    // Send input to command (from process.stdin), ie, process.stdin | wcCommand.stdin.
    notNil(wcCommand.stdin, (wcCommandStdin) => {
      process.stdin.pipe(wcCommandStdin)
    })

    return new Promise<void>((resolveFn, rejectFn) => {
      wcCommand.on("exit", function (code, signal) {
        ColorConsole.create(Styles.Primary.blue)(
          `Child process exited with code ${code} and signal ${signal}`
        ).consoleLog(true)
        resolveFn()
      })
      wcCommand.stdout?.on("data", (data: Buffer) => {
        StyledColorConsole.Primary(`Output: ${data}`).consoleLogInPlace()
      })
      wcCommand.stderr?.on("data", (data) => {
        ColorConsole.create(Styles.Primary.red)(`Error: ${data}`).consoleLog()
        rejectFn()
      })
    })
  }
}
