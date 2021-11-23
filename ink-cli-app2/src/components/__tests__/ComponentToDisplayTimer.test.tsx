import { Provider } from "react-redux"
import { ComponentToDisplayTimer } from "../ComponentToDisplayTimer"
import React from "react"
import { render } from "ink-testing-library"
import { configureStore, EnhancedStore } from "@reduxjs/toolkit"
import * as TimerReducer from "../TimerReducer"
import { ReduxTimerAdapter } from "../ReduxTimerAdapter"

let store: EnhancedStore<TimerReducer.ReducerType, TimerReducer.Action, any>
let timerAdapter: ReduxTimerAdapter

beforeEach(() => {
  // Create Redux store.
  store = configureStore<TimerReducer.ReducerType>({
    reducer: TimerReducer.reducerFn,
  }) as EnhancedStore<TimerReducer.ReducerType, TimerReducer.Action, any>

  // Create TimerAdapter.
  timerAdapter = new ReduxTimerAdapter(store)
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
    <ComponentToDisplayTimer timerAdapter={timerAdapter} />
  </Provider>
)
