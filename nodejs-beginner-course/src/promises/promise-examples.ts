#!/usr/bin/env ts-node

/*
 * Copyright 2021 Nazmul Idris All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
