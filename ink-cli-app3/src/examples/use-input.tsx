import React, { useState } from "react"
import { Box, render, Text, useApp, useInput } from "ink"
import { _callIfTruthy } from "r3bl-ts-utils"

const UseInputExample = () => {
  const { exit } = useApp()
  const [x, setX] = useState(1)
  const [y, setY] = useState(1)
  useInput((input, key) => {
    _callIfTruthy(input === "q", () => exit())
    _callIfTruthy(key.leftArrow, () => setX(Math.max(1, x - 1)))
    _callIfTruthy(key.rightArrow, () => setX(Math.min(20, x + 1)))
    _callIfTruthy(key.upArrow, () => setY(Math.max(1, y - 1)))
    _callIfTruthy(key.downArrow, () => setY(Math.min(10, y + 1)))
  })

  return (
    <Box flexDirection="column">
      <Text color={"green"}>Use arrow keys to move the X.</Text>
      <Text color={"red"}>Press “q” to exit.</Text>
      <Box height={12} paddingLeft={x} paddingTop={y}>
        <Text color={"blue"}>X</Text>
      </Box>
    </Box>
  )
}

render(<UseInputExample />)
