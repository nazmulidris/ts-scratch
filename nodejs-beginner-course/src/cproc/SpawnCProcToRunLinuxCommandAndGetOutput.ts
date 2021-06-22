import { ChildProcess, spawn } from "child_process"
import { ColorConsole, textStyle1 } from "../core-utils/color-console-utils"

export class SpawnCProcToRunLinuxCommandAndGetOutput {
  readonly cmd = "find"
  readonly args = [`${process.env.HOME}/github/notes/`, "-type", "f"]

  run = async (): Promise<void> => {
    const child: ChildProcess = spawn(this.cmd, this.args)
    return new Promise<void>((resolveFn, rejectFn) => {
      child.on("exit", function (code, signal) {
        ColorConsole.create(textStyle1.blue)(
          `Child process exited with code ${code} and signal ${signal}`
        ).consoleLog(true)
        resolveFn()
      })
      child.stdout?.on("data", (data: Buffer) => {
        ColorConsole.create(textStyle1)(`Output : ${data.length}`).consoleLogInPlace()
      })
      child.stderr?.on("data", (data) => {
        ColorConsole.create(textStyle1.red)(`Error: ${data}`).consoleLog()
        rejectFn()
      })
    })
  }
}
