import _ = require("lodash")

export class State {
  constructor(readonly name: string = "default", readonly todoItems: Array<Todo> = []) {}

  toString() {
    return JSON.stringify(this.todoItems, null, 2)
  }

  /**
   * Note that changing this to an arrow function breaks it! By making `this`, point to the wrong
   * object!
   *
   * @param id
   * @param text
   */
  addItem(id: number, text: string): State {
    const copyOfState: State = _.cloneDeep<State>(this)
    const newTodoItem: Todo = {
      id,
      text,
      done: false,
    }
    copyOfState.todoItems.push(newTodoItem)
    return copyOfState
  }
}

export interface Todo {
  readonly id: number
  readonly text: string
  readonly done: boolean
}

// const main = () => {
//   const myState: State = new State()
//   const myState_1: State = myState.addItem(1, "foo")
//   const myState_2: State = myState_1.addItem(2, "bar")
//   console.log(myState_2.toString())
// }
//
// main()
