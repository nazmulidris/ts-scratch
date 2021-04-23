import { Content, ProcessRequestFunc, Route, ValidContentTypes } from "../types";

export class Echo implements Route {
  pathname: string = "/echo";

  func: ProcessRequestFunc = (query: Object): Content => {
    const queryText = JSON.stringify(query);
    const textToDisplay = `Echo payload will return query key/value pairs to here: ${queryText}`;
    return {
      payload: textToDisplay,
      type: ValidContentTypes.Text,
    };
  };
}
