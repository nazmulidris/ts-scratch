import React, { Dispatch, FC, ReactElement, Reducer } from "react"
import _ from "lodash"
import axios from "axios"
import { _also } from "r3bl-ts-utils"
import "./CatApiComponent.css"
import { Tooltip } from "../utils/Tooltip"

// TheCatApi - https://docs.thecatapi.com/api-reference/images/images-search
export namespace TheCatApi {
  export const apiKey = process.env.REACT_APP_CAT_API_KEY as string
  export const search = {
    host: "https://api.thecatapi.com",
    endpoint: "/v1/images/search",
    config: { params: { limit: 3, size: "full" } },
  } as const
  export type SearchResults = { id: string; url: string }
}

// Types.
namespace MyActions {
  import CatApiSearchResult = TheCatApi.SearchResults

  interface ActionFetchStart {
    type: "fetchStart"
  }

  interface ActionFetchOk {
    type: "fetchOk"
    payload: CatApiSearchResult[]
  }

  interface ActionFetchError {
    type: "fetchError"
    error: any
  }

  export type Action = ActionFetchStart | ActionFetchOk | ActionFetchError
}

namespace MyState {
  import CatApiSearchResult = TheCatApi.SearchResults
  export type State = {
    isFetching: boolean
    isError: boolean
    isOk: boolean
    catApiSearchResults: CatApiSearchResult[]
    error?: any
  }
  export const initialState: State = {
    isFetching: false,
    isError: false,
    isOk: true,
    catApiSearchResults: new Array<CatApiSearchResult>(),
  }
}

// Reducer.
namespace MyReducers {
  import State = MyState.State
  import Action = MyActions.Action

  export type ReducerType = Reducer<State, Action>
  export type ReducerHookType = [State, Dispatch<Action>]

  export const reducerFn: ReducerType = (currentState: State, action: Action): State => {
    let newState = _.clone(currentState)

    switch (action.type) {
      case "fetchError":
        newState.isFetching = false
        newState.isError = true
        newState.error = action.error ?? newState.error
        break
      case "fetchOk":
        newState.isFetching = false
        newState.catApiSearchResults = action.payload ?? newState.catApiSearchResults
        break
      case "fetchStart":
        newState.isFetching = true
        break
      default:
        throw new Error(`Illegal action type: '${action}'`)
    }

    console.log(
      "🌐 reducerFn:\n->currentState:",
      currentState,
      "\n-> action:",
      action,
      "\n-> newState:",
      newState
    )

    return newState
  }
}

// Functional component.
export const CatApiComponent: FC = () => {
  const [myState, myStateDispatcher]: MyReducers.ReducerHookType =
    React.useReducer<MyReducers.ReducerType>(MyReducers.reducerFn, MyState.initialState)

  React.useEffect(() => makeApiCall(), [] /* Run once, like componentDidMount. */)

  function makeApiCall() {
    myStateDispatcher({ type: "fetchStart" })
    axios.defaults.headers.common["x-api-key"] = TheCatApi.apiKey
    _also(TheCatApi.search, async (it) => {
      try {
        const response = await axios.get(it.host + it.endpoint, it.config)
        myStateDispatcher({ type: "fetchOk", payload: response.data })
      } catch (error) {
        myStateDispatcher({ type: "fetchError", error: error })
      }
    })
  }

  function renderCats(cats: TheCatApi.SearchResults[]): ReactElement[] {
    // Note when returning an array, make sure that each item has a unique key prop.
    return _also(new Array<ReactElement>(), (it) => {
      cats.forEach((cat) =>
        it.push(
          <Tooltip key={cat.id} tooltipText={cat.id}>
            <img className={"Image"} src={cat.url} />
          </Tooltip>
        )
      )
    })
  }

  function render() {
    return (
      <div className={"Container"}>
        {myState.isFetching && <p>Loading ...</p>}
        {myState.isError && <p>Error!{myState.error}</p>}
        {myState.isOk && renderCats(myState.catApiSearchResults)}
      </div>
    )
  }

  return render()
}
