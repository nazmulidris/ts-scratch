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

import React from "react"
import { NestedComponentUsingState } from "./NestedComponentUsingState"
import { MessageProps } from "../types"
import styles from "../../styles/App.module.css"

interface CounterState {
  count: number
}

export class ComponentWithState extends React.Component<MessageProps, CounterState> {
  state = { count: 0 }

  increaseCounter = () => {
    const newCount = this.state.count + 1
    this.setState({ count: newCount })
  }

  render() {
    return (
      <React.Fragment>
        <section className={styles.Container}>
          <code>this.state.count={this.state.count}</code>
          <button onClick={this.increaseCounter}>{this.props.message}</button>
          <NestedComponentUsingState monkeyCount={this.state.count} />
        </section>
      </React.Fragment>
    )
  }
}
