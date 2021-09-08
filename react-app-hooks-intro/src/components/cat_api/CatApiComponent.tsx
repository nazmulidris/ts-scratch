import React, { Dispatch, FC, Reducer } from "react"
import _ from "lodash"

// Types.
type Action = {
  type: "fetchStart" | "fetchOk" | "fetchErr"
  payload?: CatApiSearchResult[]
}
type State = {
  isFetching: boolean
  isError: boolean
  isOk: boolean
  catApiSearchResults: Readonly<CatApiSearchResult[]>
}
const initialState: Readonly<State> = {
  isFetching: false,
  isError: false,
  isOk: true,
  catApiSearchResults: new Array<CatApiSearchResult>(),
} as const

// TheCatApi - https://docs.thecatapi.com/api-reference/images/images-search
type CatApiSearchResult = { imageId: string; imageUrl: string }
const TheCatApi = {
  apiKey: process.env.REACT_APP_CAT_API_KEY,
  search: {
    endpoint: "https://api.thecatapi.com/v1/images/search",
    numberOfResultsToGet: 3,
  },
} as const

// FC.
export const CatApiComponent: FC = () => {
  const [myState, myStateDispatcher]: ReducerHookType = React.useReducer<ReducerType>(
    reducerFn,
    initialState
  )
  return (
    <h1 className={"Container"}>
      TODO CatApiComponent
      <p>ApiKey: {TheCatApi.apiKey}</p>
      {myState.isFetching && <h2>Loading ...</h2>}
      {myState.isError && <h2>Error!</h2>}
      {myState.isOk && (
        <p>myState.catApiSearchResults.length: {myState.catApiSearchResults.length}</p>
      )}
    </h1>
  )
}

// Reducer.
type ReducerType = Reducer<State, Action>
type ReducerHookType = [State, Dispatch<Action>]

function reducerFn(currentState: State, action: Action): State {
  console.log("storiesReducer -> \ncurrentState:", currentState, "\n-> action:", action)

  let copyOfState = _.cloneDeep(currentState)

  switch (action.type) {
    case "fetchErr":
      break
    case "fetchOk":
      break
    case "fetchStart":
      break
    default:
      throw new Error(`Illegal action type: '${action.type}'`)
  }

  return copyOfState
}
