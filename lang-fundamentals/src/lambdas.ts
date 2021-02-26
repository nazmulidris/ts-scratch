/**
 * More info: https://www.tutorialsteacher.com/typescript/arrow-function
 */

function test_lambdas() {
  console.log("🟢🟢 lambdas.ts 🟢🟢");
  const sum = (x: number, y: number): number => {
    return x + y;
  };
  console.log(sum(10, 10));
  console.log(new MyClass(12, "jdoe").toString());
}

class MyClass {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  toString = (): string => this.id + " " + this.name;
}

export { test_lambdas };
