#!/usr/bin/env ts-node

import * as chalk from "chalk"
import * as _kt from "../core-utils/kotlin-lang-utils"
import { EventEmitter } from "events"
import { printHeader } from "../core-utils/console-utils"

class Events {
  static readonly TimerName = "EventsTimer"
  static readonly Error = "error" /* Special Node.js error name. */
  static readonly Event1 = Symbol()
  static readonly Event2 = Symbol()
}

// EventEmitter - https://nodejs.org/api/events.html#events_emitter_emit_eventname_args

function main() {
  printHeader("Events")

  // Start timer.
  console.time(Events.TimerName)

  _kt._let(new EventEmitter(), (emitter) => {
    // Handle Event1.
    emitter.on(Events.Event1, (...args: any[]) => {
      console.log(chalk.blue(`emitter.on -> Event1, args: ${JSON.stringify(args)}`))
      console.timeLog(Events.TimerName)
    })

    // Handle Event2.
    emitter.once(Events.Event2, (...args: any[]) => {
      console.log(chalk.green(`emitter.once -> Event2, args: ${JSON.stringify(args)}`))
      console.timeLog(Events.TimerName)
    })

    // Handle Error.
    emitter.on("error", (...errorArgs: any[]) => {
      console.error(chalk.red(`emitter.on('error') -> errorArgs: ${JSON.stringify(errorArgs)}`))
      console.timeLog(Events.TimerName)
    })

    // Fire Event1.
    printHeader("Fire Event1")
    _kt._let(Events.Event1, (event) => {
      fireEvent(emitter, event, 100, "🐵", { foo: "bar" })
      fireEvent(emitter, event, 200)
    })

    // Fire Event2.
    printHeader("Fire Event2")
    _kt._let(Events.Event2, (event) => {
      fireEvent(emitter, event)
      fireEvent(emitter, event)
    })

    // Fire Error.
    printHeader("Fire Error")
    fireError(emitter)
    fireError(emitter, 200, "💣", { errorCode: 50 })
  })
}

// TypeScript varargs -
// https://www.damirscorner.com/blog/posts/20180216-VariableNumberOfArgumentsInTypescript.html

const fireError = (
  emitter: EventEmitter,
  delayMs: number = 100,
  ...errorArgs: (string | object)[]
) =>
  setTimeout(() => {
    emitter.emit(Events.Error, ...errorArgs)
  }, delayMs)

const fireEvent = (
  emitter: EventEmitter,
  eventType: symbol | string,
  delayMs: number = 100,
  ...args: (string | object)[]
) =>
  setTimeout(() => {
    emitter.emit(eventType, ...args)
  }, delayMs)

main()
