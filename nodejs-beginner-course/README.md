<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Node.js project setup using IDEA](#nodejs-project-setup-using-idea)
- [Node.js threading model](#nodejs-threading-model)
  - [Overview](#overview)
  - [Event loop](#event-loop)
  - [Worker threads API for JS code](#worker-threads-api-for-js-code)
  - [Streaming and high performance JSON APIs](#streaming-and-high-performance-json-apis)
  - [libuv and worker threads](#libuv-and-worker-threads)
  - [N-API for native addons](#n-api-for-native-addons)
  - [Kotlin Native and C interop](#kotlin-native-and-c-interop)
- [Message Queue and ES6 Job Queue](#message-queue-and-es6-job-queue)
  - [Message Queue and setTimeout(), setImmediate()](#message-queue-and-settimeout-setimmediate)
  - [process.nextTick()](#processnexttick)
  - [ES6 Job Queue (for Promises)](#es6-job-queue-for-promises)
- [Promises, async, await](#promises-async-await)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Learnings from Node.js: The Complete Course for Beginners

- [TS Master class](https://www.educative.io/courses/learn-nodejs-complete-course-for-beginners/xV5YWR3DGq3)

# Node.js project setup using IDEA

1. Using IDEA (Ultimate or Webstorm) create a new Node.js project.
2. Use the `ts-node-dev` Node.js interpreter (not the default), which is located in
   `/usr/bin/ts-node/dev`.
3. In the `package.json` add the following dev dep (`npm i --save-dev @types/node`). Other dev deps
   will be added when you start importing various modules in your code.
4. When creating a `.ts` file, in order to make it executable, you can do the following:
5. Add `#!/usr/bin/env ts-node` to the top of the `.ts` file.
6. Mark the file executable using `chmod +x *.ts`.
7. Add a [`tsconfig.json`](tsconfig.json) file which enables strict mode, and dumps compiled output
   to a `build` folder. Also compile TypeScript files located in the `src` folder and its subfolders
   only.

# Node.js threading model

## Overview

- [Course link](https://www.educative.io/courses/learn-nodejs-complete-course-for-beginners/RMoNJwAKR2q)
  .
- This article describes how the
  [main thread and thread pool (worker pool) of `k` Worker threads](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)
  works in Node.js.

Node.js has two types of threads: one Event Loop and `k` Workers.

1. The Event Loop is responsible for JavaScript callbacks and non-blocking I/O, and
2. a Worker (out of the pool of `k`) executes tasks corresponding to C++ code that completes an
   asynchronous request, including blocking I/O and CPU-intensive work.

Both types of threads work on no more than one activity at a time. If any callback or task takes a
long time, the thread running it becomes blocked. If your application makes blocking callbacks or
tasks, this can lead to degraded throughput (clients/second) at best, and complete denial of service
at worst.

To write a high-throughput, more DoS-proof web server, you must ensure that on benign and on
malicious input, neither your Event Loop nor your Workers will block.

## Event loop

- [Node.js docs on event loop, workers, and best practices to avoid freezes](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)

  - Best practices from doc above:

    - Avoid "vulnerable" regex.
    - Avoid synchronous versions of Node.js APIs for encryption, compression, file system, and child
      process.
    - Avoid using JSON parse and stringify for really large objects (these operations are very slow)
      . Libraries [exist](#streaming-and-high-performance-json-apis) to handle these performance
      issues.
    - Avoid variable time complexity callbacks, try and keep them `O(n)`. Here are some strategies
      to accomplish this.
      1. _Partitioning_: You can use `setImmediate` and chunk the long operation into smaller
         pieces.
      2. _Offloading_: The only drawback here is that the main thread is in a different "namespace"
         (JavaScript state of your application) than a worker thread, so you have to serialize &
         deserialize any objects that are passed between them. Also, you must also be careful about
         understanding whether your long running operations are CPU intensive or IO intensive, since
         they both have to be approached differently. However, if your app relies heavily on complex
         calculations, you should think about whether Node.js is really a good fit. Node.js excels
         for I/O-bound work, but for expensive computation it might not be the best option.
      - You have [**two choices**](#worker-threads-api-for-js-code) to run CPU intensive JS code in
        the thread pool without writing a C/C++ addon.
      - You can create a C/C++ addon using [N-API](https://nodejs.org/api/n-api.html).

- [Video on how the event loop works](https://youtu.be/P9csgxBgaZ8)

## Worker threads API for JS code

Without writing a [C/C++ addon using N-API](#n-api-for-native-addons), you can use either of the
following.

- You can even use the **new**
  [`Worker Threads` API in Node.js 15](https://nodejs.org/docs/latest/api/worker_threads.html) to
  run CPU intensive JS code in the thread pool without writing a C/C++ addon.
- You can use the new [WebWorker Threads library](https://www.npmjs.com/package/webworker-threads)
  to run the JS code in the thread pool without writing a C/C++ addon.

## Streaming and high performance JSON APIs

- You can use [stream APIs](https://www.npmjs.com/package/JSONStream) for JSON.
- Or you can use [async versions of JSON parsing APIs](https://www.npmjs.com/package/bfj).

## libuv and worker threads

`libuv` is a multiplatform C library for async IO based on event loops, which exposes a general task
submission API. Node.js uses the thread pool to handle "expensive" tasks.

This includes I/O for which an OS does not provide a non-blocking version
([DNS](https://tinyurl.com/orjpz3t), and [file system](https://tinyurl.com/yz87vob9)), as well as
particularly CPU-intensive tasks ([Zlib](https://tinyurl.com/ye5kqjny) and
[Crypto](https://tinyurl.com/n3moqwk)).

User defined [C/C++ addons](https://nodejs.org/api/addons.html) can also be run in this thread pool.
However you should write these addons using the [`N-API`](#n-api-for-native-addons).

You have [two choices](#worker-threads-api-for-js-code) to run CPU intensive JS code in the thread
pool without writing a C/C++ addon.

- [Wikipedia](https://en.wikipedia.org/wiki/Libuv)
- [Library website](http://docs.libuv.org/en/v1.x/)
- [Design docs](http://docs.libuv.org/en/v1.x/design.html)
- [Threadpool API](http://docs.libuv.org/en/v1.x/threadpool.html)
- [Differences w/ browser which uses `libevent`](https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c)

## N-API for native addons

- [Video](https://youtu.be/-Oniup60Afs)
- [GitHub repo](https://github.com/nodejs/node-addon-api)
- [Tutorial on building Node.js native addons in 2020](https://nodejs.medium.com/building-modern-native-add-ons-for-node-js-in-2020-cd3992c68e0)
- [Tutorial on using the N-API to create an addon in C/C++](https://tinyurl.com/yecfnkf9)

## Kotlin Native and C interop

- **Hypothesis** - It may be possible to use Kotlin Native to generate C interoperable code in order
  to write some native addons for Node.js.
- [KT and C interop](https://kotlinlang.org/docs/native-c-interop.html#basic-interop-types)
- [Random repo I found on github that claims to do this](https://github.com/datkt/node-addon-example)

# Message Queue and ES6 Job Queue

## Message Queue and setTimeout(), setImmediate()

Read the official Node.js docs about
[event loop and message queue](https://nodejs.dev/learn/the-nodejs-event-loop#the-message-queue:~:text=The%20Message%20Queue,-When)
.

When `setTimeout(()=>{}, 0)` is called, the Browser or Node.js starts the timer. Once the timer
expires, in this case immediately as we put `0` as the timeout, the callback function is put in the
**Message Queue**.

- The Message Queue is also where user-initiated events like click or keyboard events, or fetch
  responses are queued before your code has the opportunity to react to them. Or also DOM events
  like `onLoad`.
- The loop gives priority to the call stack, and it first processes everything it finds in the call
  stack, and once there's nothing in there, it goes to pick up things in the message queue.
- We don't have to wait for functions like `setTimeout`, `fetch` or other things to do their own
  work, because they are provided by the browser, and they live on their own threads. For example,
  if you set the `setTimeout` timeout to 2 seconds, you don't have to wait 2 seconds - the wait
  happens elsewhere (in the worker thread pool).

A `setTimeout()` callback with a 0ms delay is very similar to `setImmediate()`. The execution order
will depend on various factors, but they will be both run in the next iteration of the event loop.

## process.nextTick()

Read the official Node.js docs about
[process.nextTick()](https://nodejs.dev/learn/understanding-process-nexttick#link-nodejs-with-typescript:~:text=When%20we%20pass%20a%20function%20to,the%20next%20event%20loop%20tick%20starts%3A)
.

Every time the event loop takes a full trip, we call it a `tick`. When we pass a function to
`process.nextTick()`, we instruct the engine to invoke this function at the end of the current
operation, before the next event loop tick starts. Here's an example.

```javascript
process.nextTick(() => {
  /* Do something. */
})
```

- The event loop is busy processing the current function code.
- When this operation ends, the JS engine runs all the functions passed to nextTick calls during
  that operation.
- It's the way we can tell the JS engine to process a function asynchronously (after the current
  function), but as soon as possible, not queue it. Calling `setTimeout(() => {}, 0)` will execute
  the function at the end of next tick, much later than when using `nextTick()` which prioritizes
  the call and executes it just before the beginning of the next tick.

Use `nextTick()` when you want to make sure that in the next event loop iteration that code is
already executed.

## ES6 Job Queue (for Promises)

Read the official Node.js docs about the
[ES6 job queue](https://nodejs.dev/learn/the-nodejs-event-loop#es6-job-queue:~:text=ES6%20Job%20Queue)
.

ECMAScript 2015 introduced the concept of the Job Queue, which is used by Promises (also introduced
in ES6/ES2015). It's a way to execute the result of an async function as soon as possible, rather
than being put at the end of the call stack.

Promises that resolve before the current function ends will be executed right after the current
function.

I find nice the analogy of a rollercoaster ride at an amusement park: the message queue puts you at
the back of the queue, behind all the other people, where you will have to wait for your turn, while
the job queue is the fastpass ticket that lets you take another ride right after you finished the
previous one. Here's an example.

```javascript
const bar = () => console.log("bar")

const baz = () => console.log("baz")

const foo = () => {
  console.log("foo")
  setTimeout(bar, 0)
  new Promise((resolve, reject) =>
    resolve("should be right after baz, before bar")
  ).then((resolve) => console.log(resolve))
  baz()
}

foo()
```

![Call stack for the code above](https://nodejs.dev/907f18a0288ad303ad59c035397a6f7e/call-stack-third-example.svg)

# Promises, async, await

It is relatively simple to reason about using promises, as a way to eliminate callback hell. It is
also relatively simple to
["promisify"](https://nodejs.dev/learn/understanding-javascript-promises#creating-a-promise:~:text=A%20more%20common%20example%20you%20may,and%20have%20it%20return%20a%20promise%3A)
existing callback based APIs.

> Here are some good reference links.
>
> - [Official Node.js docs on Promises](https://nodejs.dev/learn/understanding-javascript-promises)
> - [SO thread about when a Promise actually executes](https://stackoverflow.com/a/42118995/2085356)
> - [Top level await in Node.js](https://nodejs.dev/learn/modern-asynchronous-javascript-with-async-and-await)
> - [ECMA promise (executor) official specs](https://262.ecma-international.org/6.0/#sec-promise-executor)

However, on the other side of the coin, when returning a promise, how does it all work? When does
the promise execute? Here's an example to illustrate this.

```typescript
#!/usr/bin/env ts-node

type ResolveFnType<T> = (value: T) => void
type RejectFnType = (reason?: any) => void
type ExecutorFnType<T> = (resolveFn: ResolveFnType<T>, rejectFn?: RejectFnType) => void

// Can also write this as a named function.
// function myExecutorFn(resolveFn: ResolveFnType<string>) {
const myExecutorFn: ExecutorFnType<string> = (resolveFn: ResolveFnType<string>) => {
  resolveFn("hello world!")
}

function createMyPromise(): Promise<string> {
  const promise: Promise<string> = new Promise<string>(myExecutorFn)
  return promise
}

function main() {
  const promise: Promise<string> = createMyPromise()
  promise.then((value: string) => {
    console.log(value)
  })
}

main()
```

After running this code in the debugger w/ breakpoints set on every line in `createMyPromise()` we
learn:

1. The `Promise` takes an `executor`, which is the function that actually does the work of resolving
   or rejecting the promise. In this case, `myExecutorFn()`.
2. This `executor` is run at the moment at which the `Promise` is instantiated using `new`. In this
   simple example, once `new Promise(myExecutorFn)` is called, it then calls the `myExecutorFn`
   function before returning a `promise` object.

Here's a more sophisticated example w/ timings and even using `await`.

```typescript
#!/usr/bin/env ts-node

import * as chalk from "chalk"

type ResolveFnType<T> = (value: T) => void
type RejectFnType = (reason?: any) => void
type ExecutorFnType<T> = (resolveFn: ResolveFnType<T>, rejectFn?: RejectFnType) => void

// https://nodejs.org/api/process.html#process_process_hrtime_time
let startTime: [number, number] = process.hrtime()

function timeDiffMs(): number {
  const NS_PER_MS = 1e6
  return process.hrtime(startTime)[1] / NS_PER_MS
}

function handleImmediateExecutionPromise() {
  // Can also write this as a named function.
  // function myExecutorFn(resolveFn: ResolveFnType<string>) {
  const myExecutorFn: ExecutorFnType<string> = (resolveFn: ResolveFnType<string>) => {
    resolveFn("hello world!")
  }

  new Promise<string>(myExecutorFn).then((value) =>
    console.log(chalk.red(`immediate: ${value}, actual delay ${timeDiffMs()} ms`))
  )
}

function handleDeferredExecutionPromise(delayMs: number) {
  const myExecutorFn: ExecutorFnType<string> = (resolveFn) => {
    setTimeout(() => {
      resolveFn(`hello world! after ${delayMs} ms`)
    }, delayMs)
  }

  new Promise<string>(myExecutorFn).then((value) =>
    console.log(chalk.green(`using then(): ${value}, actual delay ${timeDiffMs()} ms`))
  )
}

async function handleDeferredExecutionPromiseWithAwait(delayMs: number) {
  const myExecutorFn: ExecutorFnType<string> = (resolveFn) =>
    setTimeout(() => resolveFn(`hello world! after ${delayMs} ms`), delayMs)

  const value = await new Promise(myExecutorFn)
  console.log(chalk.blue(`using await: ${value}, actual delay ${timeDiffMs()} ms`))
}

async function main() {
  startTime = process.hrtime()
  console.log(`Set startTime: ${startTime}, actual delay calculated from this timestamp`)

  handleImmediateExecutionPromise()
  handleDeferredExecutionPromise(500)

  console.log(chalk.yellow("before await!"))
  await handleDeferredExecutionPromiseWithAwait(200)

  console.log(chalk.yellow("end!"))
}

main()
```
