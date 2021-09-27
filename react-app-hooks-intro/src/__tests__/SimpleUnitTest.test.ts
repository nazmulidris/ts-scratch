import { _also } from "r3bl-ts-utils"

class MyMatcher {
  constructor(private _arg: boolean = false) {}

  set arg(value: boolean) {
    this._arg = value
  }
  get arg(): boolean {
    return this._arg
  }

  isFalse = (): boolean => !this.arg

  isTrue = (): boolean => this.arg

  get not(): MyMatcher {
    return new MyMatcher(!this.arg)
  }
}

describe("MyMatcher -> myMatcher(arg)", () => {
  const myMatcher: MyMatcher =
    /* new MyMatcher(true) */
    _also(new MyMatcher(), (it) => (it.arg = true))
  test("myMatcher.isTrue() is true", () => expect(myMatcher.isTrue()).toBe(true))
  test("myMatcher.isFalse() is false", () => expect(myMatcher.isFalse()).toBe(false))
  test("myMatcher.not.isTrue() is false", () => expect(myMatcher.not.isTrue()).toBe(false))
})
