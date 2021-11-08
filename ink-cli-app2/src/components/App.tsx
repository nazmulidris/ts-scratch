/*
 * Copyright 2021 Google Inc. All rights reserved.
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

import React, { FC } from "react"
import { Box, Text } from "ink"
import { ComponentWithInterval } from "./ComponentWithInterval.js"

export const App: FC<{ name?: string }> = ({ name = "Stranger" }) => (
  <Box
    borderStyle={"round"}
    borderColor={Style.brandColor}
    flexDirection={"column"}
    alignItems={"center"}
  >
    <Text color={Style.textColor} backgroundColor={Style.backgroundColor}>
      {`👋 Hello 👋`}
    </Text>
    <Text bold color={Style.textColor} backgroundColor={Style.brandColor}>
      {name}
    </Text>
    <ComponentWithInterval />
  </Box>
)

const Style = {
  backgroundColor: "#161b22",
  textColor: "#e6e6e6",
  brandColor: "#2f9ece",
} as const
