/*
 * Copyright 2021 Nazmul Idris. All rights reserved.
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
 *
 */

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Optional } from "r3bl-ts-utils"

export class Animator {
  public timerId: NodeJS.Timeout | null = null

  constructor(
    readonly name: string,
    readonly delayMs: number,
    readonly tickFn: AnimatorTickFn,
    readonly counter: Counter = new Counter()
  ) {}

  get isStarted(): boolean {
    return !!this.timerId
  }

  get currentCount(): number {
    return this.counter.value
  }

  start = () => {
    console.log(this.name ?? "Animator", "start called, timerId = ", this.timerId)

    if (this.isStarted) throw new Error(AnimatorErrorTypes.TimerAlreadyStarted)

    this.timerId = setInterval(() => {
      this.tickFn(this)
      this.counter.increment()
    }, this.delayMs)
    console.log(this.name ?? "Animator", "started, timerId = ", this.timerId)
  }

  stop = () => {
    console.log(this.name ?? "Animator", "stop called, timerId = ", this.timerId)

    if (!this.isStarted) throw new Error(AnimatorErrorTypes.TimerNotStarted)

    clearInterval(this.timerId!!)
    this.timerId = null
    console.log(this.name ?? "Animator", "stopped, timerId = ", this.timerId)
  }
}

export type AnimatorTickFn = (animator: Animator) => void

export const AnimatorErrorTypes = {
  TimerAlreadyStarted: "Animator has already been started, can't restart it until after it stops",
  TimerNotStarted: "Animator has not been started, can't be stopped",
} as const

export class Counter {
  private count: number

  constructor(startCount = 0) {
    this.count = startCount
  }

  get value(): number {
    return this.count
  }

  increment = () => this.count++

  getAndIncrement = () => {
    let retval = this.count
    this.count++
    return retval
  }
}

// Local type aliases.
type AnimatorState = [Animator, Dispatch<SetStateAction<Animator>>]

/**
 * Custom hook for animation, which sets up an Animator object with the given arguments and runs
 * tickFn() at the specified delay.
 */
export const useAnimator = (
  name: string,
  delayMs: number,
  maxNumberOfTicks: Optional<number>,
  tickFn: AnimatorTickFn
): Animator => {
  // Create a local state variable w/ Animator instance.
  const [animator]: AnimatorState = useState<Animator>(
    new Animator(name, delayMs, _tickFnWrapperWithCheckToStopAnimationAfterMaxTicks)
  )

  // Create a hook to run only once when the component is first rendered to the DOM.
  // Notes:
  // - Similar to hooks into React lifecycle (componentDidMount, componentDidUnmount).
  // - This runs runs once, since the deps is narrowed to `animator` which doesn't change.
  // - It is also acceptable to pass `[]`.
  useEffect(_runAnimatorOnceAtStart, [animator])
  return animator

  function _tickFnWrapperWithCheckToStopAnimationAfterMaxTicks(myAnimator: Animator) {
    // Stop animation after certain number of calls to tickFn.
    if (maxNumberOfTicks) {
      if (myAnimator.currentCount > maxNumberOfTicks) {
        console.log(myAnimator.currentCount, myAnimator.isStarted)
        myAnimator.stop()
      }
    }
    // Perform a regular tick.
    tickFn(myAnimator)
  }
  function _runAnimatorOnceAtStart() {
    animator.start()

    // Cleanup callback for effect.
    return () => {
      if (animator.isStarted) animator.stop()
    }
  }
}
