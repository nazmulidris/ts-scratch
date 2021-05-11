// noinspection JSVoidFunctionReturnValueUsed

import {
  _also,
  _let,
  ReceiverFn,
  ReceiverFnWithReturn,
  ImplicitReceiverObjectWithReturn,
  ImplicitReceiverObject,
  _apply, _with,
} from "../kotlin-lang-utils"

it("_also() takes a contextObject, passes it to the Receiver, and returns the contextObject", () => {
  const contextObject: string = "_also"

  // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
  const myReceiverFn: ReceiverFn<string> = (it) => {
    expect(it).toEqual(contextObject)
    return it
  }
  const spyObjectContainingFn = { myReceiverFn }
  spyOn(spyObjectContainingFn, "myReceiverFn").and.callThrough()

  const returnValue = _also(contextObject, spyObjectContainingFn.myReceiverFn)
  expect(returnValue).toEqual(contextObject)
  expect(spyObjectContainingFn.myReceiverFn).toHaveBeenCalled()
})

it("_let() takes a contextObject, passes it to the Receiver, and returns its return value", () => {
  const contextObject: string = "_let"
  const receiverFnReturnValue: Symbol = Symbol()

  // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
  const myReceiverFn: ReceiverFnWithReturn<string, Symbol> = (it) => {
    expect(it).toEqual(contextObject)
    return receiverFnReturnValue
  }
  const spyObjectContainingFn = { myReceiverFn }
  spyOn(spyObjectContainingFn, "myReceiverFn").and.callThrough()

  const returnValue = _let(contextObject, spyObjectContainingFn.myReceiverFn)
  expect(returnValue).toEqual(receiverFnReturnValue)
  expect(spyObjectContainingFn.myReceiverFn).toHaveBeenCalled()
})

it(
  "_apply() takes a contextObject, binds it to ImplicitReceiverObject's this, calls it, then" +
    " returns the contextObject",
  () => {
    const contextObject: string = "_apply"

    // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
    const myImplicitReceiverObject: ImplicitReceiverObject<string> = {
      fnWithReboundThis: function (): string {
        expect(this).toEqual(contextObject)
        return contextObject
      },
    }
    spyOn(myImplicitReceiverObject, "fnWithReboundThis").and.callThrough()

    const returnValue = _apply(contextObject, myImplicitReceiverObject)
    expect(returnValue).toEqual(contextObject)
    expect(myImplicitReceiverObject.fnWithReboundThis).toHaveBeenCalled()
  }
)

it(
  "_with() takes a contextObject, binds it to ImplicitReceiverObjectWithReturn's this, calls it," +
    " then returns the its return value",
  () => {
    const contextObject: string = "_with"
    const receiverReturnValue: Symbol = Symbol()

    // https://jasmine.github.io/2.1/introduction#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
    const myImplicitReceiverObject: ImplicitReceiverObjectWithReturn<string, Symbol> = {
      fnWithReboundThis: function (): Symbol {
        expect(this).toEqual(contextObject)
        return receiverReturnValue
      },
    }
    spyOn(myImplicitReceiverObject, "fnWithReboundThis").and.callThrough()

    const returnValue = _with(contextObject, myImplicitReceiverObject)
    expect(returnValue).toEqual(receiverReturnValue)
    expect(myImplicitReceiverObject.fnWithReboundThis).toHaveBeenCalled()
  }
)
