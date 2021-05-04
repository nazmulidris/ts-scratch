#!/usr/bin/env ts-node

import * as chalk from "chalk"
import * as _kt from "../lang-utils/kotlin"
import * as events from "events"

class Events {
  static readonly TimerName = "EventsTimer"
  static readonly Error = "error" /* Special Node.js error name. */
  static readonly Event1 = Symbol()
  static readonly Event2 = Symbol()
}

function main() {
  console.log(chalk.black.bgYellow("Events"))
  console.time(Events.TimerName)
  
  _kt._let(new events.EventEmitter(), emitter => {
    emitter.on(Events.Event1, () => {
      console.log(chalk.blue(`emitter.on -> Event1 has just occurred`))
      console.timeLog(Events.TimerName)
    })
    
    emitter.once(Events.Event2, () => {
      console.log(chalk.green(`emitter.once -> Event2 has just occurred`))
      console.timeLog(Events.TimerName)
    })
    
    emitter.on("error", () => {
      console.error(chalk.red(`emitter.on('error') -> error has occurred`))
      console.timeLog(Events.TimerName)
    })
    
    // Event1.
    _kt._let(Events.Event1, event => {
      fireEvent(emitter, event, 200)
      fireEvent(emitter, event, 100)
    })
    
    // Event2.
    _kt._let(Events.Event2, event => {
      fireEvent(emitter, event, 300)
      fireEvent(emitter, event, 300)
    })
    
    // Error.
    fireEvent(emitter, Events.Error, 300)
  })
}

const fireEvent = (
  emitter: events.EventEmitter,
  eventType: symbol | string,
  delayMs: number = 100
) =>
  setTimeout(() => {
    emitter.emit(eventType)
  }, delayMs)

main()
