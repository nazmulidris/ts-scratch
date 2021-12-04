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

import { Text } from "ink"
import React from "react"

export const Style = {
  backgroundColor: "#161b22",
  textColor: "#e6e6e6",
  brandColor: "#2f9ece",
  column1Width: "35%",
  appWidth: "90%",
}

// eslint-disable-next-line
export namespace TextStyle {
  export const subHeading = (text: string): JSX.Element => (
    <Text
      wrap="truncate-middle"
      bold
      color={Style.brandColor}
      backgroundColor={Style.backgroundColor}
    >
      {" " + text + " "}
    </Text>
  )

  export const heading = (text: string): JSX.Element => (
    <Text
      wrap="truncate-middle"
      bold
      color={Style.backgroundColor}
      backgroundColor={Style.brandColor}
    >
      {" " + text + " "}
    </Text>
  )

  export const emphasis = (text: string): JSX.Element => (
    <Text bold italic color={Style.textColor}>
      {text}
    </Text>
  )

  export const styleNormal = (text: string) => <Text color={Style.textColor}>{text}</Text>
}
