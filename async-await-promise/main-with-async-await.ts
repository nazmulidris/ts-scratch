#!/usr/bin/env ts-node

/**
 * By marking main() with async, it will automatically return a Promise.
 */
const main = async () => {
  await queueAsyncFunctionForExecutionAfterDelay(5000);
  console.log("first line after await (aka promise has resolved)");
  slowFunction();
  console.log("last line in main()");
};

/**
 * Any function that returns a Promise is async.
 * References:
 * - https://javascript.info/promise-basics
 * - https://blog.logrocket.com/async-await-in-typescript/
 * */
const queueAsyncFunctionForExecutionAfterDelay = (delayMs: number): Promise<void> => {
  console.log("asyncFunction q'd for execution 5 sec from now 🕗");
  const myPromise = new Promise<void>(function (resolveCallback, rejectCallback) {
    setTimeout(() => {
      console.log(`${delayMs / 1000} sec have passed -> resolving myPromise ⏰`);
      resolveCallback();
    }, delayMs);
  });
  return myPromise;
};

const slowFunction = () => {
  let count = 1000;
  while (count > 0) {
    count--;
    // console.log without newline: https://stackoverflow.com/a/9628935/2085356
    if (count % 100 === 0) process.stdout.write(`${count} ... `);
  }
  process.stdout.write("\n");
};

// Ignore the Promise returned by main().
// main();

// Using the Promise returned by main() and use then().
const mainPromise: Promise<void> = main();
mainPromise.then(()=>{console.log("goodbye!");});

