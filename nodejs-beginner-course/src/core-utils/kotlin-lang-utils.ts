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

export type Receiver<T> = (it: T) => void
export type ReceiverWithReturn<T, R> = (it: T) => R

/**
 * @param contextObject value of `it`
 * @param block lambda that accepts `it`
 * @return contextObject return the contextObject that is passed
 */
export const _also = <T>(contextObject: T, block: Receiver<T>): T => {
  block(contextObject)
  return contextObject
}

/**
 * @param contextObject value of `it`
 * @param block lambda that accepts `it`
 * @return contextObject return the result of the block (lambda)
 */
export const _let = <T, R>(contextObject: T, block: ReceiverWithReturn<T, R>): R => {
  return block(contextObject)
}

interface ImplicitReceiver<T> {
  blockWithReboundThis: (this: T) => void
}

interface ImplicitReceiverWithReturn<T, R> {
  blockWithReboundThis: (this: T) => R
}

/**
 * @param contextObject value of `this`
 * @param lambda lambda that accepts `this`
 * @return contextObject return the contextObject that is passed
 */
export function _apply<T>(contextObject: T, lambda: ImplicitReceiver<T>): T {
  lambda.blockWithReboundThis.bind(contextObject).call(contextObject)
  return contextObject
}

/**
 * @param contextObject value of `this`
 * @param lambda lambda that accepts `this`
 * @return contextObject return the result of the lambda
 */
export function _with<T, R>(contextObject: T, lambda: ImplicitReceiverWithReturn<T, R>): R {
  return lambda.blockWithReboundThis.bind(contextObject).call(contextObject)
}
