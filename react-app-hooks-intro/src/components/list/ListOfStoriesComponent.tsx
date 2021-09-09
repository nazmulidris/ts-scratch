import React, { Dispatch, FC, ReactElement, SetStateAction } from "react"
import { LocalStorageHook, MyLocalStorageEvents, useLocalStorage } from "./hooks"
import { getAsyncStoriesWithSimulatedNetworkLag } from "./data"
import { FnWithSingleArg, ListOfStoriesProps, Story } from "./types"
import { ReducerHookType, ReducerType, storiesReducer } from "./reducer"
import { Tooltip } from "../utils/Tooltip"

type SearchProps = {
  searchTerm: string
  onSearchFn: OnSearchFn
  takeInitialKeyboardFocus: boolean
}
type OnSearchFn = (event: React.ChangeEvent<HTMLInputElement>) => void
type ListProps = { list: Story[]; handleRemoveItem: FnWithSingleArg<Story> }
type ListItemProps = { item: Story; handleRemoveItem: FnWithSingleArg<Story> }

type StatusTextStateHookType = [string, Dispatch<SetStateAction<string>>]

export const ListOfStoriesComponent: FC<ListOfStoriesProps> = (props) => {
  const { takeInitialKeyboardFocus }: ListOfStoriesProps = props

  // Create a statusText state.
  const [statusText, setStatusText]: StatusTextStateHookType = React.useState<string>("")

  // Create a reducer to manage Story[] in the state.
  const [myStories, dispatchMyStories]: ReducerHookType = React.useReducer<ReducerType>(
    storiesReducer,
    new Array<Story>()
  )

  // useEffect to fetch the Story[] (simulating network delay).
  React.useEffect(
    () => {
      setStatusText("Fetching data...")
      getAsyncStoriesWithSimulatedNetworkLag()
        .then((value) => {
          setStatusText("Got data!")
          dispatchMyStories({
            type: "setState",
            payload: value,
          })
          setTimeout(() => {
            setStatusText("")
          }, 1000)
        })
        .catch((error) => {
          setStatusText(`Error! ${error}`)
        })
    },
    [] /* Only run this effect once; akin to componentDidMount. */
  )

  // Custom hook for local storage.
  const [searchTerm, setSearchTerm]: LocalStorageHook = useLocalStorage("search", "React")

  // Functions to filter the stories based on what the user types into the text input.
  const onSearchFn: OnSearchFn = (event) => {
    setSearchTerm(event.target.value)
  }
  const filteredStories: Story[] = myStories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const clearFilter = () => {
    MyLocalStorageEvents.storage.setValue("search", "")
    console.log("clearFilter called")
  }

  const handleRemoveItem: FnWithSingleArg<Story> = (objectToRemove: Story) => {
    console.log("handleRemoveItem called w/", objectToRemove)
    dispatchMyStories({
      type: "removeItem",
      payload: objectToRemove,
    })
  }

  return (
    <div className={"Container"}>
      <strong>
        My Searchable Stories
        {statusText.length === 0 ? false : <span> :: {statusText}</span>}
        {/*{statusText.length !== 0 && <span> :: {statusText}</span>}*/}
      </strong>
      <SearchComponent
        searchTerm={searchTerm}
        onSearchFn={onSearchFn}
        takeInitialKeyboardFocus={takeInitialKeyboardFocus}
      >
        <strong>Search: </strong>
      </SearchComponent>
      <button onClick={clearFilter}>Clear</button>
      <ListComponent handleRemoveItem={handleRemoveItem} list={filteredStories} />
    </div>
  )
}

// 🤔 Note that if the FCs below are defined inside the ListOfStoriesComponent they behave
// differently with keyboard focus, than if they are defined outside it! This might have
// something to do with [this](https://stackoverflow.com/a/56655447/2085356). If things are
// declared inside of a function, then they will be recreated everytime that function is run, vs
// if they are declared outside, then they won't be recreated on every render call.

const SearchComponent: FC<SearchProps> = (props) => {
  const { takeInitialKeyboardFocus, searchTerm, onSearchFn, children } = props

  // Run this effect to log inputRef.
  const [showUi, setShowUi] = React.useState(true)
  function onButtonClicked() {
    setShowUi((prevState) => !prevState)
    console.log("showUi", showUi)
  }
  React.useEffect(() => {
    console.log("✨ Creating inputRef related effect")
    const logInputRef = (msg: string) => {
      console.log(
        `${msg}\n`,
        inputRef.current ? "🎉 has DOM element" : "🧨 does not have DOM element"
      )
    }
    logInputRef("🎹✨ inputRef")
    return () => {
      logInputRef("🎹🗑 Do something here to unregister the DOM element, inputRef")
    }
  }, [showUi])

  // useEffect hook for initial keyboard focus on input element.
  const inputRef: React.MutableRefObject<any> = React.useRef()
  React.useEffect(() => {
    if (inputRef.current && takeInitialKeyboardFocus) {
      inputRef.current.focus()
    }
  })

  const tooltipText =
    "Toggle whether this component is shown or not. Triggers useEffect mount and unmount."
  return (
    <section>
      {showUi && (
        <>
          <label htmlFor="search">{children}</label>
          <input id="search" type="text" value={searchTerm} onChange={onSearchFn} ref={inputRef} />
        </>
      )}
      <Tooltip tooltipText={tooltipText}>
        <button onClick={onButtonClicked}>➕/➖</button>
      </Tooltip>
    </section>
  )
}

const ListComponent: FC<ListProps> = (props) => {
  const { list, handleRemoveItem }: ListProps = props
  let elements: ReactElement[] = list.map((it) => (
    <ListItemComponent key={it.objectID} handleRemoveItem={handleRemoveItem} item={it} />
  ))
  return <ul>{elements.length === 0 ? <li>Empty</li> : elements}</ul>
}

const ListItemComponent: FC<ListItemProps> = (props) => {
  const { item, handleRemoveItem }: ListItemProps = props
  const element = (
    <>
      <a href={item.url}>{item.title}</a>, {item.author}, {item.num_comments}, {item.points}
      <button onClick={() => handleRemoveItem(item)}>💣</button>
    </>
  )
  return <li>{element}</li>
}
