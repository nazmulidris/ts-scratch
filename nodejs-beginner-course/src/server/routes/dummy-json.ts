import {ContentGeneratorFnType, Route, ValidContentTypes} from "../types"
import {getHumanReadableDate} from "../utils"

export class DummyJson implements Route {
  pathname: string = `/${DummyJson.name}`
  counter: number = 0
  
  generateContentFn: ContentGeneratorFnType = (queryParams?) => {
    this.counter++
    console.log(`\n\n👉 #${this.counter}: processHttpRequest(): ${getHumanReadableDate()} got request FROM client`)
    const jsonText = JSON.stringify(queryParams)
    console.log(`👈 #${this.counter}: processHttpRequest(): ${getHumanReadableDate()} sent data back TO client`)
    return {payload: jsonText, type: ValidContentTypes.JSON}
  }
}
