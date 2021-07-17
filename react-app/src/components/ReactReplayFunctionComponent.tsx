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

import React, { FC, useEffect, useState } from "react"
import { AnimationFramesProps } from "./types"
import { Animator } from "./Animator"
import { Counter } from "./Counter"

/** Constants. */
const MyConstants = {
  animationDelayMs: 700,
  maxLoopFactor: 4,
  invalidFrameIndex: -1,
} as const

export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): JSX.Element => {
  /** State: currentAnimationFrameIndex (mutable). */
  const [currentAnimationFrameIndex, setCurrentAnimationFrameIndex] = useState<number>(0)

  /**
   * State: counter (immutable)
   * Note - First frame is shown by default, start animation w/ the 2nd frame (startCount = 1).
   */
  const [counter] = useState<Counter>(new Counter(1))

  /** State: animator (immutable). */
  const [animator] = useState<Animator>(
    new Animator(MyConstants.animationDelayMs, tick, "[FunctionalComponentAnimator]")
  )

  /** Based on the props and state, render the correct frame in the animation sequence. */
  function render() {
    switch (currentAnimationFrameIndex === MyConstants.invalidFrameIndex) {
      case true:
        return <h2>Animation finished!🎉</h2>
      default:
        return props.animationFrames[currentAnimationFrameIndex]
    }
  }

  /** Lambda that is executed at every tick by the animator. */
  function tick(myAnimator: Animator): void {
    let totalAnimationFrames = props.animationFrames.length

    // Trigger update.
    setCurrentAnimationFrameIndex(counter.getAndIncrement() % totalAnimationFrames)

    // Stop animation after certain number of loops.
    if (counter.value > totalAnimationFrames * MyConstants.maxLoopFactor) {
      console.log(counter.value, myAnimator.isStarted)
      myAnimator.stop()
      setCurrentAnimationFrameIndex(MyConstants.invalidFrameIndex)
    }
  }

  /** Starts the animator. */
  function runAnimatorAtStart() {
    animator.start()

    // Cleanup.
    return () => {
      if (animator.isStarted) animator.stop()
    }
  }

  // Similar to hooks into React lifecycle (componentDidMount, componentDidUnmount). This runs only
  // once, since the deps is narrowed to `animator` which doesn't change. It is also acceptable
  // to pass `[]`.
  useEffect(runAnimatorAtStart, [animator])

  // Actual render function result.
  return render()
}
