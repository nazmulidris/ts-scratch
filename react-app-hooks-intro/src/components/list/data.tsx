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

import { Story } from "./types"

const myDefaultStories: Story[] = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: "Typescript",
    url: "https://www.typescriptlang.org/",
    author: "Microsoft",
    num_comments: 6,
    points: 10,
    objectID: 2,
  },
]

export const getAsyncStoriesWithSimulatedNetworkLag = async (): Promise<Story[]> =>
  new Promise<Story[]>((resolve, reject) => {
    const callbackFn = () => {
      resolve(myDefaultStories)
    }
    setTimeout(callbackFn, 1000 + Math.floor(Math.random() * 500))
  })
