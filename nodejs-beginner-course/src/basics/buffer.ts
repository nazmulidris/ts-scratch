#!/usr/bin/env ts-node

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

import * as utils from "r3bl-ts-utils"
import { printHeader } from "r3bl-ts-utils"

function main() {
  printHeader("Buffers")

  utils._let(Buffer.alloc(2, 12), (buffer) => {
    console.table(buffer)
  })

  utils._let(Buffer.allocUnsafe(2), (buffer) => {
    console.log(buffer)
    buffer.fill(5)
    console.log(buffer)
  })

  utils._let(Buffer.alloc(4), (buffer) => {
    buffer.write("😀A😀A😀A")
    console.table(buffer)
  })

  utils._let(Buffer.from("Hello world!🎉"), (buffer) => {
    console.log(buffer)
    console.log(buffer.toString())
  })

  utils._let(Buffer.from([1, 2, 3, 4]), (buffer) => {
    console.log(buffer)
  })
}

main()
