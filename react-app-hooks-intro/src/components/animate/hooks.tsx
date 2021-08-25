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

// Local type aliases.
import { Optional } from "r3bl-ts-utils"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Animator, AnimatorTickFn } from "./Animator"

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
