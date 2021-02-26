#!/usr/bin/env ts-node

const main = () => {
  console.log("asyncFunction q'd for execution 5 sec from now 🕗");
  setTimeout(asyncFunction, 5000);
  console.log("first line");
  slowFunction();
  console.log("last line");
};

const asyncFunction = () => {
  console.log("after 5 sec...");
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
