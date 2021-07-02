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

import { ParsedUrlQuery } from "querystring"

export type ContentGeneratorFnType = (queryParams?: ParsedUrlQuery) => Content

export interface Route {
  pathname: string
  generateContentFn: ContentGeneratorFnType
}

export enum ValidContentTypes {
  Text = "text/plain",
  JSON = "application/json",
  HTML = "text/html",
}

export interface Content {
  payload: string
  type: ValidContentTypes
}

export type Optional<T> = T | undefined | null
