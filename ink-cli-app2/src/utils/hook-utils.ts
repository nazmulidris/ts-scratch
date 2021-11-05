import React, { Dispatch, SetStateAction } from "react"

// State helpers.

/**
 * Useful type function to describe array returned by `React.useState()`.
 */
export type StateHook<T> = [T, Dispatch<SetStateAction<T>>]

// React.useRef() helpers.

export type ReactRef<T> = React.MutableRefObject<T | undefined>
export type ReactRefReceiverFn<T> = (it: T) => void

/**
 * @param refObject its current property is value of `it`
 * @param receiverFn lambda that accepts `it`
 * @return refObject return the refObject that is passed
 */
export const _withRef = <T>(
  refObject: ReactRef<T>,
  receiverFn: ReactRefReceiverFn<T>
): ReactRef<T> => {
  if (refObject.current) receiverFn(refObject.current)
  return refObject
}

// Other React hook helpers.

/**
 * More info - https://stackoverflow.com/a/68602854/2085356.
 */
export function useForceUpdateFn(): () => void {
  const [value, setValue]: StateHook<boolean> = React.useState<boolean>(false)
  return () => setValue((value) => !value)
}
