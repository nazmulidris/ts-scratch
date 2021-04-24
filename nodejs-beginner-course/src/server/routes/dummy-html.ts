import {ContentGeneratorFnType, Route, ValidContentTypes} from "../types"
import {getHumanReadableDate} from "../utils"

export class DummyHtml implements Route {
  pathname: string = `/${DummyHtml.name}`
  counter: number = 0
  
  generateContentFn: ContentGeneratorFnType = (queryParams?) => {
    this.counter++
    console.log(`\n\n👉 #${this.counter}: processHttpRequest(): ${getHumanReadableDate()} got request FROM client`)
    const htmlText = `<html>
    <title>Server Response</title>
    <h1>${getHumanReadableDate()}</h1>
    <ul>
      <li>Query parameters object = ${JSON.stringify(queryParams)}</li>
    </ul>
  </html>`
    console.log(`👈 #${this.counter}: processHttpRequest(): ${getHumanReadableDate()} sent data back TO client`)
    return {payload: htmlText, type: ValidContentTypes.HTML}
  }
}
