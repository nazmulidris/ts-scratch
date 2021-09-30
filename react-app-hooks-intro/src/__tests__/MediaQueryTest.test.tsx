import { render, screen, waitFor } from "@testing-library/react"
import React from "react"
import { act } from "react-dom/test-utils"
import { ComponentWithoutState, TestIdWindowSize } from "../components/basics/ComponentWithoutState"

/** Get around `window.innerWidth` and `window.innerHeight` are readonly. */
const resizeWindow = (x: number, y: number) => {
  window = Object.assign(window, { innerWidth: x })
  window = Object.assign(window, { innerHeight: y })
  window.dispatchEvent(new Event("resize"))
}

describe("media query test", () => {
  it("should be large window size", async () => {
    render(
      <div>
        <ComponentWithoutState message={"test"} />
      </div>
    )

    // Wrap any calls to React state changes in act().
    // More info: https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
    act(() => resizeWindow(2000, 1000))

    await waitFor(() => screen.getByTestId(TestIdWindowSize))

    const checkContent = screen.getByTestId(TestIdWindowSize)
    expect(checkContent).toHaveTextContent("2000 x 1000")
  })
})
