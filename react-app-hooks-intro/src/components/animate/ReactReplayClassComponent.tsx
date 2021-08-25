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

import ReactDOM from "react-dom"
import React, { RefObject } from "react"
import { Animator, Counter } from "./Animator"
import { AnimationFramesProps } from "./types"

/** Constants. */
const MyConstants = {
  animationDelayMs: 700,
  maxLoopFactor: 4,
} as const

/**
 * Component that doesn't use `setState()` or `forceUpdate()` to re-render. This is why a ref
 * is needed. More info on refs: https://reactjs.org/docs/refs-and-the-dom.html
 *
 * This class component should really be written using hooks, since it only really needs to be in a
 * class in order to hook into certain React lifecycle callbacks, as it does not have any
 * local state.
 */
export class ReactReplayClassComponent extends React.Component<AnimationFramesProps, {}> {
  // First frame is shown by default, start animation w/ the 2nd frame (startCount = 1).
  readonly counter: Counter = new Counter(1)

  // The following are populated in the constructor.
  readonly myRef: RefObject<any>
  /**
   * More info on readonly vs ReadonlyArray:
   * - https://mariusschulz.com/blog/read-only-array-and-tuple-types-in-typescript
   * - https://basarat.gitbook.io/typescript/type-system/readonly
   *
   * You can write either:
   * - readonly elementArray: readonly JSX.Element[]
   * - readonly elementArray: ReadonlyArray<JSX.Element>
   */
  readonly elementArray: ReadonlyArray<JSX.Element>
  readonly animator: Animator

  constructor(props: AnimationFramesProps) {
    super(props)

    // This ref will be used by renderAnimationFrame.
    this.myRef = React.createRef()

    // Create the immutable elementArray which holds React elements.
    this.elementArray = this.props.animationFrames

    this.animator = new Animator(
      "[ClassComponentAnimator]",
      MyConstants.animationDelayMs,
      this.renderAnimationFrame
    )
  }

  componentDidMount = () => this.animator.start()

  /** Initial state, before animation and updates the ref. */
  render = (): JSX.Element => (
    <div className={"Container"} ref={this.myRef}>
      {this.elementArray[0]}{" "}
    </div>
  )

  renderAnimationFrame = () => {
    const domElement = this.myRef.current
    let virtualDomElement = this.elementArray[this.counter.value % this.elementArray.length]

    // Cancel animation after a certain count.
    if (this.counter.value > this.elementArray.length * MyConstants.maxLoopFactor) {
      this.animator.stop()
      virtualDomElement = <p>Animation finished!🎉</p>
    }

    // Tell React to render the Virtual DOM elements to the DOM.
    ReactDOM.render(virtualDomElement, domElement)
    this.counter.increment()
  }
}
