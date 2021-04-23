import { Content, ProcessRequestFunc, Route, ValidContentTypes } from "../types";
import { getHumanReadableDate } from "../utils";

export class DummyJson implements Route {
  pathname: string = "/dummy-json";
  counter: number = 0;

  func: ProcessRequestFunc = (query: Object): Content => {
    this.counter++;
    console.log(`\n\n👉 #${this.counter}: processHttpRequest(): ${getHumanReadableDate()} got request FROM client`);
    const jsonText = JSON.stringify(query);
    console.log(`👈 #${this.counter}: processHttpRequest(): ${getHumanReadableDate()} sent data back TO client`);
    return { payload: jsonText, type: ValidContentTypes.JSON };
  };
}
