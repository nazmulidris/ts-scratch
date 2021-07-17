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

import { Dispatch, FC, ReactElement, SetStateAction, useState } from "react"
import { AnimationFrames, AnimationFramesProps } from "./types"
import { Animator, useAnimator } from "./Animator"

/** AnimationConstants. */
const AnimationConstants = {
  delayMs: 700,
  maxLoops: 2,
} as const

// Local type aliases.
type MyPropShape = { animationFrames: Readonly<AnimationFrames> }
type MyFrameIndexState = [number, Dispatch<SetStateAction<number>>]

export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): ReactElement => {
  // Get animationFrames array from props.
  const { animationFrames }: MyPropShape = props

  // Create a local state variable frameIndex (mutable) w/ a number.
  const [frameIndex, setFrameIndex]: MyFrameIndexState = useState<number>(0)

  // Use custom hook to setup the animation.
  useAnimator(
    ReactReplayFunctionComponent.name,
    AnimationConstants.delayMs,
    animationFrames.length * AnimationConstants.maxLoops - 1,
    _tick
  )

  // Render - based on the props and state, render the correct frame in the animation sequence.
  return _render()

  function _tick(myAnimator: Animator) {
    setFrameIndex(myAnimator.currentCount % animationFrames.length)
  }

  function _render() {
    return animationFrames[frameIndex]
  }
}
