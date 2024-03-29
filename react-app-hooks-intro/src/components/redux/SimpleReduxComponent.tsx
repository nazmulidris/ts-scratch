import React, { FC } from "react"
import { configureStore, Reducer } from "@reduxjs/toolkit"
import { DefaultRootState, useSelector } from "react-redux"
import _ from "lodash"
import { _also } from "r3bl-ts-utils"
import styles from "../../styles/App.module.css"

export const MyAddButtonId = "MyAddButton"

// Functional component.
export const SimpleReduxComponent: FC = () => {
  const state: DefaultRootState = useSelector((state) => state)
  const myState = state as State

  return render()

  function render() {
    return (
      <div className={styles.Container}>
        <strong>SimpleReduxComponent</strong>
        <button id={MyAddButtonId} onClick={addListItem}>
          Add ➕
        </button>
        <ol>
          {myState.textArray.map((text) => (
            <li key={text.id} onClick={() => removeListItem(text.id)}>
              {text.content}
            </li>
          ))}
        </ol>
      </div>
    )
  }

  function addListItem() {
    return _also(
      {
        type: "add",
        content: "NazmulMaretIdris".substring(Math.floor(Math.random() * 15)),
      } as ActionAdd,
      (it) => {
        store.dispatch(it)
      }
    )
  }

  function removeListItem(it: string) {
    return _also({ type: "remove", id: it } as ActionRemove, (it) => {
      store.dispatch(it)
    })
  }
}

// Types.
type Text = {
  id: string
  content: string
}
type State = {
  textArray: Array<Text>
}
interface ActionAdd {
  type: "add"
  content: string
}
interface ActionRemove {
  type: "remove"
  id: string
}
type Action = ActionAdd | ActionRemove

// Reducer function.
const reducerFn: Reducer<State | undefined, Action> = (state, action): State => {
  if (!state)
    return {
      textArray: [
        { id: _.uniqueId("id"), content: "fffff" },
        { id: _.uniqueId("id"), content: "gggg" },
      ],
    }

  switch (action.type) {
    case "add": {
      const newText: Text = { id: _.uniqueId("id"), content: action.content }
      console.log("add", newText)
      const copyOfArray = new Array<Text>().concat(state.textArray)
      copyOfArray.push(newText)
      return Object.assign({} as State, state, { textArray: copyOfArray })
    }
    case "remove": {
      // Get the index (the string we want to remove).
      const id: string = action.id
      // Make a copy of the old state and remove the element w/ the given id
      const copyOfArray = new Array<Text>().concat(state.textArray).filter((it) => it.id !== id)
      console.log("remove", id)
      return Object.assign({} as State, state, { textArray: copyOfArray })
    }
  }
  return state
}

// Redux store.
export const store = configureStore({
  reducer: reducerFn,
})

// Export namespace for testing.
export namespace SimpleReduxComponentForTesting {
  export const _reducerFn: Reducer<State | undefined, Action> = reducerFn
  export type _State = State
  export type _Action = Action
}
