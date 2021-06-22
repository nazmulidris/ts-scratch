import { ChildProcess, spawn } from "child_process"
import { ColorConsole, textStyle1 } from "../core-utils/color-console-utils"
import { _notNil } from "../core-utils/kotlin-lang-utils"

export class SpawnCProcToPipeOutputOfOneLinuxCommandIntoAnother {
  run = async (): Promise<void> => {
    const findChildProcess: ChildProcess = spawn("find", [
      `${process.env.HOME}/github/notes/`,
      "-type",
      "f",
    ])

    const wcChildProcess: ChildProcess = spawn("wc", ["-l"])

    _notNil(findChildProcess.stdout, (find) =>
      _notNil(wcChildProcess.stdin, (wc) => {
        find.pipe(wc)
      })
    )

    return new Promise<void>((resolveFn, rejectFn) => {
      wcChildProcess.on("exit", function (code, signal) {
        ColorConsole.create(textStyle1.blue)(
          `Child process exited with code ${code} and signal ${signal}`
        ).consoleLog(true)
        resolveFn()
      })
      wcChildProcess.stdout?.on("data", (data: Buffer) => {
        ColorConsole.create(textStyle1)(`Number of files ${data}`).consoleLogInPlace()
      })
      wcChildProcess.stderr?.on("data", (data) => {
        ColorConsole.create(textStyle1.red)(`Error: ${data}`).consoleLog()
        rejectFn()
      })
    })
  }
}
