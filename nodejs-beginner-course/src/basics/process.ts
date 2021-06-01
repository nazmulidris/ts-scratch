import * as process from "process"
import {
  printHeader,
  textStyle1,
  textStyle2,
  textStylerPrimary,
  textStylerSecondary,
} from "../core-utils/color-console-utils"
import * as _ from "lodash"
import { _also, _apply } from "../core-utils/kotlin-lang-utils"

const main = async () => {
  printHeader(`Print stats for current process`)
  printProcessStats()

  printHeader(`Attaching event listeners to process: ${textStyle2("exit, beforeExit")}`)
  attachExitHandler()
  attachBeforeExitHandler()

  printHeader(`Attaching event listeners to process: ${textStyle2("uncaughtException")}`)
  attachUncaughtExceptionHandler()
  throwUncaughtException()
}

const printProcessStats = () => {
  const data: Object = {
    cpu_arch: process.arch,
    args: process.argv,
    os: process.platform,
    cwd: process.cwd(),
    pid: process.pid,
    version: process.version,
    env: JSON.stringify(process.env, null, 4),
  }
  for (const key in data) {
    // https://gomakethings.com/how-to-get-the-value-of-an-object-from-a-specific-path-with-vanilla-js/
    textStylerPrimary.apply(textStyle1(key) + " -> " + textStyle2(_.get(data, key))).consoleLog()
  }
}

const throwUncaughtException = () => {
  throw new Error("this exception does not have a catch block")
}

const attachExitHandler = () => {
  process.on("exit", (code) => {
    textStylerSecondary
      .apply(`exit event is fired, running this handler synchronously`)
      .consoleLog()
  })
}

const attachBeforeExitHandler = () => {
  // Note that this event is not fired if `process.exit()` is called.
  process.on("beforeExit", (code) => {
    textStylerSecondary
      .apply(`beforeExit event is fired, running this handler synchronously`)
      .consoleLog()
  })
}

// You should just exit after this is run since the Node.js app is in an unknown state. This is
// not meant for recovery.
// https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
// https://shapeshed.com/uncaught-exceptions-in-node/
const attachUncaughtExceptionHandler = () => {
  process.on("uncaughtException", (err) => {
    textStylerSecondary.apply(`uncaughtException handler triggered ${err}`).consoleLog()
    // process.exit(1) // No need for this since the Node.js process should exit automatically.
  })
}

/**
 * You have to be careful because main is async (returns a promise). And when promises throw
 * uncaught exceptions, the Node.js interpreter does not cleanly exit as of May 2021 (need to use
 * `--unhandled-rejections=strict` to start Node.js). Apparently this behavior will change in
 * future releases.
 */
main().catch((err) => {
  // https://javascript.info/promise-error-handling
  console.error(err)
})
