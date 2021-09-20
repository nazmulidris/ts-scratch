import React, { FC } from "react"
import { configureStore, Reducer } from "@reduxjs/toolkit"
import { DefaultRootState, useSelector } from "react-redux"

// Functional component.
export const SimpleReduxComponent: FC = () => {
  const state: DefaultRootState = useSelector((state) => state)
  const myState = state as State

  function addString() {
    store.dispatch({
      type: "add",
      payload: "NazmulMaretIdris".substring(Math.floor(Math.random() * 15)),
    })
  }

  function removeListItem(index: number) {
    store.dispatch({
      type: "remove",
      payload: index,
    })
  }

  function render() {
    return (
      <div className={"Container"}>
        <button onClick={addString}>Add</button>
        <ol>
          {myState.strings.map((string, index) => (
            <li onClick={() => removeListItem(index)}>{string}</li>
          ))}
        </ol>
      </div>
    )
  }

  return render()
}

// Types.
type State = {
  strings: Array<string>
}
type Action = {
  type: "add" | "remove" | "clear"
  payload?: any
}

// Reducer function.
const reducerFn: Reducer<State | undefined, Action> = (state, action): State => {
  if (!state)
    return {
      strings: ["11222", "ddddd"],
    }

  switch (action.type) {
    case "add":
      return { strings: [...state.strings, action.payload] }
    case "remove":
      // Get the index (the string we want to remove).
      const index = action.payload
      // Make a copy of the old state.
      const copyOfState = [...state.strings]
      // Remove the element in position index and return the new state.
      copyOfState.splice(index, 1)
      return { strings: copyOfState }
  }
  return state
}

// Redux store.
export const store = configureStore({
  reducer: reducerFn,
})
