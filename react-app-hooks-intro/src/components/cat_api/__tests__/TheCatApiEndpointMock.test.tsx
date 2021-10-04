import { SetupServerApi } from "msw/node"
import axios from "axios"
import { _let } from "r3bl-ts-utils"
import { CatApiComponent, TheCatApi } from "../CatApiComponent"
import { restHandlerSearchError, restHandlerSearchOk, setupAndTeardown } from "./TestUtils"
import { prettyDOM, render, screen, waitFor } from "@testing-library/react"
import SearchResults = TheCatApi.SearchResults

/**
 * More info:
 * - https://github.com/mswjs/msw
 * - https://dev.to/kettanaito/type-safe-api-mocking-with-mock-service-worker-and-typescript-21bf
 */

const server: SetupServerApi = setupAndTeardown()

describe("Mocked TheCatApi REST API ⤵", () => {
  async function makeGetRequest() {
    return _let(TheCatApi.search, async (it) => {
      axios.defaults.headers.common["x-api-key"] = TheCatApi.apiKey
      const { data: payload } = await axios.get<SearchResults[]>(it.host + it.endpoint, it.config)
      return payload
    })
  }

  // Test the mocked endpoint for OK result.
  test("search endpoint works as expected", async () => {
    server.use(restHandlerSearchOk)
    expect(await makeGetRequest()).toHaveLength(3)
  })

  // Test the mocked endpoint for Error result.
  // More info: https://stackoverflow.com/a/47887098/2085356
  test("search endpoint fails as expected", async () => {
    server.use(restHandlerSearchError)
    await expect(makeGetRequest()).rejects.toThrow(Error)
  })
})

describe("CatApiComponent works as expected ⤵", () => {
  test("Component renders results with API happy path", async () => {
    server.use(restHandlerSearchOk)
    render(<CatApiComponent.FC />)
    await waitFor(() => screen.getByRole("list"))
    console.log(prettyDOM(screen.getByRole("list")))
    expect(screen.getAllByRole("listitem").length).toBe(3)
  })

  test("Component renders error state with API unhappy path", async () => {
    server.use(restHandlerSearchError)
    render(<CatApiComponent.FC />)
    await waitFor(() => screen.getByTestId(CatApiComponent.TestIds.fetchError))
    console.log(prettyDOM(screen.getByTestId(CatApiComponent.TestIds.fetchError)))
    expect(screen.getByRole("heading")).toHaveTextContent(
      "Error: Request failed with status code 500"
    )
  })
})
