import { Story } from "./types"
import * as _ from "lodash"
import { Dispatch, Reducer } from "react"

export type StateType = Story[]
export type ActionType = {
  type: "setState" | "removeItem"
  payload?: any
}
export type ReducerType = Reducer<StateType, ActionType>
export type ReducerHookType = [StateType, Dispatch<ActionType>]

export const storiesReducer = (currentState: StateType, action: ActionType): StateType => {
  console.log("storiesReducer -> \ncurrentState:", currentState, "\n-> action:", action)
  let newState: StateType
  switch (action.type) {
    case "removeItem":
      const itemToRemove = action?.payload as Story
      newState = currentState.filter((story) => story.objectID !== itemToRemove.objectID)
      break
    case "setState":
      newState = action.payload as Story[]
      break
    default:
      throw new Error(`Invalid action: ${action}`)
  }
  console.log("return newState", newState)
  return _.cloneDeep(newState)
}
