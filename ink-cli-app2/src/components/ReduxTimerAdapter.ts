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

import { Timer } from "r3bl-ts-utils"
import { EnhancedStore } from "@reduxjs/toolkit"

const DEBUG = false

const config = {
  name: "Timer in App, count from 0 to 5, at 1s interval",
  updateIntervalMs: 1000,
  maxCounter: 5,
}

export class ReduxTimerAdapter {
  constructor(
    readonly store: EnhancedStore,
    readonly timer: Timer = new Timer(config.name, config.updateIntervalMs)
  ) {}

  startTimerEffectOnComponentMount = () => {
    const { timer, store, tickFn, endTimerEffectOnComponentUnmount } = this

    if (!timer.tickFn) timer.tickFn = tickFn
    if (!timer.isStarted) {
      timer.start()
      store.dispatch({ type: "startTimer" })
    }
    return endTimerEffectOnComponentUnmount
  }

  endTimerEffectOnComponentUnmount = () => {
    const { timer } = this

    if (timer.isStarted) timer.stop()
    DEBUG && console.log(`😵 unmount`, timer)
  }

  tickFn = () => {
    const { timer, store } = this

    store.dispatch({
      type: "setCount",
      payload: timer.currentCount,
    })
    DEBUG && console.log(`"${timer.name}"`, timer.isStarted, timer.currentCount)
  }

  checkToStopTimerEffectOnRerender = () => {
    const { timer, store } = this

    if (timer.isStarted && timer.currentCount >= config.maxCounter) {
      timer.stop()
      store.dispatch({ type: "stopTimer" })
    }
  }
}
