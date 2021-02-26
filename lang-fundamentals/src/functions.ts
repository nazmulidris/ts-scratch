/**
 * More info: https://www.typescriptlang.org/docs/handbook/functions.html
 */

function test_functions() {
  console.log("🟢🟢 functions 🟢🟢");
  console.log(foo("a", "b"));
  console.log(foo("a1", "b1", "c1"));
  console.log(bar(undefined, "Smith"));
  console.log(baz("Jon"));
  console.log(foobar("n1", "n2", "n3"));
}

function foo(arg1: string, arg2: string, arg3?: string): string {
  if (arg3) return arg1 + " " + arg2 + " " + arg3;
  else return arg1 + " " + arg2;
}

function bar(first: string = "Will", last: string): string {
  return first + " " + last;
}

function baz(first: string, last: string = "Doe"): string {
  return first + " " + last;
}

function foobar(arg1: string, ...argN: string[]) {
  return arg1 + " " + argN.join(" ");
}

export { test_functions };
