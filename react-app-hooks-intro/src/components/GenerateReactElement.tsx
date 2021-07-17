/*
 * Copyright 2021 Nazmul Idris. All rights reserved.
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
 *
 */

import React from "react"

/**
 * This class generates a JSX.Element object that contains a Virtual DOM representation of the a
 * localized greeting for the user.
 *
 * More info on the Callable interface generatorImpl pattern used here:
 *   https://stackoverflow.com/a/20736000/2085356
 *
 * Key takeaways:
 *   1. A class can't implement the Callable interface.
 *   2. However, any member of the class can, and that member can be exposed as Callable.
 *   3. This member is exposed as a getter.
 *   4. This member can then be the only export in the module.
 *
 * In this case, the getter simply returns the reference to the 'generatorImpl' method. So we can
 * write things like `GenerateReactElement.generator(...)` instead of just
 * `GenerateReactElement.generator` (which is the normal use of a getter).
 */
class GenerateReactElement {
  public static get generator(): VDOMElementGenerator {
    return GenerateReactElement.generatorImpl
  }

  private static generatorImpl: VDOMElementGenerator = (localGreeting: string, user: string) => {
    return GenerateReactElement.generate(localGreeting, user)
  }

  private static generate(localGreeting: string, user: string): JSX.Element {
    return (
      <h2>
        👋{localGreeting}, {user}
      </h2>
    )
  }
}

/** This is a very generic callable function interface. */
type Callable<T, R> = (...args: T[]) => R

/** This is a more specific variant of the Callable interface used here. */
type VDOMElementGenerator = Callable<string, JSX.Element>

/** Only the generator getter is publicly exported from this module. */
export const VirtualDomElementGenerator = GenerateReactElement.generator
