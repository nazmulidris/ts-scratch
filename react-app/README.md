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
  [`ReactReplayComponent`](src/components/ReactReplayComponent.tsx) implementation:
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

In the code for [`ReactReplayComponent`](src/components/ReactReplayComponent.tsx), the following
lines do the same thing (preventing any mutations on `elementArray`):

- `readonly elementArray: readonly JSX.Element[]`
- `readonly elementArray: ReadonlyArray<JSX.Element>`
