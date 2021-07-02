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

import { _with, printHeader } from "r3bl-ts-utils"
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
