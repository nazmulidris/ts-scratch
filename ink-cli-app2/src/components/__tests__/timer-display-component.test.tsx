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

import { Provider } from "react-redux"
import {
  Action,
  TimerDisplayComponent,
  reducerFn,
  ReducerType,
  TimerStore,
} from "../timer-component"
import React from "react"
import { render } from "ink-testing-library"
import { configureStore, EnhancedStore } from "@reduxjs/toolkit"

let store: TimerStore

beforeEach(() => {
  // Create Redux store.
  store = configureStore<ReducerType>({
    reducer: reducerFn,
  }) as EnhancedStore<ReducerType, Action, any>
})

describe("ComponentToDisplayTimer", () => {
  test("renders correctly when timer is not started", () => {
    const { lastFrame } = render(React.createElement(TestFC, null))
    expect(lastFrame()).toContain("[0 tests passed]💀")
  })
})

describe("ComponentToDisplayTimer", () => {
  test("renders correctly when timer is started (which calls the tickFn)", () => {
    // Simulate a timer that is started, and then a tickFn is executed.
    store.dispatch({
      type: "startTimer",
    })
    store.dispatch({
      type: "setCount",
      payload: 10,
    })
    const { lastFrame } = render(React.createElement(TestFC, null))
    expect(lastFrame()).toContain("[10 tests passed]")
  })
})

const TestFC = () => (
  <Provider store={store}>
    <TimerDisplayComponent onComponentMountEffect={() => {}} />
  </Provider>
)
