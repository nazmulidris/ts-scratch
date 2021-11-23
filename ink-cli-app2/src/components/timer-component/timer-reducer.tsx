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

import { Reducer } from "react"
import _ from "lodash"

export type State = {
  count: number
  run: boolean
}

interface ActionStartTimer {
  type: "startTimer"
}
interface ActionStopTimer {
  type: "stopTimer"
}
interface ActionSetCount {
  type: "setCount"
  payload: number
}
export type Action = ActionStartTimer | ActionStopTimer | ActionSetCount

export type ReducerType = Reducer<State | undefined, Action>

export function reducerFn(current: State | undefined, action: Action): State {
  // Initial state.
  if (!current) {
    return {
      count: 0,
      run: false,
    }
  }

  let currentCopy: State = _.clone(current)
  switch (action.type) {
    case "setCount":
      currentCopy.count = action.payload
      break
    case "startTimer":
      currentCopy.run = true
      break
    case "stopTimer":
      currentCopy.run = false
      break
  }
  return currentCopy
}
