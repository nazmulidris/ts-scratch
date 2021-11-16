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

import React, { FC } from "react"
import { Text } from "ink"
import { useSelector } from "react-redux"
import * as TimerReducer from "./TimerReducer"
import { ReduxTimerAdapter } from "./ReduxTimerAdapter"

type PropType = {
  timerAdapter: ReduxTimerAdapter
}
export const ComponentToDisplayTimer: FC<PropType> = ({ timerAdapter }) => {
  const state = useSelector((state) => state) as TimerReducer.State

  React.useEffect(timerAdapter.startTimerEffectOnComponentMount, [] /* componentDidMount */)
  React.useEffect(timerAdapter.checkToStopTimerEffectOnRerender)

  return render()

  function render() {
    return (
      <Text color={"green"}>
        [{state.count} tests passed]
        {showSkullIfTimerIsStopped()}
      </Text>
    )
  }

  function showSkullIfTimerIsStopped() {
    return !state.run ? "💀" : null
  }
}
