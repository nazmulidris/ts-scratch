/*
 * Copyright 2021 Google Inc. All rights reserved.
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

import React, { Dispatch, FC, SetStateAction } from "react"
import { Text } from "ink"
import { Animator } from "../utils/Animator.js"
import { _also } from "r3bl-ts-utils"
import { _withRef, ReactRef, StateHook, useForceUpdateFn } from "../utils/hook-utils.js"

const DEBUG = false

export const ComponentWithInterval: FC = () => {
  const myAnimatorRef: ReactRef<Animator> = React.useRef<Animator>()
  const [count, setCount]: StateHook<number> = React.useState<number>(0)
  const forceUpdateFn = useForceUpdateFn()

  React.useEffect(startAnimatorEffect, [] /* componentDidMount */)
  React.useEffect(checkToStopAnimatorEffect)

  return render()

  function startAnimatorEffect() {
    const animator = _also(
      new Animator(AnimatorCounterConfig.name, AnimatorCounterConfig.updateIntervalMs, tick),
      (animator) => {
        myAnimatorRef.current = animator
        animator.start()
      }
    )

    return () => {
      if (animator.isStarted) animator.stop()
      DEBUG && console.log(`😵 unmount`, myAnimatorRef.current)
    }
  }

  function checkToStopAnimatorEffect() {
    _withRef(myAnimatorRef, (animator) => {
      if (animator.isStarted) {
        if (animator.counter.value >= AnimatorCounterConfig.maxCounter) {
          animator.stop()
          forceUpdateFn() // Force a re-render after animator has stopped, to show the skull.
        }
      }
    })
  }

  function tick(animator: Animator): void {
    setCount(animator.counter.value)
    DEBUG && console.log(`"${animator.name}"`, animator.isStarted, animator.counter.value)
  }

  function render() {
    return (
      <Text color={"green"}>
        [{count} tests passed]
        {showSkullIfAnimatorIsStopped()}
      </Text>
    )
  }

  function showSkullIfAnimatorIsStopped() {
    return !myAnimatorRef.current?.isStarted ? "💀" : null
  }
}

const AnimatorCounterConfig = {
  name: "Count to 5 timer",
  updateIntervalMs: 1000,
  maxCounter: 5,
} as const
