import * as _kt from "./kotlin-lang-utils"
import * as chalk from "chalk"
import { Chalk } from "chalk"

const maxWidth = 100 / 3
const defaultRepeatChar = "-"
const regExForDefaultRepeatChar = new RegExp(defaultRepeatChar, "g")
const defaultShortLeftRepeatChar = ">"
const defaultShortRightRepeatChar = "<"
const padding = 2
const defaultPostFix = ""
const spaceChar = " "

const getHeaderLine = (message: string, repeat: string): string =>
  repeat.repeat(message.length + padding)

export const printHeader = (message: string, postFix = defaultPostFix) => {
  const isTooWide = message.length > maxWidth ? "\n" : ""

  const spans = _kt._also(new Array<string>(3), (spans) => {
    const headerLine = getHeaderLine(message, defaultRepeatChar)
    const headerLineUnderscores = headerLine.replace(regExForDefaultRepeatChar, spaceChar)

    let headerLeft, headerRight
    if (isTooWide) {
      headerLeft = textStyleHeaderUnderline(headerLineUnderscores)
      headerRight = textStyleHeaderUnderline(headerLineUnderscores)
    } else {
      headerLeft = textStyleHeaderUnderline(getHeaderLine(message, defaultShortLeftRepeatChar))
      headerRight = textStyleHeader(getHeaderLine(message, defaultShortRightRepeatChar))
    }

    spans[0] = headerLeft
    spans[1] = textStyleHeaderBody(`${spaceChar}${message}${spaceChar}`)
    spans[2] = headerRight
  })

  const output = spans.join(isTooWide ? "\n" : "")

  console.log(output + postFix)
}

const textStyleHeaderUnderline = chalk.underline.black.bgWhiteBright
const textStyleHeader = chalk.black.bgWhiteBright
const textStyleHeaderBody = chalk.bold.black.bgYellow

export interface ColorConsoleIF {
  (text: string): ColorConsole
  call(text: string): ColorConsole
  apply(text: string): ColorConsole
  consoleLog(): void
  consoleError(): void
  toString(): string
}

export class ColorConsole {
  private readonly myStyle: Chalk
  private myText: string = ""

  static create(style: Chalk): ColorConsoleIF {
    const instance = new ColorConsole(style)
    return Object.assign((text: string) => instance.call(text))
  }

  constructor(style: Chalk) {
    this.myStyle = style
  }

  call = (text: string): ColorConsole => this.apply(text)

  apply = (text: string): ColorConsole => {
    this.myText = text
    return this
  }

  consoleLog = (prefixWithNewline: boolean = false): void => {
    prefixWithNewline ? console.log() : null
    console.log(this.toString())
  }

  // https://gist.githubusercontent.com/narenaryan/a2f4f8a3559d49ee2380aa17e7dc1dea/raw/d777cf7fad282d6bf1b00a0ec474e6430151b07f/streams_copy_basic.js
  consoleLogInPlace = (printNewline: boolean = false): void => {
    process.stdout.clearLine(-1)
    process.stdout.cursorTo(0)
    process.stdout.write(textStyle1.red(this.toString()))
    printNewline ? process.stdout.write("\n") : null
  }

  consoleError = (): void => {
    console.error(this.toString())
  }

  toString = (): string => this.myStyle(this.myText)
}

export const textStyle1 = chalk.bold.yellow.bgBlack
export const textStyle2 = chalk.underline.cyan.bgGray

export const textStylerPrimary = new ColorConsole(chalk.bold.yellow.bgBlack)
export const textStylerSecondary = new ColorConsole(chalk.underline.cyan.bgGray)
