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

//#region Imports.

import { useInput, useStdin } from "ink"
import {
  _also,
  _callIfTruthy,
  _let,
  createTimer,
  KeyboardInputHandlerFn,
  StateHook,
} from "r3bl-ts-utils"
import { EffectCallback, useEffect, useState } from "react"

//#endregion

//#region Hook to attach keyboard input handling.

/**
 * This hook will only work when terminal is in raw mode. When in raw mode, the useInput() hook
 * prevents this Node.js process from exiting automatically, since it is listening for events (this
 * listener is in the Node.js event queue).
 * 1. https://nodejs.org/api/tty.html#readstreamisraw
 * 2. https://nodejs.org/api/process.html#event-exit
 * @returns true if enabled, false otherwise.
 */
export const useAttachKeyboardInputHandler = (inputHandler: KeyboardInputHandlerFn): boolean =>
  _let(useStdin(), ({ isRawModeSupported: inRawMode }) => {
    _callIfTruthy(inRawMode, () => useInput(inputHandler))
    return inRawMode
  })

//#endregion

//#region Hook that starts a clock.

export const useClock = (): number => {
  const [time, setTime]: StateHook<number> = useState<number>(Date.now())

  const fun: EffectCallback = () => {
    const timer = _also(createTimer("useTime", 1000), (it) => {
      it.onTick = () => setTime(Date.now())
      it.startTicking()
    })
    // Clean up this hook.
    return () => {
      timer.stopTicking()
    }
  }

  useEffect(fun, [])

  return time
}

//#endregion

//#region Hook for testing.

/**
 * If terminal is not in raw mode create a recurring task so that Node.js process won't exit.
 * - https://nodejs.org/api/tty.html#readstreamisraw
 */
export const usePreventProcessExitDuringTesting = (delayMs = 1_000): void => {
  const { isRawModeSupported: inRawMode } = useStdin()

  if (inRawMode) return

  const fun: EffectCallback = () => {
    // Start a timer that doesn't have a tickFn (just puts an event in Node.js event queue).
    const timer = _also(createTimer("usePreventProcessExitDuringTesting", delayMs), (it) => {
      it.startTicking()
    })
    // Clean up this hook.
    return () => {
      timer.stopTicking()
    }
  }

  useEffect(fun, [])
}

//#endregion
