import { State } from "./redux"

const test_addItem_creates_deepcopy_of_state = () => {
  const stateObject: State = new State("stateObject")
  const anotherStateObject: State = stateObject.addItem(1, "foo")
  const yetAnotherStateObject: State = anotherStateObject.addItem(2, "bar")

  console.assert(stateObject.todoItems.length === 0, "F2")
  console.assert(anotherStateObject.todoItems.length === 1, "F3")
  console.assert(yetAnotherStateObject.todoItems.length === 2, "F4")
}
test_addItem_creates_deepcopy_of_state()

// const test_addItem_does_not_modify_self = () => {
//   const myState = new State()
//   myState.addItem(1, "foo")
//   myState.addItem(2, "bar")
//   console.assert(myState.todoItems.length === 0, "F1")
// }
// test_addItem_does_not_modify_self()
