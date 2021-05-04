#!/usr/bin/env ts-node

import * as chalk from "chalk"
import * as _kt from "./kotlin"

// Testing the main Kotlin scope function inspired functions (in TypeScript).
// https://kotlinlang.org/docs/scope-functions.html#function-selection

// _also: 👉 it, 👈 contextObject
console.log(chalk.black.bgWhiteBright("_also: 👉 it, 👈 contextObject"))
const alsoExample = _kt._also(new Date(), (it) => {
  console.log(chalk.green(`block: no return & 'it' passed: ${it}`))
})
console.log(chalk.green.bgGrey(`contextObject returned from _also: ${alsoExample}`))

// _let: 👉 it, 👈 block result
console.log(chalk.black.bgWhiteBright("_let: 👉 it, 👈 block result"))
const letExample = _kt._let(new Date(), (it) => {
  const returnValue = `block: passed 'it' & result returned: ${it.toLocaleDateString()}`
  console.log(chalk.green(returnValue))
  return returnValue
})
console.log(chalk.green.bgGrey(`result from _let: ${letExample}`))

// _apply: 👉 this, 👈 contextObject
console.log(chalk.black.bgWhiteBright("_apply: 👉 this, 👈 contextObject"))
const applyExample = _kt._apply(new Date(), {
  blockWithReboundThis(): void {
    console.log(chalk.green(`no return & 'this' in block: ${this}`))
  },
})
console.log(chalk.green.bgGrey(`contextObject returned from _apply: ${applyExample}`))

// _with: 👉 this, 👈 block result
console.log(chalk.black.bgWhiteBright("_with: 👉 this, 👈 block result"))
const withExample = _kt._with(new Date(), {
  blockWithReboundThis(): string {
    const returnValue = `block: passed 'this' & result returned: ${this.toLocaleDateString()}`
    console.log(chalk.green(returnValue))
    return returnValue
  },
})
console.log(chalk.green.bgGrey(`result from _with: ${withExample}`))
