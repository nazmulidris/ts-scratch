import { Provider } from "react-redux"
import { ComponentToDisplayTimer } from "../ComponentToDisplayTimer"
import React from "react"
import { render } from "ink-testing-library"
import { configureStore, EnhancedStore } from "@reduxjs/toolkit"
import * as TimerReducer from "../TimerReducer"
import { Timer } from "r3bl-ts-utils"
import { ReduxTimerAdapter } from "../ReduxTimerAdapter"

const DEBUG = false

let store: EnhancedStore<TimerReducer.ReducerType, TimerReducer.Action, any>
let timer: Timer
let timerAdapter: ReduxTimerAdapter

beforeEach(() => {
  // Create Redux store.
  store = configureStore<TimerReducer.ReducerType>({
    reducer: TimerReducer.reducerFn,
  }) as EnhancedStore<TimerReducer.ReducerType, TimerReducer.Action, any>

  // Create Timer.
  timer = new Timer("Test", 1)

  // Create TimerAdapter.
  timerAdapter = new ReduxTimerAdapter(store, timer)
})

afterEach(() => {
  if (timer.isStarted) timer.stop()
})

describe("ComponentToDisplayTimer", () => {
  test("renders correctly when timer is not started", () => {
    const { lastFrame } = render(React.createElement(TestFC, null))
    expect(lastFrame()).toContain("[0 tests passed]💀")
  })
})

describe("ComponentToDisplayTimer", () => {
  test("renders correctly when timer is started (which calls the tickFn)", (done) => {
    // Initialize the timer's tickFn.
    timer.onTick = () => {
      store.dispatch({
        type: "setCount",
        payload: 10,
      })
      DEBUG && console.log("tick", timer.isStarted)
    }

    timer.startTicking()
    store.dispatch({
      type: "startTimer",
    })

    expect(timer.isStarted).toBeTruthy()
    expect(timer.currentCount).toEqual(0)

    // Let a few timer ticks occur.
    setTimeout(() => {
      const { lastFrame } = render(React.createElement(TestFC, null))
      expect(lastFrame()).toContain("[10 tests passed]")
      timer.stopTicking()
      done()
    }, 50)
  })
})

const TestFC = () => (
  <Provider store={store}>
    <ComponentToDisplayTimer timerAdapter={timerAdapter} />
  </Provider>
)
