import { printHeader } from "../core-utils/color-console-utils"
import { _with } from "../core-utils/kotlin-lang-utils"
import * as os from "os"

const main = () => {
  printHeader("OS, process, network, etc")
  _with(os, {
    fnWithReboundThis(): void {
      console.log("Architecture:", this.arch(), "\n")
      console.log("CPUs:", this.cpus(), "\n")
      console.log("Network interfaces:", this.networkInterfaces(), "\n")
      console.log("Platform:", this.platform(), "\n")
      console.log("Release number:", this.release(), "\n")
      console.log("User info:", this.userInfo(), "\n")
    },
  })
}

main()
