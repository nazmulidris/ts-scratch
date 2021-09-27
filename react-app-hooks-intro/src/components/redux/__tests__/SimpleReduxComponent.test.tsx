import { SimpleReduxComponent, store } from "../SimpleReduxComponent"
import { render, fireEvent, waitFor, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import React from "react"

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
