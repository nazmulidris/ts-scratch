import { Box, Newline, render, Text, useApp, useFocus, useFocusManager } from "ink"
import {
  _callIfTrue,
  KeyboardInputHandlerFn,
  makeReactElementFromArray,
  useKeyboard,
  UserInputKeyPress,
} from "r3bl-ts-utils"
import React, { FC } from "react"

//#region Main functional component.
const UseFocusExample: FC = function (): JSX.Element {
  const [keyPress, inRawMode] = useKeyboard(
    onKeyPress.bind({ app: useApp(), focusManager: useFocusManager() })
  )

  return (
    <Box flexDirection="column">
      {keyPress && (
        <Row_Debug
          inRawMode={inRawMode}
          keyPressed={keyPress?.key}
          inputPressed={keyPress?.input}
        />
      )}
      <Row_Instructions />
      <Row_FocusableItems />
    </Box>
  )
}
//#endregion

//#region Keypress handler.
const onKeyPress: KeyboardInputHandlerFn = function (
  this: { app: ReturnType<typeof useApp>; focusManager: ReturnType<typeof useFocusManager> },
  userInputKeyPress: UserInputKeyPress
) {
  const { app, focusManager } = this
  const { exit } = app
  const { focus } = focusManager
  const { input, key } = userInputKeyPress

  _callIfTrue(input === "q", exit)
  _callIfTrue(key === "ctrl" && input === "q", exit)
  _callIfTrue(input === "!", () => focus("1"))
  _callIfTrue(input === "@", () => focus("2"))
  _callIfTrue(input === "#", () => focus("3"))
}
//#endregion

//#region UI.

function Row_Debug(props: {
  inRawMode: boolean
  keyPressed: string | undefined
  inputPressed: string | undefined
}) {
  const { inputPressed, keyPressed, inRawMode } = props
  return inRawMode ? (
    <>
      <Text color={"magenta"}>input: {inputPressed}</Text>
      <Text color={"gray"}>key: {keyPressed}</Text>
    </>
  ) : (
    <Text>keyb disabled</Text>
  )
}

const Row_Instructions: FC = function (): JSX.Element {
  return makeReactElementFromArray(
    [
      ["blue", "Press Tab to focus next element"],
      ["blue", "Shift+Tab to focus previous element"],
      ["blue", "Esc to reset focus."],
      ["green", "Press Shift+<n> to directly focus on 1st through 3rd item."],
      ["red", "To exit, press Ctrl+q, or q"],
    ],
    (item: string[], id: number): JSX.Element => (
      <Text color={item[0]} key={id}>
        {item[1]}
      </Text>
    )
  )
}

const Row_FocusableItems: FC = function (): JSX.Element {
  return (
    <Box padding={1} flexDirection="row" justifyContent={"space-between"}>
      <FocusableItem id="1" label="First" />
      <FocusableItem id="2" label="Second" />
      <FocusableItem id="3" label="Third" />
    </Box>
  )
}

const FocusableItem: FC<{ label: string; id: string }> = function ({ label, id }): JSX.Element {
  const { isFocused } = useFocus({ id })
  return (
    <Text>
      {label}
      {isFocused ? (
        <>
          <Newline />
          <Text color="green">(*)</Text>
        </>
      ) : (
        <>
          <Newline />
          <Text color="gray">n/a</Text>
        </>
      )}
    </Text>
  )
}

//#endregion

render(<UseFocusExample />)
