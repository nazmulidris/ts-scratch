// Prefer interface over `type`.
interface UserIF {
  name: string;
  age: number;
  toString(): string;
}

// "duck" aka structural typing.
const user: UserIF = {
  name: "JohnDoe",
  age: 15,
};
const userObject2: UserIF = { name: "foo", age: 16 };

// Classes are types too. Classes can implement interfaces. Interfaces can be extended.
class UserClass implements UserIF {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  toString(): string {
    return this.name + ", " + this.age;
  }
}

const userObject: UserIF = new UserClass("bla", 15);

function f1(user: UserClass): UserIF {
  return user;
}

function test_basics() {
  console.log("🟢🟢 basics.ts 🟢🟢");
  console.log(f1(f1(userObject)).toString());
}

export { test_basics };
