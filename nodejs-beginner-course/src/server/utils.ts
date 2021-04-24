export function getHumanReadableDate(): string {
  return new Date().toTimeString()
}

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

export function isNotDefined<T>(value: T | undefined | null): value is (null | undefined) {
  return value === undefined || value === null
}