/*
 * Copyright 2021 Nazmul Idris All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export function getHumanReadableDate(): string {
  return new Date().toTimeString()
}

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

export function isNotDefined<T>(value: T | undefined | null): value is null | undefined {
  return value === undefined || value === null
}
