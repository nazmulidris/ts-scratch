import React from "react"
import { render, screen } from "@testing-library/react"
import App from "../App"

test("renders Helloooooo!!!! page", () => {
  render(<App />)
  const element = screen.getByText(/Helloooooo/i)
  expect(element).toBeInTheDocument()
})
