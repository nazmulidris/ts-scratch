import {Route} from "../types"
import {DummyHtml} from "./dummy-html"
import {DummyJson} from "./dummy-json"
import {Echo} from "./echo"

const myRoutes: Array<Route> = [new DummyHtml(), new DummyJson(), new Echo()]

export {myRoutes}
