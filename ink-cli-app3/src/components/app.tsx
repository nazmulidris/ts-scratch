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

//#region Imports.
import { Box, useApp } from "ink"
import {
  _callIfTrue,
  _let,
  TTYSize,
  useClock,
  useKeyboard,
  usePreventProcessExitDuringTesting,
  UserInputKeyPress,
  useTTYSize,
} from "r3bl-ts-utils"
import React, { FC } from "react"
import { Style, TextStyle } from "./global-style"
//#endregion

//#region App function component.
export const appFn: FC<{ name: string }> = ({ name }) => render(runHooks(name))

function runHooks(name: string): LocalVars {
  usePreventProcessExitDuringTesting() // For testing using `npm run start-dev-watch`.
  const ttySize: TTYSize = useTTYSize()
  const time = useClock()
  const inRawMode = _let(useApp(), (it) => {
    const [_, inRawMode] = useKeyboard(onKeyboardFn.bind({ useApp: it }))
    return inRawMode
  })
  return {
    name,
    ttySize,
    time,
    inRawMode,
  }
}
interface LocalVars {
  ttySize: TTYSize
  inRawMode: boolean
  time: number
  name: string
}
//#endregion

//#region Handle keyboard input.
/**
 * 🪄 This function implements `KeyboardInputHandlerFn` interface.
 *
 * `this` binds it to an object of type OnKeyboardContext. Since this function is a callback that's
 * executed by Ink itself, it can't make any calls to hooks (like `useApp()` which is why re-binding
 * `this` is needed).
 */
function onKeyboardFn(
  this: {
    useApp: ReturnType<typeof useApp>
  },
  keyPress: UserInputKeyPress
) {
  const { useApp } = this

  _callIfTrue(keyPress.toString() === "ctrl+q", useApp.exit)
  _callIfTrue(keyPress.toString() === "q", useApp.exit)
  _callIfTrue(keyPress.toString() === "escape", useApp.exit)
}
//#endregion

//#region render().
function render(locals: LocalVars) {
  const { inRawMode, ttySize, time } = locals
  return (
    <Box flexDirection="row" alignSelf={"center"} height={ttySize.rows}>
      <Box
        borderStyle="round"
        borderColor={Style.brandColor}
        flexDirection="row"
        paddingLeft={1}
        paddingRight={1}
        width={Style.appWidth}
      >
        <Box flexDirection="column" flexBasis={Style.column1Width}>
          {renderColumn1(locals)}
          {TextStyle.subHeading(new Date(time).toLocaleTimeString())}
          {inRawMode ? TextStyle.subHeading("keyb enabled") : TextStyle.subHeading("keyb disabled")}
        </Box>
        <Box flexDirection="column" flexGrow={1}>
          {renderColumn2(locals)}
        </Box>
      </Box>
    </Box>
  )
}
//#endregion

//#region UI.
function renderColumn1(locals: LocalVars): JSX.Element {
  const { name } = locals
  return (
    <>
      {TextStyle.heading("1st column")}
      {TextStyle.subHeading("Hello")}
      {TextStyle.emphasis(name)}
    </>
  )
}

function renderColumn2(locals: LocalVars): JSX.Element {
  const { ttySize } = locals
  return (
    <>
      {TextStyle.heading("2nd column")}
      {TextStyle.styleNormal("Item 1")}
      {TextStyle.styleNormal("Item 2")}
      {TextStyle.heading(ttySize.toString())}
    </>
  )
}
//#endregion
