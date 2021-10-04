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

// Setup & teardown.
import { setupServer, SetupServerApi } from "msw/node"
import {
  DefaultRequestBody,
  RequestParams,
  ResponseComposition,
  rest,
  RestContext,
  RestHandler,
  RestRequest,
} from "msw"
import { TheCatApi } from "../CatApiComponent"
import SearchResults = TheCatApi.SearchResults

export function setupAndTeardown(): SetupServerApi {
  const server: SetupServerApi = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
  return server
}

// TheCatApi canned responses.
export const cannedResponseOk: SearchResults[] = [
  {
    id: "jK5X2xGJ7",
    url: "https://cdn2.thecatapi.com/images/jK5X2xGJ7.jpg",
  },
  {
    id: "9c6",
    url: "https://cdn2.thecatapi.com/images/9c6.jpg",
  },
  {
    id: "ab8",
    url: "https://cdn2.thecatapi.com/images/ab8.jpg",
  },
]
/**
 * Mock the REST API w/ handlers.
 * More info: https://mswjs.io/docs/getting-started/mocks/rest-api
 */
export const restHandlerSearchOk: RestHandler = rest.get(
  TheCatApi.search.host + TheCatApi.search.endpoint,
  (
    req: RestRequest<DefaultRequestBody, RequestParams>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    console.log("restHandlerSearchOk.req", req)
    // console.log("req.url.searchParams", req.url.searchParams)
    // console.log("req.params", req.params)
    return res(ctx.json(cannedResponseOk))
  }
)
export const restHandlerSearchError: RestHandler = rest.get(
  TheCatApi.search.host + TheCatApi.search.endpoint,
  (
    req: RestRequest<DefaultRequestBody, RequestParams>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    console.log("restHandlerSearchError.req", req)
    // console.log("req.url.searchParams", req.url.searchParams)
    // console.log("req.params", req.params)
    return res(ctx.status(500))
  }
)
