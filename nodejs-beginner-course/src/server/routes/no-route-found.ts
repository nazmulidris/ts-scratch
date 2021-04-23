import { Content, ProcessRequestFunc, ValidContentTypes } from "../types";

const noRouteFoundFunction: ProcessRequestFunc = (query: Object): Content => {
  return {
    payload: "Error - No route found!",
    type: ValidContentTypes.Text,
  };
};
export { noRouteFoundFunction };
