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
import { configureStore, EnhancedStore } from "@reduxjs/toolkit"
import { _also } from "r3bl-ts-utils"

// Define reducer function.

export const reducerFn = (currentState: State | undefined, action: Action): State =>
  !currentState
    ? initialState
    : _also(_.clone(currentState), (newState) => {
        switch (action.type) {
          case "switchTab": {
            newState.currentTabId = action.id
            break
          }
          case "addTab": {
            newState.allTabs.push(action.tab)
            break
          }
          case "removeTab": {
            const cantRemoveOnlyTabThatIsCurrent =
              currentState.currentTabId === action.id && currentState.allTabs.length === 1
            if (cantRemoveOnlyTabThatIsCurrent) break
            newState.allTabs = newState.allTabs.filter((item) => item.id !== action.id)
            break
          }
        }
      })

// Define State shape.

export type State = {
  currentTabId: string
  allTabs: Array<Tab> // TODO replace w/ actual tab type.
}

// Constants.

const initialState: Readonly<State> = {
  currentTabId: "",
  allTabs: new Array<Tab>(),
}

// Other types.
export interface Tab {
  id: string
}

// Define Actions.

export type Action = SwitchTab | RemoveTab | AddTab
interface SwitchTab {
  type: "switchTab"
  id: string
}
interface RemoveTab {
  type: "removeTab"
  id: string
}
interface AddTab {
  type: "addTab"
  tab: Tab
}

// Create Redux store.

export type AppStoreReducer = Reducer<State | undefined, Action>
export type AppStore = EnhancedStore<AppStoreReducer, Action>
export const store = configureStore<AppStoreReducer>({ reducer: reducerFn }) as unknown as AppStore
