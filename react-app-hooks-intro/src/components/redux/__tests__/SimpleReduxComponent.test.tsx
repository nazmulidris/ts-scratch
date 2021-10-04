import {
  SimpleReduxComponent,
  SimpleReduxComponentForTesting,
  store,
} from "../SimpleReduxComponent"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import React from "react"
import { Reducer } from "@reduxjs/toolkit"

/**
 * RTL - https://testing-library.com/docs/react-testing-library/api#render
 * dom-testing-library - https://testing-library.com/docs/queries/byrole
 * HTML ARIA roles - https://www.w3.org/TR/html-aria/#docconformance
 */
describe("SimpleReduxComponent user interactions", () => {
  test("displays few list items at start", async () => {
    render(
      <Provider store={store}>
        <SimpleReduxComponent />
      </Provider>
    )

    await waitFor(() => screen.getByRole("list"))
    expect(screen.getByRole("list").children).toHaveLength(2)
  })

  test("clicking add button adds item", async () => {
    render(
      <Provider store={store}>
        <SimpleReduxComponent />
      </Provider>
    )

    await waitFor(() => screen.getByRole("button"))
    fireEvent.click(screen.getByRole("button"))

    expect(screen.getByRole("list").children).toHaveLength(3)
  })

  test("clicking item removes it", async () => {
    render(
      <Provider store={store}>
        <SimpleReduxComponent />
      </Provider>
    )

    await waitFor(() => screen.getByRole("list"))
    fireEvent.click(screen.getByRole("list").children[0])

    expect(screen.getByRole("list").children).toHaveLength(2)
  })
})

describe("SimpleReduxComponent reducer function", () => {
  type State = SimpleReduxComponentForTesting._State | undefined
  type Action = SimpleReduxComponentForTesting._Action
  const reducerFn: Reducer<State, Action> = SimpleReduxComponentForTesting._reducerFn

  test("sets initial state", () => {
    const ignoredAction: Action = { type: "add", content: "text" }
    const state: State = reducerFn(undefined, ignoredAction)
    console.log(state)
    expect(state!!.textArray).toHaveLength(2)
  })

  test("dispatch add action works", () => {
    const action: Action = { type: "add", content: "foo" }
    const initialState: State = {
      textArray: [
        { id: "id4", content: "fffff" },
        { id: "id5", content: "gggg" },
      ],
    }
    const newState: State = reducerFn(initialState, action)
    console.log(newState)
    expect(newState!!.textArray).toHaveLength(3)
    expect(newState!!.textArray[2]).toMatchObject({ content: "foo" })
  })

  test("dispatch remove action works", () => {
    const action: Action = { type: "remove", id: "id4" }
    const initialState: State = {
      textArray: [
        { id: "id4", content: "fffff" },
        { id: "id5", content: "gggg" },
      ],
    }
    const newState: State = reducerFn(initialState, action)
    console.log(newState)
    expect(newState!!.textArray).toHaveLength(1)
    expect(newState!!.textArray[0]).toMatchObject({ content: "gggg" })
  })
})
