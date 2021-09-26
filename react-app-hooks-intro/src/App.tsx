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
import styles from "./styles/App.module.css"
import { ComponentWithState } from "./components/basics/ComponentWithState"
import { ComponentWithoutState } from "./components/basics/ComponentWithoutState"
import { ReactReplayFunctionComponent } from "./components/animate/ReactReplayFunctionComponent"
import { _also } from "r3bl-ts-utils"
import { VirtualDomElementGenerator } from "./components/animate/GenerateReactElement"
import { ReactReplayClassComponent } from "./components/animate/ReactReplayClassComponent"
import { AnimationFrames } from "./components/animate/types"
import { ListOfStoriesComponent } from "./components/list/ListOfStoriesComponent"
import { CatApiComponent } from "./components/cat_api/CatApiComponent"
import { SimpleReduxComponent, store } from "./components/redux/SimpleReduxComponent"
import { Provider } from "react-redux"
import { SvgExample } from "./components/svg/SvgExample"

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
    <main className={styles.GridContainer}>
      <section className={styles.Heading}>Helloooooo!!!!</section>
      <ComponentWithState message={"Click me to see the count go up"} />
      <ComponentWithoutState message={"Stateless component ⛔ aka 'generic box'"}>
        <section>
          This is an unknown child passed via <code>props.child</code>
        </section>
      </ComponentWithoutState>
      <ReactReplayClassComponent animationFrames={preGeneratedAnimationFrames} />
      <ReactReplayFunctionComponent animationFrames={preGeneratedAnimationFrames} />
      <ListOfStoriesComponent takeInitialKeyboardFocus={true} />
      <CatApiComponent />
      <Provider store={store}>
        <SimpleReduxComponent />
      </Provider>
      <SvgExample />
    </main>
  )
}

export default App
