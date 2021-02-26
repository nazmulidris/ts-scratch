// Type union.
type LockStateTypes = "read-locked" | "write-locked" | "unlocked";

function getLockedState(code: number): LockStateTypes {
  if (code == 0) return "read-locked";
  else if (code == 1) return "write-locked";
  else return "unlocked";
}

function test_unions() {
  console.log("🟢🟢 unions.ts 🟢🟢");
  console.log(getLockedState(0));
}

export { test_unions };
