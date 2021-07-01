import { ChildProcess, spawn } from "child_process"
import { ColorConsole, StyledColorConsole, Styles } from "../core-utils/color-console-utils"

export class SpawnCProcToRunLinuxCommandAndGetOutput {
  readonly cmd = "find"
  readonly args = [`${process.env.HOME}/github/notes/`, "-type", "f"]

  run = async (): Promise<void> => {
    const child: ChildProcess = spawn(this.cmd, this.args)
    return new Promise<void>((resolveFn, rejectFn) => {
      child.on("exit", function (code, signal) {
        ColorConsole.create(Styles.Primary.blue)(
          `Child process exited with code ${code} and signal ${signal}`
        ).consoleLog(true)
        resolveFn()
      })
      child.stdout?.on("data", (data: Buffer) => {
        StyledColorConsole.Primary(`Output : ${data.length}`).consoleLogInPlace()
      })
      child.stderr?.on("data", (data) => {
        ColorConsole.create(Styles.Primary.red)(`Error: ${data}`).consoleLog()
        rejectFn()
      })
    })
  }
}
