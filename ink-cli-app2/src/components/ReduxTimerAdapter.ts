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

export class ReduxTimerAdapter {
  constructor(
    readonly store: EnhancedStore,
    readonly maxCounter?: number,
    readonly timer?: Timer
  ) {}

  startTimerEffectOnComponentMount = () => {
    const { timer, store, tickFn } = this

    if (!timer) return

    if (!timer.tickFn) timer.onTick = tickFn
    if (!timer.isStarted) {
      timer.startTicking()
      store.dispatch({ type: "startTimer" })
    }
    return () => {
      this.endTimerEffectOnComponentUnmount(timer)
    }
  }

  endTimerEffectOnComponentUnmount = (timer: Timer) => {
    if (timer.isStarted) timer.stopTicking()
    DEBUG && console.log(`😵 unmount`, timer)
  }

  tickFn = () => {
    const { timer, store } = this

    if (!timer) return

    store.dispatch({
      type: "setCount",
      payload: timer.currentCount,
    })
    DEBUG && console.log(`🕛 "${timer.name}"`, timer.isStarted, timer.currentCount)
  }

  checkToStopTimerEffectOnRerender = () => {
    const { timer, store, maxCounter } = this

    if (!timer || !maxCounter) return

    if (timer.currentCount >= maxCounter) {
      if (timer.isRunning) {
        timer.stop()
        store.dispatch({ type: "stopTimer" })
        DEBUG && console.log(`⛔ effect to stop timer`, timer)
      }
    }
  }
}
