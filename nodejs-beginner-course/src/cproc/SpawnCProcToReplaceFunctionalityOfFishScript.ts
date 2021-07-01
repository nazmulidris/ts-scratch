import { ColorConsole, StyledColorConsole, Styles } from "../core-utils/color-console-utils"
import { _also, Optional } from "../core-utils/kotlin-lang-utils"
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
