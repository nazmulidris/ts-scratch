import { ParsedUrlQuery } from "querystring"

export type ContentGeneratorFnType = (queryParams?: ParsedUrlQuery) => Content

export interface Route {
  pathname: string
  generateContentFn: ContentGeneratorFnType
}

export enum ValidContentTypes {
  Text = "text/plain",
  JSON = "application/json",
  HTML = "text/html",
}

export interface Content {
  payload: string
  type: ValidContentTypes
}

export type Optional<T> = T | undefined | null
