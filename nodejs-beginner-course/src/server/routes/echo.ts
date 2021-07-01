import { ContentGeneratorFnType, Route, ValidContentTypes } from "../types"

export class Echo implements Route {
  pathname: string = `/${Echo.name}`

  generateContentFn: ContentGeneratorFnType = (queryParams?) => {
    const queryText = JSON.stringify(queryParams)
    const textToDisplay = `Echo payload will return query key/value pairs to here: ${queryText}`
    return {
      payload: textToDisplay,
      type: ValidContentTypes.Text,
    }
  }
}
