<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [`tsconfig.json` options](#tsconfigjson-options)
- [Use `unknown` over `any`](#use-unknown-over-any)
- [User defined type guards](#user-defined-type-guards)
- [FP and generics](#fp-and-generics)
- [Type constructors - mathematical function that returns a new type based on the original type](#type-constructors---mathematical-function-that-returns-a-new-type-based-on-the-original-type)
- [Type union and intersection](#type-union-and-intersection)
- [Union type discriminators](#union-type-discriminators)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

TypeScript learnings from the Master class

- [TS Master class](https://www.educative.io/courses/advanced-typescript-masterclass/)

# Use strict=true in tsconfig.json options

Always set [`"strict"=true`](https://www.typescriptlang.org/tsconfig#strict)

# Use unknown over any

Because it does not propagate:

```javascript
function foo1(bar: any) {
  const a: string = bar; // no error
  const b: number = bar; // no error
  const c: { name: string } = bar; // no error
}

function foo2(bar: unknown) {
  const a: string = bar; // 🔴 Type 'unknown' is not assignable to type 'string'.(2322)
  const b: number = bar; // 🔴 Type 'unknown' is not assignable to type 'number'.(2322)
  const c: { name: string } = bar; // 🔴 Type 'unknown' is not assignable to type '{ name: string; }'.(2322)
}
```

# User defined type guards

A guard is not a type, but a mechanism that narrows types. This is a great [guide in the official
docs](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) that explains all of this,
including truthy / falsy, `as` operator, etc.

Here are some examples of built-in type guards.

1. `typeof` guard - This only works for JS primitive types that are checked at runtime (string,
   number, undefined, null, Boolean, and Symbol). It does not work for interfaces because that
   information is erased at runtime.

   ```typescript
   class Properties {
     width: number = 0;

     setWidth(width: number | string) {
       if (typeof width === "number") {
         this.width = width;
       } else {
         this.width = parseInt(width);
       }
     }
   }
   ```

2. `instanceof` guard - This works with classes, but not interfaces. Type information for classes is
   retained at runtime by JS, but not interfaces.

   ```typescript
   class Person {
     constructor(public name: string) {}
   }

   function greet(obj: any) {
     if (obj instanceof Person) {
       console.log(obj.name);
     }
   }
   ```

3. A custom type guard is a Boolean-returning function that can additionally assert something about
   the type of its parameter. You can create user defined type guards to test if an object has the
   shape of an interface.

   - [Docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates)
   - [Course](https://www.educative.io/courses/advanced-typescript-masterclass/g77AxgkEQG3#overview)

   The following code does **not work**.

   ```typescript
   interface Article {
     title: string;
     body: string;
   }

   function doSomething(bar: unknown) {
     const title: string = bar.title; // 🔴 Error!
     const body: number = bar.body; // 🔴 Error!
     console.log(title, body);
   }

   doSomething({ title: "t", body: "b" });
   doSomething({ foo: "t", bar: "b" });
   ```

   **First** try at using user defined type guards. It doesn't narrow automatically!

   ```typescript
   interface Article {
     title: string;
     body: string;
   }

   function isArticle(param: unknown): boolean {
     const myParam = param as Article;
     // 👍 One way of writing this without using string literals.
     if (myParam.title != undefined && myParam.body != undefined) {
       // The following works too.
       // if ("title" in myParam && "body" in myParam) {
       return true;
     }
     return false;
   }

   function doSomething(bar: unknown) {
     if (isArticle(bar)) {
       // 👎 You have to cast bar to Article as it does not narrow automatically.
       const article = bar as Article;
       console.log("Article interface type: ", article.title, article.body);
     } else {
       console.log("unknown type", bar);
     }
   }

   doSomething({ title: "t", body: "b" });
   doSomething({ foo: "t", bar: "b" });
   ```

   **Second** try at writing this. Have to use string literals for the properties!

   ```typescript
   interface Article {
     title: string;
     body: string;
   }

   function isArticle(param: any): param is Article {
     // 👎 You lose the ability to autocomplete title and body (as shown above), string literals are
     // needed, which could be a problem with keeping things in sync.
     return "title" in param && "body" in param;
   }

   function doSomething(bar: unknown) {
     if (isArticle(bar)) {
       // 👍 You don't have to cast bar to Article! It is automatically narrowed!
       console.log("Article interface type: ", bar.title, bar.body);
     } else {
       console.log("unknown type", bar);
     }
   }

   doSomething({ title: "t", body: "b" });
   doSomething({ foo: "t", bar: "b" });
   ```

   **Third** and best try, which solves both problems with previous tries.

   ```typescript
   interface Article {
     title: string;
     body: string;
   }

   function isArticle(param: any): param is Article {
     const myParam = param as Article;
     return (
       myParam.title != undefined &&
       myParam.body != undefined &&
       typeof myParam.title == "string" &&
       typeof myParam.body == "string"
     );
   }

   function doSomething(bar: unknown) {
     if (isArticle(bar)) {
       console.log("Article interface type: ", bar.title, bar.body);
     } else {
       console.log("unknown type", bar);
     }
   }

   doSomething({ title: "t", body: "b" });
   doSomething({ foo: "t", bar: "b" });
   ```

# FP and generics

Unlike OOP, objects don’t have behavior in Functional Programming. Interfaces are used not to
enumerate methods of an object, but to describe the shape of the data contained by the object. In
this context, generic interfaces are used to describe a data shape when you don’t know or care about
the exact type of some properties of the interface. It often makes sense when the data types contain
some value.
[More info](https://www.educative.io/courses/advanced-typescript-masterclass/YMyjNzyAwWK).

You can use generics in functions
[Docs](https://www.educative.io/courses/advanced-typescript-masterclass/3jn8g29nZ7M)

```typescript
function zip<TElement1, TElement2>(array1: Array<TElement1>, array2: Array<TElement2>) {
  const length = Math.min(array1.length, array2.length);
  const result: Array<Array<TElement1 | TElement2>> = [];
  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]]);
  }
  return result;
}
```

Constraining with index type query operator `keyof`:

```typescript
interface Person {
  name: string;
  age: number;
}

type PersonKeys = keyof Person; // ‘name’ | ‘age’

function get<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

const person: Person = { name: "foo", age: 10 };
console.log(get(person, "name")); // ✅ No errors
//console.log(get(person, 'foo')); // 🔴 Error!
```

Here's a more complex example of this - The `pick` function that takes an array of items and a
property name and returns an array of values of the provided property of array elements.

```typescript
function pick<T, K extends keyof T>(array: T[], key: K): Array<T[K]> {
  const results = new Array();
  array.forEach((element) => {
    results.push(element[key]);
  });
  return results;
}

// This also works.
function pick_alt<T>(array: T[], key: keyof T): Array<T[keyof T]> {
  const results = new Array<T[keyof T]>();
  array.forEach((element: T) => {
    results.push(element[key]);
  });
  return results;
}

interface Person {
  name: string;
  age: number;
}

const obj1: Person = { name: "foo", age: 10 };
const obj2: Person = { name: "bar", age: 20 };
const array = [obj1, obj2];

const array2: Array<Person[keyof Person]> = pick(array, "age");
console.log(array2);

const array3: Array<Person[keyof Person]> = pick(array, "name");
console.log(array3);

// const array3: Array<Person[keyof Person]> = pick(array, "baz"); // ⛔ Error!
```

# Type constructors - mathematical function that returns a new type based on the original type

- [Utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Chapter in educative.io](https://www.educative.io/courses/advanced-typescript-masterclass/NE0jOpyxgoL).

```typescript
// Eg1
type X1 = NonNullable<string | undefined>; // X1 = string

// Eg2
type X2 = Partial<{ name: string; age: number }>; // X2 = { name?: string; age?: number;}

// Eg3
function square(x: number): number {
  return x * x;
}
type X3 = ReturnType<typeof square>; // X3 = number

// Eg4
type Optional<T> = T | undefined | null // Optional = T | undefined | null
```

## Useful utility types

1.  [Readonly<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype) -
    Constructs a type with all the properties of `T` set to `readonly` (it is not recursive, so it
    is not a deep readonly). You can use a
    [library](https://github.com/krzkaczor/ts-essentials#Deep-wrapper-types) for this if you need
    deep readonly.

    ```typescript
    interface Todo {
      title: string;
    }

    const todo: Readonly<Todo> = {
      title: "Delete inactive users",
    };

    todo.title = "Hello";
    ```

2.  [Partial<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) -
    Constructs a type with all the properties of `T` set to optional. Sometimes this is needed when
    `strictNullChecks` flag is enabled in `tsconfig.json`.

    ```typescript
    interface Todo {
      title: string;
      description: string;
    }

    function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
      return { ...todo, ...fieldsToUpdate };
    }

    const todo1 = {
      title: "organize desk",
      description: "clear clutter",
    };

    const todo2 = updateTodo(todo1, {
      description: "throw out trash",
    });
    ```

3.  [Record<K,V>](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype) -
    Constructs an object type out of "thin air" whose property keys are `K` and values are `V`.

    ```typescript
    interface CatInfo {
      age: number;
      breed: string;
    }

    type CatName = "miffy" | "boris" | "mordred";

    const cats: Record<CatName, CatInfo> = {
      miffy: { age: 10, breed: "Persian" },
      boris: { age: 5, breed: "Maine Coon" },
      mordred: { age: 16, breed: "British Shorthair" },
    };

    cats.boris;
    // ^ = const cats: Record<CatName, CatInfo>
    ```

4.  [ReturnType<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype) -
    Constructs a type consisting of the return type of function `T`.

    ```typescript
    declare function f1(): { a: number; b: string };
    type T4 = ReturnType<typeof f1>;
    //    ^ = type T4 = {
    //        a: number;
    //        b: string;
    //    }
    ```

5.  [Parameters<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)
    Constructs a [tuple](https://www.typescriptlang.org/docs/handbook/basic-types.html#tuple) that
    holds all the types of the parameters of a function of type `T`.

    ```typescript
    declare function f1(arg: { a: number; b: string }): void;
    type T3 = Parameters<typeof f1>;
    //    ^ = type T3 = [arg: {
    //        a: number;
    //        b: string;
    //    }]
    ```

6.  [NonNullable<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype) -
    Constructs a type by excluding `null` and `undefined` from `T`.

    ```typescript
    type T0 = NonNullable<string | number | undefined>;
    //    ^ = type T0 = string | number
    type T1 = NonNullable<string[] | null | undefined>;
    //    ^ = type T1 = string[]
    ```

# Type union and intersection

Union and intersection are mathematical set operations. Here's an example to illustrate how they
work.

```typescript
interface Foo {
  foo: string;
  boo: string;
  name: string;
}

interface Bar {
  bar: string;
  name: string;
}

const sayHelloIntersection = (obj: Foo & Bar) => {
  /* ... */
};
const sayHelloUnion = (obj: Foo | Bar) => {
  /* ... */
};

sayHelloIntersection({ foo: "foo", boo: "dffe", name: "xyz", bar: "bar" }); // Both Foo and Bar.
sayHelloIntersection({ foo: "foo", boo: "dffe", name: "xyz" }); // ⛔ Error! Only Foo. No Bar.
sayHelloIntersection({ bar: "bar", name: "xyz" }); // ⛔ Error! Only Bar. No Foo.

sayHelloUnion({ bar: "bar", name: "xyz" }); // This is a Bar (missing Foo:.foo,.boo).
sayHelloUnion({ foo: "foo", boo: "boo", name: "xyz" }); // This is a Foo (missing Bar:.bar).
sayHelloUnion({ bar: "bar", name: "xyz", boo: "boo" }); // Bar with partial Foo (missing foo).
sayHelloUnion({ foo: "foo", boo: "boo", name: "xyz" }); // Foo with partial Boo (missing bar).
sayHelloUnion({ name: "xyz" }); // ⛔ Error! Not a complete Foo or Bar!
```

# Discriminated Unions (FP) aka Algebraic Data Types

[Course link](https://www.educative.io/courses/advanced-typescript-masterclass/mEWlKjWL9JA#overview)

The concept of "union type discriminators" is similar to the idea of sealed classes in Kotlin. It is
great for encapsulating state, state transitions, and state machines, just like sealed classes. But
this is a FP approach, rather than an OOP one. Here's an example to illustrate.

```typescript
enum ContactType {
  Phone,
  Email,
}

type Contact =
  | { kind: ContactType.Phone; phone: number }
  | { kind: ContactType.Email; email: string };

interface Customer {
  name: string;
  contact: Contact;
}

function printCustomerContact(customer: Customer) {
  switch (customer.contact.kind) {
    case ContactType.Email:
      console.log("Narrowed to contact w/ email: ", customer.contact.email);
      break;
    case ContactType.Phone:
      console.log("Narrowed to contact w/ phone: ", customer.contact.phone);
      break;
  }
}

const c1: Customer = { name: "customer1", contact: { kind: ContactType.Phone, phone: 1231234567 } };
const c2: Customer = { name: "customer2", contact: { kind: ContactType.Email, email: "a@b.com" } };

printCustomerContact(c1);
printCustomerContact(c2);
```

- These two union members follow a special convention. They both have a "literal" property called
  `kind`. The value of that property is different in both members.
  - There is an `enum` here but it can be a `string` or any other type of value.
  - It does not have to be called `kind`, the same property name needs to show up in each type.
- This property is called a discriminator. It encodes type information into the object so that it is
  available at **runtime**.
- Thanks to this, TypeScript can figure out which union member you’re dealing with by looking at the
  `kind` property.

Here's another example of using a type union discriminator to describe a simplistic future or
pending result using generics and enums.

```typescript
interface PendingResultComplete<T> {
  done: true;
  value: T;
}

interface PendingResultIncomplete {
  done: false;
  error: Error;
}

type PendingResult<T> = PendingResultComplete<T> | PendingResultIncomplete;

function printPendingResult<T>(result: PendingResult<T>) {
  switch (result.done) {
    case true:
      console.log("Narrowing to PendingResultComplete: ", result.value);
      break;
    case false:
      console.log("Narrowing to PendingResultError: ", result.error.message);
      break;
  }
}

const pr1: PendingResultComplete<string> = { done: true, value: "payload" };
const pr2: PendingResultIncomplete = { done: false, error: new Error("oh no!") };

printPendingResult(pr1);
printPendingResult(pr2);
```

Also, a discriminator does not have to be a single property. A group of repeating "literal"
properties can also act as a discriminator. In this case, every combination of values marks a
different member of the union type. Here's an example.

```typescript
type Foo =
  | { kind: "A"; type: "X"; abc: string }
  | { kind: "A"; type: "Y"; xyz: string }
  | { kind: "B"; type: "X"; rty: string };

declare const foo: Foo;

if (foo.kind === "A" && foo.type === "X") {
  console.log("Narrowing to type with abc property: ", foo.abc);
}
```

# Discriminated Unions (FP) vs Subtyping (OOP)

[Course link](https://www.educative.io/courses/advanced-typescript-masterclass/g2WQEBkz6Pl#overview)

Both approaches can be used to achieve the same result. However, there are a few major differences.

1. First, the OOP approach is much more verbose.
2. The most important difference is how these two approaches cope with change.
   - Imagine that we want to support a new operation at the "root level". In OOP approach, we need
     to modify every concrete class extending from the top level parent class (or interface). This
     can be difficult, especially if we don’t own all of these classes. Using, Algebraic Data Types
     (ADT) in the FP approach, all we need to do is write another standalone function with a switch
     statement.
   - Now imagine we want to add a new sub class or sub type of the top level one. In the OOP
     approach we just create a new subclass to represent this. In the FP approach (w/ ADT) we have
     to add a new case to every switch statement that switches over the discriminatory property.
     This is problematic if we don't own all the operations.

For me, I will stick w/ the OOP approach, since there is no need to reinvent the wheel. Also OOP
based code will be readable by coders who know many different languages (eg Java, C#, Kotlin, ES6),
whereas using FP / ADT it is only the domain of someone who knows FP in TS (or some other esoteric
language). I am glad I got exposure to the FP way of doing things in TS. Who knows, there may be
situations where it might be advantageous to use the FP approach.
