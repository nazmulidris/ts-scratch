/*
 * These functions are inspired by Kotlin scoping functions (with, apply, let, run, etc).
 * https://kotlinlang.org/docs/scope-functions.html#function-selection
 *
 * Kotlin context and `this` rebinding.
 * https://developerlife.com/2020/04/05/kotlin-dsl-intro/#context-and-rebinding-this
 *
 * TypeScript and handling `this` explicitly
 * https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters
 * https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype
 *
 * JavaScript `bind` and `call`
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 *
 * TypeScript JSDocs.
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
 */

export type ReceiverFn<T> = (it: T) => void
export type ReceiverFnWithReturn<T, R> = (it: T) => R

/**
 * @param contextObject value of `it`
 * @param receiverFn lambda that accepts `it`
 * @return contextObject return the contextObject that is passed
 */
export const _also = <T>(contextObject: T, receiverFn: ReceiverFn<T>): T => {
  receiverFn(contextObject)
  return contextObject
}

/**
 * @param contextObject value of `it`
 * @param receiverFnWithReturn lambda that accepts `it`
 * @return contextObject return the result of the receiverFnWithReturn (lambda)
 */
export const _let = <T, R>(
  contextObject: T,
  receiverFnWithReturn: ReceiverFnWithReturn<T, R>
): R => {
  return receiverFnWithReturn(contextObject)
}

export interface ImplicitReceiverObject<T> {
  fnWithReboundThis: (this: T) => void
}

export interface ImplicitReceiverObjectWithReturn<T, R> {
  fnWithReboundThis: (this: T) => R
}

/**
 * @param contextObject value of `this` (in the `blockWithReboundThis` function)
 * @param objectContainingFnWithReboundThis object containing function `blockWithReboundThis`
 * which accepts contextObject (aka `this`)
 * @return contextObject return the contextObject that is passed
 */
export const _apply = <T>(
  contextObject: T,
  objectContainingFnWithReboundThis: ImplicitReceiverObject<T>
): T => {
  objectContainingFnWithReboundThis.fnWithReboundThis.bind(contextObject).call(contextObject)
  return contextObject
}

/**
 * @param contextObject value of `this` (in the `blockWithReboundThis` function)
 * @param objectContainingFnWithReboundThis object containing function `blockWithReboundThis`
 * which accepts contextObject (aka `this`)
 * @return contextObject return the result of the `blockWithReboundThis` function
 */
export const _with = <T, R>(
  contextObject: T,
  objectContainingFnWithReboundThis: ImplicitReceiverObjectWithReturn<T, R>
): R => objectContainingFnWithReboundThis.fnWithReboundThis.bind(contextObject).call(contextObject)
