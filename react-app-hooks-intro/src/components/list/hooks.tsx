// Custom hook.
import React, { Dispatch, SetStateAction } from "react"
import { _let } from "r3bl-ts-utils"

/**
 * Due to the limitation on how localStorage fires change events when localStorage is changed by
 * JS code in the same document, a custom event must be fired in order to notify any JS code running
 * in *this* document that something in localStorage has changed.
 *
 * Note that this only works if the localStorage is changed in another document (not the one w/
 * the current React app): https://stackoverflow.com/a/59433963/2085356
 * - More info on local storage: https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent
 *
 * Do not use arrow functions here, since they will bind `this` to undefined!
 * - More info: https://stackoverflow.com/a/40498293/2085356
 */
class LocalStorageEvents {
  constructor(readonly name: "storage") {}

  /**
   * Do not call `localStorage.setItem()` directly. This method also fires a local event that
   * is needed to detect changes to localStorage in *this* document.
   */
  setValue(key: string, value: string) {
    localStorage.setItem(key, value)
    this.fireEvent()
  }
  private fireEvent() {
    _let(new Event(this.name), (it) => document.dispatchEvent(it))
  }

  /**
   * When changes are made to localStorage in *this* document, this listener will call the
   * setter for the state variable.
   */
  listenToLocalStorageChangesInThisDocument(
    key: string,
    setterDispatchFn: Dispatch<SetStateAction<string>>
  ): () => void {
    function listener() {
      const newValue = localStorage.getItem(key) || ""
      setterDispatchFn(newValue)
      console.log(`💾 window.storage ${key}'s value changed to '${newValue}'`)
    }
    document.addEventListener(this.name, listener)
    return listener
  }
}
export const MyLocalStorageEvents = {
  storage: new LocalStorageEvents("storage"),
} as const

export type LocalStorageHook = [string, Dispatch<SetStateAction<string>>]
/**
 * localStorage changes can be initiated in 3 ways:
 * 1. from this hook (calls to the setter / dispatcher returned by this hook).
 * 2. from calls to MyLocalStorageEvents.storage.setValue().
 * 3. from other document(s) (running the same app in other tabs in the same browser instance)
 *    changing the key value pairs in localStorage.
 */
export const useLocalStorage = (key: string, initialState: string): LocalStorageHook => {
  let currentValue = localStorage.getItem(key)
  const [value, setValue]: LocalStorageHook = React.useState(currentValue || initialState)

  // 1. For changes initiated by this hook, whenever key or value change, save kvp to localStorage.
  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [key, value])

  // 2. Respond to localStorage changes (not made via the effect above) which are initiated via
  // LocalStorageEvents.setValue() and they occur in *this* document.
  React.useEffect(
    () => {
      const listener = MyLocalStorageEvents.storage.listenToLocalStorageChangesInThisDocument(
        key,
        setValue
      )
      return () => {
        listener()
        console.log(`💾 removing listener to '${MyLocalStorageEvents.storage.name}' event`)
      }
    },
    [] /* equivalent to documentDidMount() */
  )

  // 3. Respond to localStorage changes made in another document.
  // You can trigger this by doing the following in a Chrome tab running this app:
  // 1. Go to Chrome Dev Tools -> Application -> Storage -> Local Storage.
  // 2. Then find the "search" key and change its value to any string.
  React.useEffect(
    () => {
      const localStorageChangesMadeInAnotherDocumentListener = (event: StorageEvent) => {
        console.log(`💾 window.storage changed:`, event)
        if (event.key === key) {
          const newValue = event?.newValue ?? ""
          setValue(newValue)
          console.log(`💾 window.storage ${key}'s value changed to '${newValue}'`)
        }
      }

      window.addEventListener("storage", localStorageChangesMadeInAnotherDocumentListener)
      console.log("💾 attaching window.storage event listener")

      return () => {
        window.removeEventListener("storage", localStorageChangesMadeInAnotherDocumentListener)
        console.log("💾 removing window.storage event listener")
      }
    },
    [] /* equivalent to documentDidMount() */
  )

  return [value, setValue]
}
