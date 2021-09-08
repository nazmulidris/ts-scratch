## Sample CRA app using TypeScript

Here are some tips and tricks used in this project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [CSS Reset](#css-reset)
- [Upgrade CRA itself to the latest version](#upgrade-cra-itself-to-the-latest-version)
- [Using CRA and environment variables](#using-cra-and-environment-variables)
- [Using CSS class pseudo selectors to style child elements of a parent](#using-css-class-pseudo-selectors-to-style-child-elements-of-a-parent)
- [Callable](#callable)
- [Composition over inheritance](#composition-over-inheritance)
- [Debugging in Webstorm or IDEA Ultimate](#debugging-in-webstorm-or-idea-ultimate)
- [TypeScript readonly vs ReadonlyArray](#typescript-readonly-vs-readonlyarray)
- [TypeScript prop and state types](#typescript-prop-and-state-types)
- [TypeScript and ReactNode, ReactElement, and JSX.Element](#typescript-and-reactnode-reactelement-and-jsxelement)
- [TypeScript types in array and object destructuring](#typescript-types-in-array-and-object-destructuring)
- [React Hooks](#react-hooks)
  - [Why?](#why)
  - [Limitations when using hooks (must follow these rules)](#limitations-when-using-hooks-must-follow-these-rules)
  - [Example w/ explanation of React memory model](#example-w-explanation-of-react-memory-model)
  - [useEffect](#useeffect)
  - [useState](#usestate)
    - [Shared stateful logic vs shared state](#shared-stateful-logic-vs-shared-state)
    - [Resources](#resources)
    - [Example](#example)
  - [useReducer](#usereducer)
    - [Examples](#examples)
  - [useCallback and useMemo](#usecallback-and-usememo)
  - [How to write complex functional components](#how-to-write-complex-functional-components)
  - [Custom hook examples](#custom-hook-examples)
  - [References](#references)
- [Keyboard focus and React](#keyboard-focus-and-react)
  - [Learning materials](#learning-materials)
  - [Declarative](#declarative)
  - [Imperative using useRef](#imperative-using-useref)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### CSS Reset

Works

- Use CSS Reset by:
  1. Copy the contents of this [CSS file](https://meyerweb.com/eric/tools/css/reset/reset.css) into
     [`reset.css`](src/styles/reset.css). Feel free to modify this file to suit your needs. Then
     either:
     - Import it into [`App.tsx`](src/App.tsx)
     - Import it into [`App.css`](src/styles/App.css)
  2. I add entries for elements like `button` and `input` which are not explicitly set by the
     default Reset CSS stylesheet (and thus end up using user agent stylesheet).

Does not work

- `normalize.css` **DOES NOT WORK** (its supposed to be built into CRA):
- Using `normalize.css` is pretty straight forwards following this
  [guide](https://www.albertgao.xyz/2018/11/11/8-features-you-can-add-after-using-create-react-app-without-ejecting/).
  1. Simply run `npm install normalize.css`
  2. Then add `import 'normalize.css'` line to the top of [`index.tsx`](src/index.tsx)
- Supposedly, CRA comes w/ [`normalize.css`
- ](https://create-react-app.dev/docs/adding-css-reset/).
- Using these instructions, the `browser user agent stylesheet` was just messing up all the spacing.

### Upgrade CRA itself to the latest version

Follow instructions in the
[CRA changelog](https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md). For example,
you can run something like the following w/out ejecting CRA itself.

```shell
npm install --save --save-exact react-scripts@4.0.3
```

You can upgrade any npm packages using the following.

```shell
npm update
```

### Using CRA and environment variables

Read all about how to do this in this
[guide](https://create-react-app.dev/docs/adding-custom-environment-variables/).

For example, to use the [Cat API](https://docs.thecatapi.com/), you have to do the following steps:

1. Get an API key from [https://thecatapi.com/](https://thecatapi.com/).
2. Save this API key as `REACT_APP_CAT_API_KEY` in `$HOME/.profile` (for Ubuntu & GNOME).
   - You have to logout and log back in, in order for this to take effect on GUI apps launched via
     GNOME.
   - CRA will grab all the environment variables that are prefixed w/ `REACT_APP` and compile them
     into the minified Javascript code that it generates.
3. In your Typescript code, you can use the following variable `process.env.REACT_APP_CAT_API_KEY`
   in order to access the value of this environment variable.

### Using CSS class pseudo selectors to style child elements of a parent

Using CSS class pseudo selectors in order to style child elements of a parent (which has this style
applied) w/out having to manually assign classes to each of these children. Let's say that the
parent has this class [`DottedBox`](src/styles/App.css), which will do this, here's the CSS. Here's
a [video](https://youtu.be/9e-lWQdO-DA) by Kevin Powell where he uses this pattern for flexbox.

1. `.DottedBox { padding: 8pt; border: 4pt dotted cornflowerblue; }`
2. `.DottedBox > * { /* this gets applied to all the children */ }`

### Callable

`Callable` interfaces are great, and I've done an implementation of this in
[`ColorConsole`](https://github.com/r3bl-org/r3bl-ts-utils/blob/main/src/color-console-utils.ts)
included in [`r3bl-ts-utils`](https://www.npmjs.com/package/r3bl-ts-utils).

- I took a slightly different approach this time, using the great information in this
  [SO Answer](https://stackoverflow.com/questions/12769636/how-to-make-a-class-implement-a-call-signature-in-typescript)
  which I also used in the `ColorConsole` implementation.
- Here are the key takeaways in the
  [`ReactReplayClassComponent`](src/components/animate/ReactReplayClassComponent.tsx)
  implementation:
  1. A class can't implement the `Callable` interface.
  2. However, any member of the class can, and that member can be exposed as `Callable`.
  3. This member is exposed as a getter.
  4. This member can then be the only export in the module.
- In this case, the getter simply returns the reference to the 'generatorImpl' method. So we can
  write things like `GenerateReactElement.generator(...)` instead of just
  `GenerateReactElement.generator` (which is the normal use of a getter).

### Composition over inheritance

Use [composition over inheritance](https://reactjs.org/docs/composition-vs-inheritance.html) to make
components reusable.

1. This happens when you think about a component as a "generic box" and simply pass other JSX
   elements inside of them as `props.children`.
2. You can see this in [`ComponentWithoutState`](src/components/basics/ComponentWithoutState.tsx).
3. In order to get this to work with TypeScript you have to make sure to add this to the props type
   `childComp?: React.ReactNode`. For example, take a look at `MessagePropsWithChildren` in
   [`types.tsx`](src/components/types.tsx)

### Debugging in Webstorm or IDEA Ultimate

Use this [guide](https://blog.jetbrains.com/webstorm/2017/01/debugging-react-apps/) for
`create-react-app`.

1. Simply `package.json` and click on the green arrow beside the "run" script.
2. In the tool window, press "Ctrl+Shift" and click on the `localhost:3000` hyperlink and that will
   spawn a debugging session w/ a Chrome browser that is spawned just for this session!
3. Save the run configurations produced by the steps above in the project file.
4. Also now that the JavaScript debugging session run configuration is created, you can just use
   `npm run start` to start the server in a terminal and still be able to debug it!

### TypeScript readonly vs ReadonlyArray

More info on `readonly` vs `ReadonlyArray`:

- [Read-Only Array and Tuple Types in TypeScript](https://mariusschulz.com/blog/read-only-array-and-tuple-types-in-typescript)
- [Readonly vs ReadonlyArray](https://basarat.gitbook.io/typescript/type-system/readonly)

> Here's more info on TypeScript type narrowing, truthy/falsy, user defined type predicates, and
> discriminated unions from the
> [official docs](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

If you mark an variable holding an array as `readonly`, you can't reassign it. However, you can
`push()`, `pop()`, and mutate it! In the example below, `values` supports mutation!

```typescript
class ContainsArray {
  constructor(readonly values: string[]) {}
}

const object = new ContainsArray(["a", "b"])
object.values.push("d") // This is ok! 👎
```

So, in order to lock down that array, you can do the following. Note the subtle difference in the
keyword `readonly` showing up twice!

```typescript
class ContainsArray {
  constructor(readonly values: readonly string[]) {}
}

const object = new ContainsArray(["a", "b"])
object.values.push("d") // This is NOT ok! 👍
```

Another way to write the same thing is as follows.

```typescript
class ContainsArray {
  constructor(readonly values: ReadonlyArray<string>) {}
}

const object = new ContainsArray(["a", "b"])
object.values.push("d") // This is ok!
```

In the code for [`ReactReplayClassComponent`](src/components/animate/ReactReplayClassComponent.tsx),
the following lines do the same thing (preventing any mutations on `elementArray`):

- `readonly elementArray: readonly JSX.Element[]`
- `readonly elementArray: ReadonlyArray<JSX.Element>`

### TypeScript prop and state types

In strict mode, the prop and state types (if any) need to be declared explicitly. The React codebase
supports generics which is how these types are declared.

> You can also pass `{}` to specify that there are no props or state.

Here is a [tutorial](https://fettblog.eu/typescript-react/components/#class-components) that shows
how to specify prop and state types for function and class components.

Here's an example for a class component which takes props but contains no state. Note that no
children can be passed.

```typescript
export interface AnimationFramesProps {
  animationFrames: Readonly<ReactElement>
}

export class ReactReplayClassComponent extends React.Component<AnimationFramesProps, {}> {
  /* snip */
}
```

If you wanted children to be passed, you could do something like this.

```typescript
export interface AnimationFramesPropsWithKids extends AnimationFramesProps {
  /** More info: https://linguinecode.com/post/pass-react-component-as-prop-with-typescript */
  children?: Readonly<ReactElement>
}

export class ReactReplayClassComponent extends React.Component<AnimationFramesPropsWithKids, {}> {
  /* snip */
}
```

Here's an example for a functional component. Note the use of `FC` to specify that this is a
functional component that takes a prop. Being a functional component, you can't declare any state
types.

```typescript
export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): ReactElement => {
  /* snip */
}
```

### TypeScript and ReactNode, ReactElement, and JSX.Element

This [SO thread](https://stackoverflow.com/a/58123882/2085356) has the answers. Basically,

1. Use `ReactElement` where possible.
2. When TypeScript complains at times, use `ReactElement | null`.
3. Class components (return `ReactElement | null`) and functional components (return `ReactElement`)
   actually return different things.

### TypeScript types in array and object destructuring

More info:

- [Array and object destructuring in ES6](https://basarat.gitbook.io/typescript/future-javascript/destructuring#array-destructuring)
- [Typing destructured objects in TypeScript](https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript#typing-immediately-destructured-parameters)
- [Typing destructed arrays in TypeScript](https://www.carlrippon.com/strongly-typed-destructuring-and-rest-parameters/)

Example of object destructuring.

```typescript
type AnimationFrames = Readonly<Array<ReactElement>>
type MyProps = { animationFrames: AnimationFrames }
const { animationFrames }: MyProps = props
```

Example of array destructuring.

```typescript
type FrameIndexStateType = [number, Dispatch<SetStateAction<number>>]
const [frameIndex, setFrameIndex]: FrameIndexStateType = useState<number>(0)
```

### React Hooks

React hooks exist because there were severe limitations in versions before React 16 on what
functional components could do. And there were some problems w/ how class components function. By
adding hooks to functional components, it basically eliminates these 2 groups of problems.

#### Why?

Here are the details on the problems w/ class components mentioned above. It is difficult to reuse
stateful logic between components, which results in people doing things like:

- [render props](https://reactjs.org/docs/render-props.html): Passing functions down the component
  hierarchy as via props is cumbersome. However, there are situations where this can't be avoided.
- [higher-order components](https://reactjs.org/docs/higher-order-components.html): State can be
  stored at the top most component in the hierarchy in order to be shared between children
  components, which makes it necessary to add "artificial" components at the top most level (to have
  a shared scope in the children) just to wrap everything else underneath it, which is not optimal.

With hooks, it is now possible to reuse stateful logic between functional components! Thru the use
of `useState` hook and others, you can create your own more complex hooks. The official docs have
[Hooks at a Glance](https://reactjs.org/docs/hooks-overview.html) which is a great overview of hooks
along w/ an example of how you can make your own.

#### Limitations when using hooks (must follow these rules)

Read this [deep dive](https://reactjs.org/docs/hooks-rules.html#explanation) on how hooks are
implemented and follow these [rules](https://reactjs.org/docs/hooks-rules.html). Hooks in functional
components get turned into objects that are stored in a linked list inside of a
[fiber](https://github.com/acdlite/react-fiber-architecture) (which is an object representation of
the DOM that each React component has).

> More info on
> [fibers](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react/).

1. By following these rules:
   1. You ensure that Hooks are called in the same order each time a component renders.
   2. You ensure that all stateful logic in a component is clearly visible from its source code.
2. Hooks should not be called in loops, nested functions or conditions. Instead, always use Hooks at
   the top level of your React function, before any early returns.
3. Don’t call Hooks from regular JavaScript functions.
   1. React function components can call Hooks.
   2. Custom Hooks can call other Hooks.
4. If we want to run an effect conditionally, we can put that condition _inside_ our Hook. Eg:
   ```jsx
   useEffect(() => (name !== "" ? null : localStorage.setItem("name_field", name)))
   ```

#### Example w/ explanation of React memory model

Here's an example from the docs.

```javascript
import React, { useState, useEffect } from "react"

/** Custom hook. */
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null)

  function handleStatusChange(status) {
    setIsOnline(status.isOnline)
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange)
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange)
    }
  })

  return isOnline // This comes from `useState()`.
}

// FC.
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id)

  if (isOnline === null) {
    return "Loading..."
  }
  return isOnline ? "Online" : "Offline"
}

// FC.
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id)

  return <li style={{ color: isOnline ? "green" : "black" }}>{props.friend.name}</li>
}
```

Here are some notes on the code to understand what is happening here and how to think about state in
a functional component, and how that maps to React's memory model.

1. With classes, it was easier to understand React's memory model, because a stateful class
   component has a constructor, which then allocates the state up front.
   `ReactDOM.render(virtualDom, actualDom)` actually takes the `JSX.Element` that this class
   component represents, and mounts and renders it. Then there are subsequent re-renders which is
   where state actually comes into play. In hooks, this part is a little bit confusing, since there
   is no constructor. Here's one way to think about it.

1. The first time the functional component is rendered (after being mounted), React will allocate
   any state variables that are declared via calls to `useState()`. This is stored in memory by
   React and the initial value is the argument passed to `useState(initialValue)`.
1. This is also why React cares that these calls should not be wrapped in conditional logic or
   loops, because it relies on the lexical order in which these `useState()` calls are declared to
   do internal bookkeeping to figure out what the values of each stateful variable is (in its
   [internal memory model][h-1]).
1. When the setter returned by `useState<T>(initialValue:T)` which is of type
   `Dispatch<SetStateAction<T>>`, is called w/ a new value, it will trigger a re-render. A function
   can also be passed to `useState<T>(initialValue:(T)=>T)` which will compute the subsequent value
   based on the previous state's value. When a re-render is triggered then the new value of this
   state will be used to generate the UI.

1. Note that when stateful logic is reused, the state of each component is completely independent.
   Hooks are a way to reuse stateful logic, not state itself. In fact, each call to a Hook has a
   completely isolated state — so you can even use the same custom Hook twice in one component.

1. Custom Hooks are more of a convention than a feature. If a function’s name starts with ”use” and
   it calls other Hooks, we say it is a custom Hook. The "useSomething" naming convention is how the
   linter plugin is able to find bugs in the code using Hooks.

#### useEffect

This [hook](https://reactjs.org/docs/hooks-effect.html) is kind of `componentDidMount`,
`componentDidUpdate`, and `componentWillUnmount` combined!

It allows you to register a function that is called whenever anything is rendered to the DOM on the
page. And it can be scoped to an array of dependencies (which are state variables that can change in
order to trigger this effect to be run).

> 1. Read more about this in the
>    [official docs](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects).
> 2. This [SO thread](https://stackoverflow.com/a/53974039/2085356) also has some good insight on
>    how to use this hook.

Here is an example that mimics `componentDidMount`.

```typescript
export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): ReactElement => {
  /** State: animator (immutable). */
  const [animator] = useState<Animator>(
    new Animator(MyConstants.delayMs, tick, "[FunctionalComponentAnimator]")
  )

  useEffect(runAnimatorAtStart, [animator])

  /** Starts the animator. */
  function runAnimatorAtStart() {
    animator.start()

    // Cleanup.
    return () => {
      if (animator.isStarted) animator.stop()
    }
  }

  /* snip */
}
```

This `useEffect` hook is scoped to the `animator` variable, which is returned by `useState`.

> This is similar functionality to `componentDidMount`, unmount, update, etc. However, there are
> some big differences. For example to mimic the functionality of `componentDidMount` you have to
> pass a 2nd argument to `useEffect` which is either an empty array `[]` or some state variable that
> doesn't really change. To watch for changes in some specific variables, you can pass them in that
> array.
>
> Read more about the difference between passing an empty deps array and passing nothing on this
> [SO thread](https://stackoverflow.com/a/58579462/2085356).

If you want a hook to run on every single DOM render, then you can write something like this.

```typescript
import { ReactElement } from "react"

export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): ReactElement => {
  useEffect(runForEveryDomChange /* deps [] can be passed here */)

  function runForEveryDomChange() {
    /* code */
  }

  /* snip */
}
```

#### useState

Reusing _stateful logic_ isn't the same as _sharing state between functional components_. For the
latter, `useContext` might be more appropriate.

##### Shared stateful logic vs shared state

Here's a [SO question about this](https://stackoverflow.com/a/53455474/2085356) that goes into quite
a bit of detail about the differences between sharing state between components and stateful logic
that is shared. Here are some tips from this SO answer.

- Stateful logic is different from state. Stateful logic is stuff that you do that modifies state.
  For e.g., a component subscribing to a store in `componentDidMount()` and unsubscribing in
  `componentWillUnmount()`. This subscribing/unsubscribing behavior can be implemented in a hook and
  components which need this behavior can just use the hook.

- Here are some ways to share state between components (each w/ its pros and cons):

  > Note - Avoid the open source custom hook called
  > [`useBetween`](https://github.com/betula/use-between) since it is a useless hack.

  1. Lift state up to a common ancestor component of the two components. This is the same approach
     taken with class components, the only difference w/ hook is how we declare the state.

  ```typescript jsx
  const Parent: FC = () => {
    const [count, setCount] = useState(1)
    return (
      <>
        <ChildA count={count} onCountChange={setCount} />
        <ChildB count={count} onCountChange={setCount} />
      </>
    )
  }
  ```

  2. If the child components are deep in the hierarchy to be passed down at every level, then
     [`useContext`](https://reactjs.org/docs/context.html#when-to-use-context) hook might be the way
     to go.

  3. External state management libraries like Redux might be the way to go. Your state will then
     live in a store outside of React and components can subscribe to the store to receive updates.

##### Resources

Here are some great resources on learning about `useState`.

1. [Official docs](https://reactjs.org/docs/hooks-state.html)
2. [TypeScript and useState](https://www.carlrippon.com/typed-usestate-with-typescript/)

##### Example

The following code uses the `useState` hook in a functional component.

```typescript
import { ReactElement } from "react"

export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): ReactElement => {
  /** State: currentAnimationFrameIndex (mutable). */
  const [currentAnimationFrameIndex, setCurrentAnimationFrameIndex] = useState<number>(0)

  /** State: animator (immutable). */
  const [animator] = useState<Animator>(
    new Animator(MyConstants.delayMs, tick, "[FunctionalComponentAnimator]")
  )

  /* snip */
}
```

Here's the anatomy of each call to `useState`.

1. On the _left hand side_ of the call to `useState` hook, it returns an array.

1. The first item is a reference to the state variable.
1. The second item is the setter function for it. This mutates the state and triggers are render of
   the functional component.

1. It has to be initialized w/ whatever value is on the _right hand side_ expression. So it is a
   pretty simple way of making functional components have initial state.

#### useReducer

This hook is very similar to the `useState` hook. You can use both in a component as well. The main
difference between them is unlike `setState`, a reducer function must be provided that deals w/
generating a new state when employing `useReducer`.

This is very similar to Redux! And this might just be the simplest way to learn Redux patterns. It
is possible to replace code that employs `useState` w/ code that employs `useReducer`. Here's an
example.

Code that employs `useState` hook.

```typescript jsx
type StoriesStateHookType = [Story[], Dispatch<SetStateAction<Story[]>>]
export const ListOfStoriesComponent: FC<ListOfStoriesProps> = (props) => {
  // Store Story[] in the functional component's state.
  const [myStories, setMyStories]: StoriesStateHookType = React.useState<Story[]>([])

  // Simply call `setMyStories` to set a value to the functional component's state.
  React.useEffect(
    () => {
      getAsyncStoriesWithSimulatedNetworkLag().then((value) => {
        setMyStories(value)
      })
    },
    [] /* Only run this effect once; akin to componentDidMount. */
  )
}

// Function to remove a story by simply using `setMyStories`.
const handleRemoveItem = (id: number): void => {
  setMyStories(myStories.filter((it) => it.objectID !== id))
  console.log(`handleRemoveItem('${id}) called'`)
}
```

Equivalent code that employs `useReducer` hook.

```typescript jsx
export const ListOfStoriesComponent: FC<ListOfStoriesProps> = (props) => {
  // Create a reducer to manage Story[] in the state.
  const [myStories, dispatchMyStories]: ReducerHookType = React.useReducer<ReducerType>(
    storiesReducer,
    new Array<Story>()
  )

  // To make changes to the state managed by the reducer, you have to dispatch an action w/
  // a payload. In this example, we have 2 actions: "setState" and "removeItem".

  React.useEffect(
    () => {
      getAsyncStoriesWithSimulatedNetworkLag().then((value) => {
        dispatchMyStories({
          type: "setState",
          payload: value,
        })
      })
    },
    [] /* Only run this effect once; akin to componentDidMount. */
  )

  const handleRemoveItem: FnWithSingleArg<Story> = (objectToRemove: Story) => {
    console.log("handleRemoveItem called w/", objectToRemove)
    dispatchMyStories({
      type: "removeItem",
      payload: objectToRemove,
    })
  }
}

// This is the reducer function.

export type StateType = Story[]
export type Action = {
  type: "setState" | "removeItem"
  payload?: any
}
export type ReducerType = Reducer<StateType, Action>
export type ReducerHookType = [StateType, Dispatch<Action>]

export const storiesReducer = (currentState: StateType, action: Action): StateType => {
  console.log("storiesReducer -> \ncurrentState:", currentState, "\n-> action:", action)
  let newState: StateType
  switch (action.type) {
    case "removeItem":
      const itemToRemove = action?.payload as Story
      newState = currentState.filter((story) => story.objectID !== itemToRemove.objectID)
      break
    case "setState":
      newState = action.payload as Story[]
      break
    default:
      throw new Error(`Invalid action: ${action}`)
  }
  console.log("return newState", newState)
  return _.cloneDeep(newState)
}
```

##### Examples

1. For a simple example that doesn't use any network, and that is decomposed into many files, check
   out the [`ListOfStoriesComponent`](src/components/list/ListOfStoriesComponent.tsx) which utilizes
   both `useState` and `useReducer` hooks.
2. For an example that has network calls, and does everything in one file, check out the
   [`CatApiComponent`](src/components/cat_api/CatApiComponent.tsx) which only uses `useReducer` and
   no `useState`.

#### useCallback and useMemo

TODO

- https://reactjs.org/docs/hooks-reference.html#usememo
- https://reactjs.org/docs/hooks-reference.html#usecallback
- https://dmitripavlutin.com/dont-overuse-react-usecallback/

#### How to write complex functional components

If the FCs (`ItemComponent`, `ListComponent`, `SearchComponent` ) are defined inside the
[`ListOfStoriesComponent`](src/components/list/ListOfStoriesComponent.tsx) they behave differently
with keyboard focus, than if they are defined outside it!

1. If they are declared _outside_, the keyboard focus inside the `input` element is retained as you
   type different search terms.
2. If they are declared _inside_, the keyboard focus is lost every time you generate a single
   keyboard event.

> This might have something to do with [this](https://stackoverflow.com/a/56655447/2085356),
> functional components being stateless. If things are declared inside of a function, then they will
> be recreated everytime that function is run, vs if they are declared outside, then they won't be
> recreated on every (render) call.

#### Custom hook examples

- [`useLocalStorage`](src/components/list/hooks.tsx)
  - `useLocalStorage` shows how to use `localStorage` to back a state variable.
  - `LocalStorageEvents` shows how to deal w/ `localStorage` limitations when setting the value in
    the same `document`. `localStorage` changes can be initiated in 3 ways:
    1.  from this hook (calls to the setter / dispatcher returned by this hook).
    2.  from calls to MyLocalStorageEvents.storage.setValue().
    3.  from other document(s) (running the same app in other tabs in the same browser instance)
        changing the key value pairs in localStorage.
- [`useAnimator`](src/components/animate/hooks.tsx)
  - [`ReactReplayFunctionComponent`](src/components/animate/ReactReplayFunctionComponent.tsx) uses
    this hook in order to show frames in a pre-rendered array of frames (`ReactElement[]`).

#### References

To learn about hooks, here are some important resources.

- [Great video introducing hooks][h-2]
- [Best practices on using React functional components][h-5]
- [Official docs on writing custom hooks][h-4]
- [Official Hooks API Reference for useState][h-3]
- [Deep dive into useState hook and React memory model][h-1]

[h-1]: https://www.newline.co/@CarlMungazi/a-journey-through-the-usestate-hook--a4983397
[h-2]: https://youtu.be/dpw9EHDh2bM
[h-3]: https://reactjs.org/docs/hooks-reference.html#usestate
[h-4]: https://reactjs.org/docs/hooks-custom.html
[h-5]: https://www.infoworld.com/article/3603276/how-to-use-react-functional-components.html

### Keyboard focus and React

#### Learning materials

- [educative.io course - Section on keyboard focus and React][kfr-1]

[kfr-1]:
  https://www.educative.io/module/page/wjB3xQCPvQgwjg7Vo/10370001/5432216462557184/6004445155950592

#### Declarative

Here's a way to get keyboard focus into a single element declaratively. The `autoFocus` attribute on
the `input` element is set to a boolean value that is passed as a props.

```typescript jsx
type SearchProps = { searchTerm: string; onSearchFn: OnSearchFn; initialKeybFocus: boolean }

const ListOfStoriesComponent: FC = () => {
  /** snip */
  return (
    <div className={"Container"}>
      <strong>My Searchable Stories</strong>
      <SearchComponent searchTerm={searchTerm} onSearchFn={onSearchFn} initialKeybFocus={true}>
        <strong>Search: </strong>
      </SearchComponent>
      <ListComponent list={filteredStories} />
    </div>
  )
}

const SearchComponent: FC<SearchProps> = (props) => {
  const { searchTerm, onSearchFn, children, initialKeybFocus } = props
  return (
    <section>
      <label htmlFor="search">{children}</label>
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={onSearchFn}
        autoFocus={initialKeybFocus}
      />
    </section>
  )
}
```

#### Imperative using useRef

Here's another way to do the same thing imperatively (programmatically) using `useRef()` and
`useEffect()`.

> Using ref (DOM element of a React element) and hooks:
>
> 1. In order to use a ref, you must first create it using the `useRef()` hook, and then pass it to
>    use the `ref` attribute in a React component.
> 2. When this component is rendered to DOM, it will "set" the `current` property of this ref (which
>    is the DOM element corresponding to this React component). This is used later in the
>    `useEffect()` hook to actually call `focus()` on the DOM element.

```typescript jsx
const SearchComponent: FC<SearchProps> = (props) => {
  const { takeInitialKeyboardFocus, searchTerm, onSearchFn, children } = props

  // useEffect hook for initial keyboard focus on input element.
  const inputRef: React.MutableRefObject<any> = React.useRef()
  React.useEffect(() => {
    if (inputRef.current && takeInitialKeyboardFocus) {
      inputRef.current.focus()
    }
  })

  // Run this effect to log inputRef.
  const [showUi, setShowUi] = React.useState(true)
  function onButtonClicked() {
    setShowUi((prevState) => !prevState)
    console.log("showUi", showUi)
  }
  const logInputRef = (msg: string) => {
    console.log(msg, inputRef.current ? "has DOM element" : "🧨 does not have DOM element")
  }
  React.useEffect(() => {
    logInputRef("🎹 inputRef")
    return () => {
      logInputRef("🎹❌ Do something here to unregister the DOM element, inputRef")
    }
  })

  return (
    <section>
      {showUi && (
        <>
          <label htmlFor="search">{children}</label>
          <input id="search" type="text" value={searchTerm} onChange={onSearchFn} ref={inputRef} />
        </>
      )}
      <button onClick={onButtonClicked}>mount/unmount</button>
    </section>
  )
}
```
