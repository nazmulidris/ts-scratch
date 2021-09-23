import { Story } from "./types"
import * as _ from "lodash"
import { Dispatch, Reducer } from "react"

export type StateType = Story[]
interface ActionSetState {
  type: "setState"
  payload: Story[]
}
interface ActionRemoveItem {
  type: "removeItem"
  payload: Story
}
export type ActionType = ActionSetState | ActionRemoveItem
export type ReducerType = Reducer<StateType, ActionType>
export type ReducerHookType = [StateType, Dispatch<ActionType>]

export const storiesReducer = (currentState: StateType, action: ActionType): StateType => {
  console.log("storiesReducer -> \ncurrentState:", currentState, "\n-> action:", action)
  let newState: StateType
  switch (action.type) {
    case "removeItem":
      const itemToRemove = action?.payload
      newState = currentState.filter((story) => story.objectID !== itemToRemove.objectID)
      break
    case "setState":
      newState = action.payload
      break
    default:
      throw new Error(`Invalid action: ${action}`)
  }
  console.log("return newState", newState)
  return _.clone(newState)
}
