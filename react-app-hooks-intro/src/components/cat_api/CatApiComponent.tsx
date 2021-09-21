import React, { Dispatch, FC, ReactElement, Reducer } from "react"
import _ from "lodash"
import axios from "axios"
import { _also } from "r3bl-ts-utils"
import "./CatApiComponent.css"
import { Tooltip } from "../utils/Tooltip"

// Types.
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

type Action = ActionFetchStart | ActionFetchOk | ActionFetchError
type State = {
  isFetching: boolean
  isError: boolean
  isOk: boolean
  catApiSearchResults: CatApiSearchResult[]
  error?: any
}
const initialState: State = {
  isFetching: false,
  isError: false,
  isOk: true,
  catApiSearchResults: new Array<CatApiSearchResult>(),
}

// TheCatApi - https://docs.thecatapi.com/api-reference/images/images-search
type CatApiSearchResult = { id: string; url: string }
const TheCatApi = {
  apiKey: process.env.REACT_APP_CAT_API_KEY,
  search: {
    endpoint: "https://api.thecatapi.com/v1/images/search",
    config: { params: { limit: 3, size: "full" } },
  },
} as const

// FC.
export const CatApiComponent: FC = () => {
  const [myState, myStateDispatcher]: ReducerHookType = React.useReducer<ReducerType>(
    reducerFn,
    initialState
  )

  React.useEffect(
    () => {
      myStateDispatcher({ type: "fetchStart" })
      axios.defaults.headers.common["x-api-key"] = TheCatApi.apiKey
      _also(TheCatApi.search, async (it) => {
        try {
          const response = await axios.get(it.endpoint, it.config)
          myStateDispatcher({ type: "fetchOk", payload: response.data })
        } catch (error) {
          myStateDispatcher({ type: "fetchError", error: error })
        }
      })
    },
    [] /* Run once, like componentDidMount. */
  )

  function renderCats(cats: CatApiSearchResult[]): ReactElement[] {
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

  return (
    <div className={"Container"}>
      {myState.isFetching && <p>Loading ...</p>}
      {myState.isError && <p>Error!{myState.error}</p>}
      {myState.isOk && renderCats(myState.catApiSearchResults)}
    </div>
  )
}

// Reducer.
type ReducerType = Reducer<State, Action>
type ReducerHookType = [State, Dispatch<Action>]

const reducerFn: ReducerType = (currentState: State, action: Action): State => {
  let newState = _.cloneDeep(currentState)

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
