#!/usr/bin/env ts-node

const main = () => {
  const myPromise: Promise<void> = queueAsyncFunctionForExecutionAfterDelay(5000);
  myPromise.then(() => {
    console.log("myPromise has been resolved! 🥳")
  })
  console.log("first line");
  slowFunction();
  console.log("last line");
};

/**
 * References:
 * - https://javascript.info/promise-basics
 */
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

main();

console.log("goodbye!");

// process.exit();
