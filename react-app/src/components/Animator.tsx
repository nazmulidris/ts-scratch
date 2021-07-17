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

export class Animator {
  public timerId: NodeJS.Timeout | null = null

  constructor(readonly delayMs: number, readonly tickFn: AnimatorTickFn, readonly name?: string) {}

  get isStarted(): boolean {
    return !!this.timerId
  }

  start = () => {
    console.log(this.name ?? "Animator", "start called, timerId = ", this.timerId)

    if (this.isStarted) throw new Error(AnimatorErrorTypes.TimerAlreadyStarted)

    this.timerId = setInterval(() => {
      this.tickFn(this)
    }, this.delayMs)
    console.log(this.name ?? "Animator", "started, timerId = ", this.timerId)
  }

  stop = () => {
    console.log(this.name ?? "Animator", "stop called, timerId = ", this.timerId)

    if (!this.isStarted) throw new Error(AnimatorErrorTypes.TimerNotStarted)

    clearInterval(this.timerId!!)
    this.timerId = null
    console.log(this.name ?? "Animator", "stopped, timerId = ", this.timerId)
  }
}

export type AnimatorTickFn = (animator: Animator) => void

export const AnimatorErrorTypes = {
  TimerAlreadyStarted: "Animator has already been started, can't restart it until after it stops",
  TimerNotStarted: "Animator has not been started, can't be stopped",
} as const
