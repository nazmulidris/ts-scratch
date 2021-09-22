# React hooks and TypeScript handbook

```yaml
---
author: Nazmul Idris
date: 2021-09-30 14:00:00+00:00
excerpt: |
  This handbook will use TypeScript to take you thru using functional components in React. IDEA
  Ultimate / Webstorm project files are provided. This handbook is written as a reference. You
  can easily jump to the section that is relevant to you or read them in any order that you like.
layout: post
title: "React hooks (v17.0.3) and TypeScript (v4.3.4) handbook"
categories:
  - TypeScript
  - React
  - Web
---
<img class="post-hero-image" src="{{ 'assets/react-hooks-ts-handbook.svg' | relative_url }}"/>
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
- [CSS Reset](#css-reset)
  - [What works](#what-works)
  - [What does not work](#what-does-not-work)
- [Upgrade CRA itself to the latest version](#upgrade-cra-itself-to-the-latest-version)
- [Test app live data APIs](#test-app-live-data-apis)
- [Using CRA and environment variables](#using-cra-and-environment-variables)
- [Using CSS class pseudo selectors to style child elements of a parent](#using-css-class-pseudo-selectors-to-style-child-elements-of-a-parent)
- [Callable](#callable)
- [Composition over inheritance](#composition-over-inheritance)
- [Debugging in Webstorm or IDEA Ultimate](#debugging-in-webstorm-or-idea-ultimate)
- [TypeScript readonly vs ReadonlyArray](#typescript-readonly-vs-readonlyarray)
- [TypeScript prop and state types](#typescript-prop-and-state-types)
- [TypeScript and ReactNode, ReactElement, and JSX.Element](#typescript-and-reactnode-reactelement-and-jsxelement)
- [TypeScript types in array and object destructuring](#typescript-types-in-array-and-object-destructuring)
- [React](#react)
- [React Hooks](#react-hooks)
  - [Why?](#why)
  - [Limitations when using hooks (must follow these rules)](#limitations-when-using-hooks-must-follow-these-rules)
  - [Example w/ explanation of React memory model](#example-w-explanation-of-react-memory-model)
  - [useEffect](#useeffect)
    - [First render and subsequent re-renders using useRef and useEffect](#first-render-and-subsequent-re-renders-using-useref-and-useeffect)
  - [useState](#usestate)
    - [Shared stateful logic vs shared state](#shared-stateful-logic-vs-shared-state)
    - [Resources](#resources)
    - [Example](#example)
  - [useReducer](#usereducer)
    - [Two examples (one w/out network, and one w/ network)](#two-examples-one-wout-network-and-one-w-network)
  - [useCallback and useMemo](#usecallback-and-usememo)
  - [How to write complex functional components](#how-to-write-complex-functional-components)
  - [Custom hook examples](#custom-hook-examples)
  - [References about hooks](#references-about-hooks)
- [Keyboard focus and React](#keyboard-focus-and-react)
  - [Learning materials](#learning-materials)
  - [Declarative](#declarative)
  - [Imperative using useRef](#imperative-using-useref)
- [React and CSS](#react-and-css)
  - [Styled component example - Tooltip](#styled-component-example---tooltip)
  - [CSS Modules example](#css-modules-example)
- [React and SVG](#react-and-svg)
  - [References on SVG and React](#references-on-svg-and-react)
- [Redux](#redux)
  - [Simple example (no async, thunks, or splitting reducers)](#simple-example-no-async-thunks-or-splitting-reducers)
  - [🔥 TODO Advanced example (using async, thunks, splitting reducers, and complex selectors)](#-todo-advanced-example-using-async-thunks-splitting-reducers-and-complex-selectors)
- [🔥 TODO Testing](#-todo-testing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This handbook and its accompanying Typescript [code][gh-repo] is a reference guide on how to use
React Hooks with Typescript.

1. This is not a React primer, and is primarily aimed at developers who know React class components
   and want to learn to use Hooks to create functional components using Typescript.
2. You can jump directly to any topic that you are curious about in this handbook, you don't have to
   read it from start to finish.

> 1. The source code project accompanying this handbook created using `create-react-app` or CRA.
> 2. The source code for this handbook can be found in this [github repo][gh-repo].

[gh-repo]: https://github.com/nazmulidris/ts-scratch/tree/main/react-app-hooks-intro

## CSS Reset

### What works

- Use CSS Reset by:
  1. Copy the contents of this [CSS file](https://meyerweb.com/eric/tools/css/reset/reset.css) into
     [`reset.css`](src/styles/reset.css). Feel free to modify this file to suit your needs. Then
     either:
     - Import it into [`App.tsx`](src/App.tsx)
     - Import it into [`App.css`](src/styles/App.css)
  2. I add entries for elements like `button` and `input` which are not explicitly set by the
     default Reset CSS stylesheet (and thus end up using user agent stylesheet).

### What does not work

- `normalize.css` **DOES NOT WORK** (its supposed to be built into CRA):
- Using `normalize.css` is pretty straight forwards following this
  [guide](https://www.albertgao.xyz/2018/11/11/8-features-you-can-add-after-using-create-react-app-without-ejecting/).
  1. Simply run `npm install normalize.css`
  2. Then add `import 'normalize.css'` line to the top of [`index.tsx`](src/index.tsx)
- Supposedly, CRA comes w/ [`normalize.css`](https://create-react-app.dev/docs/adding-css-reset/).
- Using these instructions, the `browser user agent stylesheet` was just messing up all the spacing.

## Upgrade CRA itself to the latest version

Follow instructions in the
[CRA changelog](https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md). For example,
you can run something like the following w/out ejecting CRA itself.

> You can find the list of releases [here](https://github.com/facebook/create-react-app/releases).

```shell
npm install --save --save-exact react-scripts@4.0.3
```

You can upgrade any npm packages using the following.

```shell
npm update
```

## Test app live data APIs

Here are some data APIs that might be useful when building prototype apps.

- [TheCatApi](https://docs.thecatapi.com/api-reference/)
- [doc.ceo/dog-api](https://dog.ceo/dog-api/documentation/)
- [Hacker News API](https://hn.algolia.com/api)

## Using CRA and environment variables

Read all about how to do this in this
[guide](https://create-react-app.dev/docs/adding-custom-environment-variables/).

For example, to use the [Cat API](https://docs.thecatapi.com/), you have to do the following steps:

1. Get an API key from [https://thecatapi.com/](https://thecatapi.com/).
2. Save this API key as `REACT_APP_CAT_API_KEY` in `$HOME/.profile` (for Ubuntu & GNOME).

- You have to logout and log back in, in order for this to take effect on GUI apps launched via
  GNOME.
- CRA will grab all the environment variables that are prefixed w/ `REACT_APP` and compile them into
  the minified Javascript code that it generates.

3. In your Typescript code, you can use the following variable `process.env.REACT_APP_CAT_API_KEY`
   in order to access the value of this environment variable.

## Using CSS class pseudo selectors to style child elements of a parent

Using CSS class pseudo selectors in order to style child elements of a parent (which has this style
applied) w/out having to manually assign classes to each of these children. Let's say that the
parent has this class [`DottedBox`](src/styles/App.css), which will do this, here's the CSS. Here's
a [video](https://youtu.be/9e-lWQdO-DA) by Kevin Powell where he uses this pattern for flexbox.

1. `.DottedBox { padding: 8pt; border: 4pt dotted cornflowerblue; }`
2. `.DottedBox > * { /* this gets applied to all the children */ }`

## Callable

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

## Composition over inheritance

Use [composition over inheritance](https://reactjs.org/docs/composition-vs-inheritance.html) to make
components reusable.

1. This happens when you think about a component as a "generic box" and simply pass other JSX
   elements inside of them as `props.children`.
2. You can see this in [`ComponentWithoutState`](src/components/basics/ComponentWithoutState.tsx).
3. In order to get this to work with TypeScript you have to make sure to add this to the props type
   `childComp?: React.ReactNode`. For example, take a look at `MessagePropsWithChildren` in
   [`types.tsx`](src/components/types.tsx)

## Debugging in Webstorm or IDEA Ultimate

Use this [guide](https://blog.jetbrains.com/webstorm/2017/01/debugging-react-apps/) for
`create-react-app`.

1. Simply `package.json` and click on the green arrow beside the "run" script.
2. In the tool window, press "Ctrl+Shift" and click on the `localhost:3000` hyperlink and that will
   spawn a debugging session w/ a Chrome browser that is spawned just for this session!
3. Save the run configurations produced by the steps above in the project file.
4. Also now that the JavaScript debugging session run configuration is created, you can just use
   `npm run start` to start the server in a terminal and still be able to debug it!

## TypeScript readonly vs ReadonlyArray

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

## TypeScript prop and state types

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

You can also wrap your prop type, eg: `MyPropType`, w/ `PropsWithChildren<MyPropType>` when
declaring your functional component to declare that your component can accept `children`. And then
you can use the destructuring syntax to get the required props out.

> Typescript supports built-in and user defined
> [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html) and
> [advanced types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)
> which are in leverage in `PropsWithChildren` type. It takes your prop type as an argument and
> returns a new type which includes everything in your type _and_ >
> `children?: ReactNode | undefined`.

Here's an example.

```typescript jsx
export type TooltipProps = {
  text: string
}

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ children, text }) => {
  /* snip */
}
```

> Note the use of the destructuring syntax to get the specific properties (`children`, `text`) out
> of the passed `props` object. The types are defined in `TooltipProps` (`text` comes from this) and
> `PropsWithChildren` (`children` comes from this).

Here's an example for a functional component. Note the use of `FC` to specify that this is a
functional component that takes a prop. Being a functional component, you can't declare any state
types.

```typescript
export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): ReactElement => {
  /* snip */
}
```

## TypeScript and ReactNode, ReactElement, and JSX.Element

This [SO thread](https://stackoverflow.com/a/58123882/2085356) has the answers. Basically,

1. Use `ReactElement` where possible.
2. When TypeScript complains at times, use `ReactElement | null`.
3. Class components (return `ReactElement | null`) and functional components (return `ReactElement`)
   actually return different things.

## TypeScript types in array and object destructuring

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

## React

To learn more about how React actually works and generates Virtual DOM objects which are then
rendered to the actual DOM, please refer to this great
[video on how to create a custom React renderer](https://youtu.be/CGpMlWVcHok). Here's the github
repo for the toy [React DOM Mini](https://github.com/sophiebits/react-dom-mini).

## React Hooks

React hooks exist because there were severe limitations in versions before React 16 on what
functional components could do. And there were some problems w/ how class components function. By
adding hooks to functional components, it basically eliminates these 2 groups of problems.

### Why?

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

### Limitations when using hooks (must follow these rules)

Read this [deep dive](https://reactjs.org/docs/hooks-rules.html#explanation) on how hooks are
implemented and follow these [rules](https://reactjs.org/docs/hooks-rules.html). Hooks in functional
components get turned into objects that are stored in a linked list inside of a
[fiber](https://github.com/acdlite/react-fiber-architecture) (which is an object representation of
the DOM that each React component has).

> More info on
> [React fibers](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react/).

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

### Example w/ explanation of React memory model

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

### useEffect

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

#### First render and subsequent re-renders using useRef and useEffect

Out of the box the callback that you pass to `useEffect()` can't tell the difference between first
render, and subsequent re-renders. This is where `useRef` can be very useful (we have seen it used
for keyboard focus in [this section](#imperative-using-useref).

You can set whatever value you want in the `current` property of the `ref` (which is returned by
`React.useRef(initialValue)`). This value will be stable when the component is re-rendered. This can
be a simple way of detecting when the first render occurs, and when subsequent re-renders occur.

> Note that storing a value in an object returned by `useRef` is different than simply using
> `setState` because React isn't watching for changes in the state in order to trigger a re-render.

Here's an example of a custom hook that allows you to use `localStorage` in order to get and set
key-value pairs.

```typescript jsx
export type MyLocalStorageHook = [string, Dispatch<SetStateAction<string>>]
const useMyLocalStorageHook = (key: string): MyLocalStorageHook => {
  const isMounted = React.useRef(false)

  const [value, setValue] = React.useState(localStorage.getItem(key) || "N/A")

  React.useEffect(() => {
    if (!isMounted.current) {
      console.log("First render")
      isMounted.current = true
      return
    }

    console.log("Subsequent re-render")
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}
```

> Note that the value of the object returned by `useRef` (the `current` property of `ref`) is only
> set in the `useEffect` callback. It isn't set in the code that is doing the rendering for example.

1. This hook can tell the difference between the first render and subsequent re-renders since it is
   using `useRef(boolean)` in order to set the `current` property to `true` on first render (and
   then doing an early return).
2. Subsequent re-renders will skip over this early return condition check and will actually the work
   it is intended to.
3. When the `setValue` dispatch is used to assign a new value to the key, then it will actually save
   the key-value pair to local storage.

> Note that `ref.current` can also be used as a place to store the results of an expensive
> computation that are local to a functional component, but isn't part of the state. This can be a
> cache that is local to the component. Perhaps this cache can be populated on first render and then
> re-used for subsequent renders.

### useState

Reusing _stateful logic_ isn't the same as _sharing state between functional components_. For the
latter, `useContext` might be more appropriate.

#### Shared stateful logic vs shared state

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

#### Resources

Here are some great resources on learning about `useState`.

1. [Official docs](https://reactjs.org/docs/hooks-state.html)
2. [TypeScript and useState](https://www.carlrippon.com/typed-usestate-with-typescript/)

#### Example

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

### useReducer

This hook is very similar to the `useState` hook. You can use both in a component as well. The main
difference between them is unlike `setState`, a reducer function must be provided that deals w/
generating a new state when employing `useReducer`.

> This is very similar to Redux! And this might just be the simplest way to learn Redux patterns.
> Jump to this [section](#redux) to learn all about how to use React and Redux (using the modern
> `redux-toolkit` and not old-school `redux-react`).

It is possible to replace code that employs `useState` w/ code that employs `useReducer`. Here's an
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
interface ActionSetState {
  type: "setState"
  payload: Story[]
}
interface ActionRemoveItem {
  type: "removeItem"
  payload: Story
}
export type ActionType = ActionSetState | ActionRemoveItem
export type ReducerType = Reducer<StateType, ActionType>
export type ReducerHookType = [StateType, Dispatch<ActionType>]

export const storiesReducer = (currentState: StateType, action: ActionType): StateType => {
  console.log("storiesReducer -> \ncurrentState:", currentState, "\n-> action:", action)
  let newState: StateType
  switch (action.type) {
    case "removeItem":
      const itemToRemove = action?.payload
      newState = currentState.filter((story) => story.objectID !== itemToRemove.objectID)
      break
    case "setState":
      newState = action.payload
      break
    default:
      throw new Error(`Invalid action: ${action}`)
  }
  console.log("return newState", newState)
  return _.cloneDeep(newState)
}
```

#### Two examples (one w/out network, and one w/ network)

1. For a simple example that doesn't use any network, and that is decomposed into many files, check
   out the [`ListOfStoriesComponent`](src/components/list/ListOfStoriesComponent.tsx) which utilizes
   both `useState` and `useReducer` hooks.
2. For an example that has network calls, and does everything in one file, check out the
   [`CatApiComponent`](src/components/cat_api/CatApiComponent.tsx) which only uses `useReducer` and
   no `useState`.

### useCallback and useMemo

These two hooks are very tricky, since they cache objects that are tightly bound to React's
lifecycle, and might have memory and CPU impacts that you're not able to predict using your
intuition. Most of the time, its best not to use them.

These articles go into great details about why they should not be used unless you have a very
specific use case that warrants their use as.

- [Article 1](https://kentcdodds.com/blog/usememo-and-usecallback)
- [Article 2](https://dmitripavlutin.com/dont-overuse-react-usecallback)

Reference docs

- [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)
- [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)

Here are some acceptable use cases where these can be used.

- When functions that are declared inside of a hook have some internal state, such as when the
  function is debounced or throttled.
- When the function object is a dependency on other hooks (eg: passing the function returned by
  `useCallback` to `useEffect`).
- When the functional component wrapped inside of `useMemo` accepts a function object prop.

### How to write complex functional components

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

### Custom hook examples

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

### References about hooks

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

## Keyboard focus and React

### Learning materials

- [educative.io course - Section on keyboard focus and React][kfr-1]

[kfr-1]:
  https://www.educative.io/module/page/wjB3xQCPvQgwjg7Vo/10370001/5432216462557184/6004445155950592

### Declarative

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

const SearchComponent: FC<SearchProps> = ({
  searchTerm,
  onSearchFn,
  children,
  initialKeybFocus,
}) => {
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

### Imperative using useRef

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
const SearchComponent: FC<SearchProps> = ({
  takeInitialKeyboardFocus,
  searchTerm,
  onSearchFn,
  children,
}) => {
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

> You can also utilize `useRef()` in order to detect the first render vs subsequent re-render by
> pairing it w/ `useEffect()` hook; more in [this section](#first-render-and-subsequent-re-renders).

## React and CSS

At a high level there are 2 strategies to consider when using CSS in React (which are both bundled
when you use `create-react-app` (CRA).

1. Styled components (CSS in JS) - This is where you simply use the `className` prop to specify
   which CSS rules to use.
2. CSS Modules (CSS in CSS) - This is where you leverage
   [CSS modules](https://css-tricks.com/css-modules-part-1-need/) which locally scope the styles to
   prevent collisions w/ synonymous styles declared in other files. Here are the main differences
   that you have to be aware of when compared to styled components:
   1. Instead of using `XXX.css`, make `XXX.module.css` files. This tells CRA to use CSS modules.
   2. Instead of importing the CSS file like you would for a styled component, do this instead
      `import styles from './XXX.module.css'`.
   3. Then use these styles in your JSX like this: `<Component className{styles.XYZ}/>`.

### Styled component example - Tooltip

Here is an example of implementing a tooltip that uses CSS but is packaged as a React component.
This example shows how these two technologies can work together, but also shows how React really
abstracts itself away pretty heavily from DOM and CSS (for better and worse).

Here's the React code - The `useState` hook is essentially used to apply a "hover" effect on any
React elements that are children of a `Tooltip` component.

```typescript jsx
export type TooltipProps = {
  tooltipText: string
}

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ children, tooltipText }) => {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const onMouseEnter = () => setShowTooltip(true)
  const onMouseLeave = () => setShowTooltip(false)

  return (
    <span onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={"tooltipContainer"}>
      <span className={showTooltip ? "tooltip visible" : "tooltip"}>{tooltipText}</span>
      {children}
    </span>
  )
}
```

Here's the CSS - An empty parent container (`span`) is created so that its position can be set to
`relative`, so that any child elements inside of it (other `span` elements) can be positioned as
`absolute` w/ a `z-index` of `1000`.

```css
.tooltipContainer {
  position: relative;
}

.tooltip {
  --radius: 5px;
  --alpha: 0.8;
  --fillColor: rgba(26, 31, 48, var(--alpha));
  --borderColor: rgba(100, 149, 237, var(--alpha));
}

.tooltip {
  display: none;
  position: absolute;
  z-index: 1000;

  padding: calc(var(--defaultPadding) * 0.5);
  background: var(--fillColor);
  border-radius: var(--radius);
  border: 2px solid var(--borderColor);

  /* This ensures that the tooltip does not obstruct the element that is being hovered */
  top: 100%;
  width: auto;
}

.tooltip.visible {
  display: block;
}
```

Here's more information on tooltips, CSS, and React.

- [CSS example](https://stackoverflow.com/a/18359711/2085356)
- [React example](https://www.30secondsofcode.org/react/s/tooltip)

Here's the code.

- Tooltip
  - [`Tooltip.tsx`](src/components/utils/Tooltip.tsx)
  - [`Tooltip.css`](src/components/utils/Tooltip.css)
- Used in [`ListOfStoriesComponent.tsx`](src/components/list/ListOfStoriesComponent.tsx)

### CSS Modules example

Here's a simple example that shows how to use CSS modules or CSS in CSS approach.

Here's a simple `App.module.css` file.

```css
.container {
  height: 100vw;
  padding: 20px;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
}
```

In your JSX component, you have to do the following import.

```typescript jsx
import React from "react"
import styles from "./App.module.css"
```

Then to use it in a component, you can do the following.

```typescript jsx
const App: FC = () => <div className={styles.container}>Content</div>
```

## React and SVG

It is very easy to use SVG w/ React. There are various ways of importing the SVG asset into a React
component itself:

1. You can import it from a file (static asset). The imported file is actually a React component
   itself. And you can style the SVG directly by passing `className` or inline styles to this
   component. Here's an example of importing the SVG file.

   ```typescript jsx
   import { ReactComponent as Car } from "./car.svg"
   export const SvgExample: FC = (props) => <Car className={"SvgImage"} />
   ```

   Here's an example of styling it in CSS.

   ```css
   .SvgImage {
     height: 100px;
     width: 100px;
   }

   .SvgImage:hover > g {
     stroke: yellow;
     stroke-width: 8px;
   }
   ```

2. You can declare it in JSX. Here's an example.

   ```typescript jsx
   const BasicSvg = () => (
     <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
       <circle cx="50" cy="50" r="40" stroke="blue" strokeWidth="4" fill="lightblue" />
     </svg>
   )
   ```

   You can then just use it as a React component.

   ```typescript jsx
   export const SvgExample: FC = (props) => <BasicSvg />
   ```

   Or you can use it inside an `img` tag like so.

   ```typescript jsx
   export const SvgExample: FC = (props) => <img src={logo} className="logo" alt="logo" />
   ```

3. You can load it as a string using the `data:image/svg+xml` pattern. Here's an example of defining
   the SVG in CSS.

   ```css
   .topography-pattern {
     background-color: #ffffff;
     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ... ");
   }
   ```

   And then using it in a React component.

   ```typescript jsx
   export const SvgExample: FC = (props) => <div className={"topography-pattern"}></div>
   ```

### References on SVG and React

- [CRA and SVG](https://create-react-app.dev/docs/adding-images-fonts-and-files/)
- [Using SVG as backgrounds in React](https://www.robinwieruch.de/react-svg-patterns)

## Redux

[Redux](https://redux.js.org/tutorials/fundamentals/part-1-overview) is a great way to share state
between components. The `redux-toolkit` uses the underlying `react-redux` module, but is easier to
use. Here's how you can install it in your project.

```shell
npm install @reduxjs/toolkit react-redux
```

> To understand Redux it is best to start w/ 'useReducer' hook as show in this
> [section](#usereducer). It is an easy way to understand the fundamentals of Redux which is
> actions, state, reducer functions, and immutable state.

### Simple example (no async, thunks, or splitting reducers)

> We will use a Typescript feature called
> [discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
> in order to make our actions typesafe.

Here are the steps to using Redux.

1. Define the types for the state, action, and use those to create a reducer function.

   > 1. Note that the type of the reducer function is `Reducer<State | undefined, Action>`. The
   >    `undefined` is to cover the initial state that is returned by this reducer.
   > 2. Also note that if you try and replace the `Reducer<State ... , Action>` w/ a type variable
   >    that holds the same thing, then it will not work for some reason w/ Typescript.

   ```tsx
   // Types.
   type State = {
     strings: Array<string>
   }
   interface ActionAdd {
     type: "add"
     text: string
   }
   interface ActionRemove {
     type: "remove"
     index: number
   }
   type Action = ActionAdd | ActionRemove

   // Reducer function.
   const reducerFn: Reducer<State | undefined, Action> = (state, action): State => {
     if (!state)
       return {
         strings: ["11222", "ddddd"],
       }

     switch (action.type) {
       case "add":
         return { strings: [...state.strings, action.text] }
       case "remove":
         // Get the index (the string we want to remove).
         const index = action.index
         // Make a copy of the old state.
         const copyOfState = [...state.strings]
         // Remove the element in position index and return the new state.
         copyOfState.splice(index, 1)
         return { strings: copyOfState }
     }
     return state
   }
   ```

2. Create a store that uses this reducer function.

   > If you split reducers, then this is where you would declare all the ones that comprise the root
   > reducer function.

   ```tsx
   // Redux store.
   export const store = configureStore({
     reducer: reducerFn,
   })
   ```

3. Wrap the component(s) that will share this state with `<Provider store={store}>...</Provider>`
   where `store` is what you created and exported in step 2.

   ```tsx
   <Provider store={store}>
     <SimpleReduxComponent />
   </Provider>
   ```

4. In your component, make sure to subscribe to the store, using the `useSelector()` hook.

   > - This is used instead of the old
   >   [`mapStateToProps` / 'connect'](https://react-redux.js.org/using-react-redux/connect-mapstate)
   >   mechanism.
   > - When the state changes in the store then, the new state will be passed to this component (by
   >   the hook), and it will be re-rendered.

   > This is somewhat equivalent to the `useReducer()` hook, in the sense that you will get the
   > state from this hook.

   > If you split reducers, then you can select just a subset of the state that you are interested
   > in (in the function that you pass to the `useSelector()` hook).

   ```tsx
   // Functional component.
   export const SimpleReduxComponent: FC = () => {
     const state: DefaultRootState = useSelector((state) => state)
     const myState = state as State
     /* snip */
   }
   ```

5. In your component make sure to call `store.dispatch({/* action */})` in order to request changes
   to happen to your store. This will trigger re-renders of the components that are subscribed to
   the store.

   ```tsx
   export const SimpleReduxComponent: FC = () => {
     /* snip */
     function addString() {
       store.dispatch({
         type: "add",
         payload: "NazmulMaretIdris".substring(Math.floor(Math.random() * 15)),
       })
     }

     function removeListItem(index: number) {
       store.dispatch({
         type: "remove",
         payload: index,
       })
     }

     function render() {
       return (
         <div className={"Container"}>
           <button onClick={addString}>Add</button>
           <ol>
             {myState.strings.map((string, index) => (
               <li onClick={() => removeListItem(index)}>{string}</li>
             ))}
           </ol>
         </div>
       )
     }

     return render()
   }
   ```

> Here's the full example in a single source file
> [`SimpleReduxComponent`](src/components/redux/SimpleReduxComponent.tsx).

### 🔥 TODO Advanced example (using async, thunks, splitting reducers, and complex selectors)

## 🔥 TODO Testing
