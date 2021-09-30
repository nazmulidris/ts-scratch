import React from "react"
import renderer from "react-test-renderer"
import { ComponentWithoutState } from "../ComponentWithoutState"

it("ComponentWithoutState renders correctly", function () {
  const tree = renderer.create(<ComponentWithoutState message={"snapshot test"} />).toJSON()
  expect(tree).toMatchSnapshot()
})
