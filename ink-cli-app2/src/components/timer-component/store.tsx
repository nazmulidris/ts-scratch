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

import { EffectCallback } from "react"
import { configureStore, EnhancedStore } from "@reduxjs/toolkit"
import { Action, reducerFn, ReducerType } from "./timer-reducer"
import { createAndManageTimer } from "./timer-redux-connector"

// Create Redux store.
export type TimerStore = EnhancedStore<ReducerType, Action, any>
export const store = configureStore<ReducerType>({
  reducer: reducerFn,
}) as TimerStore

// Create Timer and connect it to the Redux store.
export const effectFn: EffectCallback = createAndManageTimer()
