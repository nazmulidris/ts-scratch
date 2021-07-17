## Sample CRA app using TypeScript

Here are some tips and tricks used in this project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Normalize.css](#normalizecss)
- [Using CSS class pseudo selectors to style child elements of a parent](#using-css-class-pseudo-selectors-to-style-child-elements-of-a-parent)
- [Callable](#callable)
- [Composition over inheritance](#composition-over-inheritance)
- [Debugging in Webstorm or IDEA Ultimate](#debugging-in-webstorm-or-idea-ultimate)
- [TypeScript readonly vs ReadonlyArray](#typescript-readonly-vs-readonlyarray)
- [TypeScript prop and state types](#typescript-prop-and-state-types)
- [React Hooks](#react-hooks)
  - [useState](#usestate)
  - [useEffect](#useeffect)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Normalize.css

Using Normalize.css is pretty straight forwards following this
[guide](https://www.albertgao.xyz/2018/11/11/8-features-you-can-add-after-using-create-react-app-without-ejecting/).

1.  Simply run `npm install normalize.css`
2.  Then add `import 'normalize.css'` line to the top of [`index.tsx`](src/index.tsx)

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
  [`ReactReplayClassComponent`](src/components/ReactReplayClassComponent.tsx) implementation:
  1.  A class can't implement the `Callable` interface.
  2.  However, any member of the class can, and that member can be exposed as `Callable`.
  3.  This member is exposed as a getter.
  4.  This member can then be the only export in the module.
- In this case, the getter simply returns the reference to the 'generatorImpl' method. So we can
  write things like `GenerateReactElement.generator(...)` instead of just
  `GenerateReactElement.generator` (which is the normal use of a getter).

### Composition over inheritance

Use [composition over inheritance](https://reactjs.org/docs/composition-vs-inheritance.html) to make
components reusable.

1. This happens when you think about a component as a "generic box" and simply pass other JSX
   elements inside of them as `props.children`.
2. You can see this in [`ComponentWithoutState`](src/components/ComponentWithoutState.tsx).
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

In the code for [`ReactReplayClassComponent`](src/components/ReactReplayClassComponent.tsx), the
following lines do the same thing (preventing any mutations on `elementArray`):

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
  readonly animationFrames: readonly JSX.Element[]
}
export class ReactReplayClassComponent extends React.Component<AnimationFramesProps, {}> {
  /* snip */
}
```

If you wanted children to be passed, you could do something like this.

```typescript
export interface AnimationFramesPropsWithKids extends AnimationFramesProps {
  /** More info: https://linguinecode.com/post/pass-react-component-as-prop-with-typescript */
  readonly children?: React.ReactNode
}

export class ReactReplayClassComponent extends React.Component<AnimationFramesPropsWithKids, {}> {
  /* snip */
}
```

Here's an example for a functional component. Note the use of `FC` to specify that this is a
functional component that takes a prop. Being a functional component, you can't declare any state
types.

```typescript
export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): JSX.Element => {
  /* snip */
}
```

### React Hooks

React hooks exist because there were severe limitations in versions before React 16 on what
functional components could do. And there were some problems w/ how class components function. By
adding hooks to functional components, it basically eliminates these 2 groups of problems.

Here are the details on the problems w/ class components mentioned above. It is difficult to reuse
stateful logic between components, which results in people doing things like:

- [render props](https://reactjs.org/docs/render-props.html): Passing functions down the component
  hierarchy is cumbersome. However, there are situations where this is simply not avoidable.
- [higher-order components](https://reactjs.org/docs/higher-order-components.html): Scope can be
  stored at the top most component in the hierarchy, which makes it necessary to add components at
  the top most level just to wrap everything else underneath it, which is not optimal.

With hooks, it is now possible to reuse stateful logic between functional components! Thru the use
of `useState` hook, you can create your own more complex hooks. The official docs have
[Hooks at a Glance](https://reactjs.org/docs/hooks-overview.html) which is a great overview of hooks
along w/ an example of how you can make your own.

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

> Note that when stateful logic is reused, the state of each component is completely independent.
> Hooks are a way to reuse stateful logic, not state itself. In fact, each call to a Hook has a
> completely isolated state — so you can even use the same custom Hook twice in one component.
>
> Custom Hooks are more of a convention than a feature. If a function’s name starts with ”use” and
> it calls other Hooks, we say it is a custom Hook. The useSomething naming convention is how our
> linter plugin is able to find bugs in the code using Hooks.

#### useState

Here are some great resources on learning about `useState`.

1. [Official docs](https://reactjs.org/docs/hooks-state.html)
2. [TypeScript and useState](https://www.carlrippon.com/typed-usestate-with-typescript/)

Here are some examples.

```typescript
export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): JSX.Element => {
  /** State: currentAnimationFrameIndex (mutable). */
  const [currentAnimationFrameIndex, setCurrentAnimationFrameIndex] = useState<number>(0)

  /** State: animator (immutable). */
  const [animator] = useState<Animator>(
    new Animator(MyConstants.animationDelayMs, tick, "[FunctionalComponentAnimator]")
  )

  /* snip */
}
```

Here's the anatomy of each call to `useState`.

1. On the _left hand side_ of the call to `useState` hook, it returns an array.

   1. The first item is a reference to the state variable.
   2. The second item is the setter function for it. This mutates the state and triggers are render
      of the functional component.

2. It has to be initialized w/ whatever value is on the _right hand side_ expression. So it is a
   pretty simple way of making functional components have initial state.

#### useEffect

This hook allows you to register a function that is called whenever anything is rendered to the DOM
on the page. And it can be scoped to an array of dependencies (which are state variables that can
change in order to trigger this effect to be run).

> 1. Read more about this in the
>    [official docs](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects).
> 2. This [SO thread](https://stackoverflow.com/a/53974039/2085356) also has some good insight on
>    how to use this hook.

Here is an example that mimics `componentDidMount`.

```typescript
export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): JSX.Element => {
  /** State: animator (immutable). */
  const [animator] = useState<Animator>(
    new Animator(MyConstants.animationDelayMs, tick, "[FunctionalComponentAnimator]")
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
> doesn't really change.

If you want a hook to run on every single DOM render, then you can write something like this.

```typescript
export const ReactReplayFunctionComponent: FC<AnimationFramesProps> = (props): JSX.Element => {
  useEffect(runForEveryDomChange)

  function runForEveryDomChange() {
    /* code */
  }

  /* snip */
}
```
