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

import { MessagePropsWithChildren } from "../types"
import styles from "../../styles/App.module.css"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { _let } from "r3bl-ts-utils"

export const TestIdWindowSize = "test-id-window-size"

const setWindowSize = (
  setWidth: Dispatch<SetStateAction<number>>,
  setHeight: Dispatch<SetStateAction<number>>
) => {
  setWidth(window.innerWidth)
  setHeight(window.innerHeight)
}

type SizeStateHookType = [number, Dispatch<SetStateAction<number>>]

export const ComponentWithoutState = (props: MessagePropsWithChildren) => {
  const [width, setWidth]: SizeStateHookType = useState(0)
  const [height, setHeight]: SizeStateHookType = useState(0)

  useEffect(
    () =>
      _let(
        (event: UIEvent) => setWindowSize(setWidth, setHeight),
        (it) => {
          window.addEventListener("resize", it)
          return () => window.removeEventListener("resize", it)
        }
      ),
    [] /* Run once, like componentDidMount. */
  )

  useEffect(() => setWindowSize(setWidth, setHeight), [] /* Run once, like componentDidMount. */)

  const render = () => (
    <section className={styles.Container}>
      <code>{props.message}</code>
      {props.children}
      <div data-testid={TestIdWindowSize}>{`${width} x ${height}`}</div>
    </section>
  )

  return render()
}
