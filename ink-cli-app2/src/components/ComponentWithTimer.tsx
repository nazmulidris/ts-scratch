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

import React, { Dispatch, FC, Reducer } from "react"
import { Text } from "ink"
import { _also, _withRef, ReactRef, Timer } from "r3bl-ts-utils"
import _ from "lodash"

const DEBUG = false

// Functional component.

export const ComponentWithTimer: FC = () => {
  const [myState, myStateDispatcher]: MyReducer.ReducerHookType =
    React.useReducer<MyReducer.ReducerType>(MyReducer.reducerFn, MyReducer.initialState)
  const myTimerRef: ReactRef<Timer> = React.useRef<Timer>()
  React.useEffect(startTimerEffect, [] /* componentDidMount */)
  React.useEffect(checkToStopTimerEffect)

  return render()

  function startTimerEffect() {
    const timer = _also(
      new Timer(TimerCounterConfig.name, TimerCounterConfig.updateIntervalMs, tick),
      (timer) => {
        myTimerRef.current = timer
        timer.start()
        myStateDispatcher({ type: "startTimer" })
      }
    )

    return () => {
      if (timer.isStarted) timer.stop()
      DEBUG && console.log(`😵 unmount`, myTimerRef.current)
    }
  }

  function checkToStopTimerEffect() {
    _withRef(myTimerRef, (timer) => {
      if (timer.isStarted) {
        if (timer.counter.value >= TimerCounterConfig.maxCounter) {
          timer.stop()
          myStateDispatcher({ type: "stopTimer" })
        }
      }
    })
  }

  function tick(timer: Timer): void {
    myStateDispatcher({
      type: "setCount",
      payload: timer.counter.value,
    })
    DEBUG && console.log(`"${timer.name}"`, timer.isStarted, timer.counter.value)
  }

  function render() {
    return (
      <Text color={"green"}>
        [{myState.count} tests passed]
        {showSkullIfTimerIsStopped()}
      </Text>
    )
  }

  function showSkullIfTimerIsStopped() {
    return !myState.run ? "💀" : null
  }
}

const TimerCounterConfig = {
  name: "Count to 5 timer",
  updateIntervalMs: 1000,
  maxCounter: 5,
} as const

// Reducer.

namespace MyReducer {
  type State = {
    count: number
    run: boolean
  }
  export const initialState: Readonly<State> = {
    count: 0,
    run: false,
  }

  interface ActionStartTimer {
    type: "startTimer"
  }
  interface ActionStopTimer {
    type: "stopTimer"
  }
  interface ActionSetCount {
    type: "setCount"
    payload: number
  }
  type Action = ActionStartTimer | ActionStopTimer | ActionSetCount

  export type ReducerType = Reducer<State, Action>
  export type ReducerHookType = [State, Dispatch<Action>]

  export function reducerFn(current: State, action: Action): State {
    // Initial state.
    if (!action) {
      return {
        count: 0,
        run: false,
      }
    }

    let currentCopy: State = _.clone(current)
    switch (action.type) {
      case "setCount":
        currentCopy.count = action.payload
        break
      case "startTimer":
        currentCopy.run = true
        break
      case "stopTimer":
        currentCopy.run = false
        break
    }
    return currentCopy
  }
}
