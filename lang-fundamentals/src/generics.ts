// Generics.
interface Collection<T> {
  add(item: T): void;
  get: (index: number) => T;
  size: () => number;
}

class ListOfStrings implements Collection<string> {
  underlyingArray: Array<string> = new Array<string>();

  add(item: string): void {
    this.underlyingArray.push(item);
  }

  get(index: number): string {
    return this.underlyingArray[index];
  }

  size(): number {
    return this.underlyingArray.length;
  }
}

function test_generics() {
  console.log("🟢🟢 generics.ts 🟢🟢");
  const myListOfString: ListOfStrings = new ListOfStrings();
  myListOfString.add("foo");
  console.log(myListOfString.get(myListOfString.size() - 1));
}

export { test_generics };
