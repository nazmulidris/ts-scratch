import { ContentGeneratorFnType, ValidContentTypes } from "../types"

const noRouteFoundContentFn: ContentGeneratorFnType = () => {
  return {
    payload: "No route found!",
    type: ValidContentTypes.Text,
  }
}
export { noRouteFoundContentFn }
