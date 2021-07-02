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

import { ContentGeneratorFnType, Route, ValidContentTypes } from "../types"
import { getHumanReadableDate } from "../utils"

export class DummyJson implements Route {
  pathname: string = `/${DummyJson.name}`
  counter: number = 0

  generateContentFn: ContentGeneratorFnType = (queryParams?) => {
    this.counter++
    console.log(
      `\n\n👉 #${
        this.counter
      }: processHttpRequest(): ${getHumanReadableDate()} got request FROM client`
    )
    const jsonText = JSON.stringify(queryParams)
    console.log(
      `👈 #${
        this.counter
      }: processHttpRequest(): ${getHumanReadableDate()} sent data back TO client`
    )
    return { payload: jsonText, type: ValidContentTypes.JSON }
  }
}
