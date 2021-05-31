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

export class ConsoleLog {
  private readonly myStyle: Chalk
  private myText: string = ""

  constructor(style: Chalk) {
    this.myStyle = style
  }

  apply = (text: string): ConsoleLog => {
    this.myText = text
    return this
  }

  consoleLog = () => {
    console.log(this.toString())
  }
  
  consoleError = () => {
    console.error(this.toString())
  }

  toString = () => this.myStyle(this.myText)
}

export const textStyle1 = chalk.bold.yellow.bgBlack
export const textStyle2 = chalk.underline.cyan.bgGray

export const textStylerPrimary = new ConsoleLog(chalk.bold.yellow.bgBlack)
export const textStylerSecondary = new ConsoleLog(chalk.underline.cyan.bgGray)
