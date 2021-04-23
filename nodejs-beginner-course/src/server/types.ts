interface Route {
  pathname: string;
  func: ProcessRequestFunc;
}

interface ProcessRequestFunc {
  (queryParams: Object): Content;
}

interface Content {
  payload: string;
  type: ValidContentTypes;
}

enum ValidContentTypes {
  Text = "text/plain",
  JSON = "application/json",
  HTML = "text/html",
}

export { ProcessRequestFunc, Content, Route, ValidContentTypes };
