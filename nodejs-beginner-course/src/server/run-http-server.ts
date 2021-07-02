#!/usr/bin/env ts-node-dev

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

/**
 * README
 * ======
 *
 * Note that this script is a TypeScript self executing file.
 * 1. Make sure that you have `ts-node` installed in your system using
 *    `sudo npm install -g typescript ts-node`.
 *    More info: https://www.npmjs.com/package/ts-node.
 * 2. Make sure to make this file executable using `chmod +x <filename>`
 *
 * Learn more about Node.js's built in HTTP module which you can use to create a server from
 * [here](https://www.w3schools.com/nodejs/nodejs_http.asp).
 */

import * as _ from "lodash"
import * as http from "http"
import { IncomingMessage, ServerResponse } from "http"
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown"
import { ParsedUrlQuery } from "querystring"
import { Content, Optional, Route } from "./types"
import { myRoutes } from "./routes/routes"
import * as url from "url"
import { UrlWithParsedQuery } from "url"
import { noRouteFoundContentFn } from "./routes/no-route-found"

// https://dev.to/hte305/simple-deploy-typescript-application-to-heroku-5b6g
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
const PORT: string | number = process.env.PORT ?? 3000

class RunHttpServer {
  readonly myHttpServerShutdownManager: GracefulShutdownManager
  readonly myHttpServer: http.Server

  constructor() {
    const myRequestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
      this.processHttpRequest(req, res, myRoutes)
    }
    this.myHttpServer = http.createServer(myRequestListener)
    this.myHttpServerShutdownManager = new GracefulShutdownManager(this.myHttpServer)
  }

  start(): void {
    // The following call is sort of like calling a promise. It returns immediately and executes
    // the next line. But the server is started on PORT.
    console.log(`Starting server on port ${PORT} 🚀. Press "Ctrl+C" to kill the server 💀.`)
    this.myHttpServer.listen(PORT)

    // https://nodejs.org/api/process.html
    process.on("SIGINT", () => {
      console.log("Ctrl+C just got pressed! 💀")
      this.shutdownNow()
    })
  }

  shutdownNow(): void {
    this.myHttpServerShutdownManager.terminate(() => console.log("HTTP Server: Goodbye!"))
  }

  processHttpRequest(
    requestFromClient: IncomingMessage,
    responseToClient: ServerResponse,
    routes: Array<Route>
  ): void {
    const unparsedUrl: Optional<string> = requestFromClient.url
    const parsedUrl: ParsedUrl = new ParsedUrl(unparsedUrl)
    const content = this.getContentFromRoute(parsedUrl, routes)
    responseToClient.setHeader("Content-Type", content.type)
    responseToClient.write(content.payload)
    responseToClient.end()
  }

  private getContentFromRoute(parsedUrl: ParsedUrl, routes: Array<Route>): Content {
    const matchingRoute: Optional<Route> = routes.find(
      (it: Route) => it.pathname === parsedUrl.pathname
    )
    return matchingRoute?.generateContentFn(parsedUrl.query) ?? noRouteFoundContentFn()
  }
}

class ParsedUrl {
  // Constants.
  static readonly EmptyPath: string = ""
  static readonly EmptyQuery: {} = {}

  // Properties.
  readonly pathname: string
  readonly query: ParsedUrlQuery

  constructor(unparsedUrl: Optional<string>) {
    if (_.isNil(unparsedUrl)) {
      this.pathname = ParsedUrl.EmptyPath
      this.query = ParsedUrl.EmptyQuery
    } else {
      const urlWithParsedQuery: UrlWithParsedQuery = url.parse(unparsedUrl, true)
      this.pathname = urlWithParsedQuery.pathname ?? ParsedUrl.EmptyPath
      this.query = urlWithParsedQuery.query
    }
  }
}

new RunHttpServer().start()
