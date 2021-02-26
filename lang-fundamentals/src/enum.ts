// Enums.
enum LockStateEnum {
  ReadLocked,
  WriteLocked,
  Unlocked,
}

function getLockedStateEnum(code: number): LockStateEnum {
  switch (code) {
    case 0:
      return LockStateEnum.ReadLocked;
    case 1:
      return LockStateEnum.WriteLocked;
    default:
      return LockStateEnum.Unlocked;
  }
}

function test_enum() {
  console.log("🟢🟢 enum.ts 🟢🟢");
  console.log(LockStateEnum[getLockedStateEnum(2)]);
}

export { test_enum };
