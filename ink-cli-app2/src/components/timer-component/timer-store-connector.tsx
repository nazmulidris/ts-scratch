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

import { EffectCallback } from "react"
import { _also, createTimer, Timer } from "r3bl-ts-utils"
import { TimerStore } from "./store"

/**
 * Create a Timer and manage it by connecting it to the Redux store (dispatch the right actions to
 * it based on the Timer's lifecycle).
 */
export function createAndManageTimer(store: TimerStore): EffectCallback {
  const maxCount = 4
  const timer: Timer = _also(
    createTimer("Timer in App, count from 0 to 5, at 1s interval", 1000),
    (it) => {
      it.onStart = getOnStartFn()
      it.onTick = getOnTickFn()
      it.onStop = getOnStopFn()
    }
  )
  return effectFn

  /* Function that is passed to useEffect. */
  function effectFn() {
    if (!timer.isRunning) {
      timer.startTicking()
    }
    return () => {
      if (timer.isRunning) timer.stopTicking()
    }
  }

  function getOnStartFn() {
    return () => store.dispatch({ type: "startTimer" })
  }

  function getOnTickFn() {
    return () => {
      // Update count in UI.
      store.dispatch({
        type: "setCount",
        payload: timer.counter.value,
      })

      // Stop timer when maxCount is reached.
      if (timer.counter.value >= maxCount && timer.isRunning) timer.stopTicking()
    }
  }

  function getOnStopFn() {
    return () => store.dispatch({ type: "stopTimer" })
  }
}
