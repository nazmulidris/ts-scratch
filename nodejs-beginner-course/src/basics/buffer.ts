#!/usr/bin/env ts-node

import * as chalk from "chalk"
import * as _kt from "../core-utils/kotlin-lang-utils"
import { printHeader } from "../core-utils/color-console-utils"

function main() {
  printHeader("Buffers")

  _kt._let(Buffer.alloc(2, 12), (buffer) => {
    console.table(buffer)
  })

  _kt._let(Buffer.allocUnsafe(2), (buffer) => {
    console.log(buffer)
    buffer.fill(5)
    console.log(buffer)
  })

  _kt._let(Buffer.alloc(4), (buffer) => {
    buffer.write("😀A😀A😀A")
    console.table(buffer)
  })

  _kt._let(Buffer.from("Hello world!🎉"), (buffer) => {
    console.log(buffer)
    console.log(buffer.toString())
  })

  _kt._let(Buffer.from([1, 2, 3, 4]), (buffer) => {
    console.log(buffer)
  })
}

main()
