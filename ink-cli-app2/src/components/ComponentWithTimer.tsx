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

import React, { FC } from "react"
import { Text } from "ink"
import { _also, _withRef, ReactRef, StateHook, Timer } from "r3bl-ts-utils"

const DEBUG = false

/**
 * Note - Do not import this function from `r3bl-ts-utils` as that fails due to ESM and CommonJS
 * issues. More on this in README:
 * - https://github.com/nazmulidris/ts-scratch/blob/main/ink-cli-app2/README.md#esm-r3bl-ts-utils-and-react
 *
 * Forcing React re-render:
 * - https://stackoverflow.com/a/68602854/2085356
 */
function useForceUpdateFn(): () => void {
  const [value, setValue]: StateHook<boolean> = React.useState<boolean>(false)
  return () => setValue((value) => !value)
}

export const ComponentWithTimer: FC = () => {
  const myTimerRef: ReactRef<Timer> = React.useRef<Timer>()
  const [count, setCount]: StateHook<number> = React.useState<number>(0)
  const forceUpdateFn = useForceUpdateFn()

  React.useEffect(startTimerEffect, [] /* componentDidMount */)
  React.useEffect(checkToStopTimerEffect)

  return render()

  function startTimerEffect() {
    const timer = _also(
      new Timer(TimerCounterConfig.name, TimerCounterConfig.updateIntervalMs, tick),
      (timer) => {
        myTimerRef.current = timer
        timer.start()
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
          forceUpdateFn() // Force a re-render after timer has stopped, to show the skull.
        }
      }
    })
  }

  function tick(timer: Timer): void {
    setCount(timer.counter.value)
    DEBUG && console.log(`"${timer.name}"`, timer.isStarted, timer.counter.value)
  }

  function render() {
    return (
      <Text color={"green"}>
        [{count} tests passed]
        {showSkullIfTimerIsStopped()}
      </Text>
    )
  }

  function showSkullIfTimerIsStopped() {
    return !myTimerRef.current?.isStarted ? "💀" : null
  }
}

const TimerCounterConfig = {
  name: "Count to 5 timer",
  updateIntervalMs: 1000,
  maxCounter: 5,
} as const
