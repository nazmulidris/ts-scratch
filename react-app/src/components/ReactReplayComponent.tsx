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
import { _also } from "r3bl-ts-utils"
import React, { RefObject } from "react"
import { VirtualDomElementGenerator } from "./GenerateReactElement"

/** Constants. */
const MyConstants = {
  animationDelayMs: 700,
} as const

/** Misc utility classes. */
class Counter {
  count: number = 0
  get = (): number => this.count
  increment = () => this.count++
  getAndIncrement = () => {
    let retval = this.count
    this.count++
    return retval
  }
}

class User {
  constructor(readonly firstName: string, readonly lastName: string) {}
  get name(): string {
    return this.firstName + " " + this.lastName
  }
}

/**
 * Component that doesn't use `setState()` or `forceUpdate()` to re-render. This is why a ref
 * is needed. More info on refs: https://reactjs.org/docs/refs-and-the-dom.html
 */
export class ReactReplayComponent extends React.Component {
  readonly counter: Counter = new Counter()
  readonly user: User = new User("R3BL", "Commander")
  readonly helloInMultipleLanguages: string[] = ["Hello", "Tere", "Bonjour", "Olá", "Salve"]

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

  constructor(props: {}) {
    super(props)

    // This ref will be used by renderAnimationFrame.
    this.myRef = React.createRef()

    // Create the immutable elementArray which holds React elements.
    this.elementArray = _also(new Array<JSX.Element>(), (elementArray) => {
      this.helloInMultipleLanguages
        .map((lang) => VirtualDomElementGenerator(lang, this.user.name))
        .forEach((localizedElement) => elementArray.push(localizedElement))
    })
  }

  /** Initial state, before animation and updates the ref. */
  render = (): JSX.Element => <div ref={this.myRef}>{this.elementArray[0]} </div>

  startAnimation = (): void => {
    let timerId: NodeJS.Timeout = setInterval(
      () => this.renderAnimationFrame(timerId),
      MyConstants.animationDelayMs
    )
  }

  renderAnimationFrame = (timerId: NodeJS.Timeout) => {
    // Tell React to render the Virtual DOM elements to the DOM.
    const virtualDomElement =
      this.elementArray[this.counter.getAndIncrement() % this.elementArray.length]
    const domElement = this.myRef.current
    ReactDOM.render(virtualDomElement, domElement)

    // Cancel animation after a certain count.
    if (this.counter.getAndIncrement() > this.elementArray.length * 2) {
      ReactDOM.render(<h2>Animation finished!🎉</h2>, domElement)
      clearInterval(timerId)
    }
  }

  componentDidMount() {
    this.startAnimation()
  }
}
