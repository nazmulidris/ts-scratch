/*
 * Copyright 2021 Nazmul Idris. All rights reserved.
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
 *
 */

import React from "react"

export interface MessageProps {
  readonly message: string
}

export interface MessagePropsWithChildren extends MessageProps {
  /** More info: https://linguinecode.com/post/pass-react-component-as-prop-with-typescript */
  readonly children?: React.ReactNode
}

export interface MonkeyCountProps {
  readonly monkeyCount: number
}
