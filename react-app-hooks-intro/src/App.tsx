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

import React, { ReactElement } from "react"
import "./styles/App.css"
import { ComponentWithState } from "./components/ComponentWithState"
import { ComponentWithoutState } from "./components/ComponentWithoutState"
import { ReactReplayFunctionComponent } from "./components/ReactReplayFunctionComponent"
import { _also } from "r3bl-ts-utils"
import { VirtualDomElementGenerator } from "./components/GenerateReactElement"
import { ReactReplayClassComponent } from "./components/ReactReplayClassComponent"
import { AnimationFrames } from "./components/types"

const preGeneratedAnimationFrames: AnimationFrames = _also(
  new Array<ReactElement>(),
  (elementArray) => {
    _also(["Hello", "Tere", "Bonjour", "Olá", "Salve"], (langs) => {
      langs
        .map((lang) => VirtualDomElementGenerator(lang, "R3BL Commander"))
        .forEach((localizedElement) => elementArray.push(localizedElement))
    })
  }
)

function App() {
  return (
    <React.Fragment>
      <h2>Helloooooo!!!!</h2>
      <ComponentWithState message={"Click me to see the count go up"} />
      <ComponentWithoutState message={"Stateless component ⛔ aka 'generic box'"}>
        <h4>This is an unknown child</h4>
      </ComponentWithoutState>
      <ReactReplayClassComponent animationFrames={preGeneratedAnimationFrames} />
      <ReactReplayFunctionComponent animationFrames={preGeneratedAnimationFrames} />
    </React.Fragment>
  )
}

export default App
