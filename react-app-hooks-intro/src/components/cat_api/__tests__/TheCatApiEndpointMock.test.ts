import {
  DefaultRequestBody,
  RequestParams,
  ResponseComposition,
  rest,
  RestContext,
  RestHandler,
  RestRequest,
} from "msw"
import { setupServer, SetupServerApi } from "msw/node"
import axios from "axios"
import { _let } from "r3bl-ts-utils"
import { TheCatApi } from "../CatApiComponent"

// More info:
// https://github.com/mswjs/msw
// https://dev.to/kettanaito/type-safe-api-mocking-with-mock-service-worker-and-typescript-21bf

// TheCatApi canned responses.
const cannedResponseOk = [
  {
    breeds: [],
    categories: [],
    id: "jK5X2xGJ7",
    url: "https://cdn2.thecatapi.com/images/jK5X2xGJ7.jpg",
  },
  {
    breeds: [],
    categories: [],
    id: "9c6",
    url: "https://cdn2.thecatapi.com/images/9c6.jpg",
  },
  {
    breeds: [],
    categories: [],
    id: "ab8",
    url: "https://cdn2.thecatapi.com/images/ab8.jpg",
  },
]

// Setup & teardown.
const server: SetupServerApi = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock the REST API w/ handlers.
// More info: https://mswjs.io/docs/getting-started/mocks/rest-api
const restHandlerSearchOk: RestHandler = rest.get(
  TheCatApi.search.host + TheCatApi.search.endpoint,
  (
    req: RestRequest<DefaultRequestBody, RequestParams>,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    console.log("restHandlerSearchOk.req", req)
    // console.log("req.url.searchParams", req.url.searchParams)
    // console.log("req.params", req.params)
    return res(ctx.json(cannedResponseOk))
  }
)

describe("Mocked TheCatApi tests", () => {
  const makeGetRequest: () => Promise<any> = async () =>
    _let(TheCatApi.search, async (it) => {
      axios.defaults.headers.common["x-api-key"] = TheCatApi.apiKey
      const { data: payload } = await axios.get(it.host + it.endpoint, it.config)
      return payload
    })

  // Test the mocked endpoint for OK result.
  test("TheCatApi endpoint works as expected", async () => {
    server.use(restHandlerSearchOk)
    expect(await makeGetRequest()).toHaveLength(3)
  })

  const restHandlerSearchError: RestHandler = rest.get(
    TheCatApi.search.host + TheCatApi.search.endpoint,
    (
      req: RestRequest<DefaultRequestBody, RequestParams>,
      res: ResponseComposition,
      ctx: RestContext
    ) => {
      console.log("restHandlerSearchError.req", req)
      // console.log("req.url.searchParams", req.url.searchParams)
      // console.log("req.params", req.params)
      return res(ctx.status(500))
    }
  )

  // Test the mocked endpoint for Error result.
  // More info: https://stackoverflow.com/a/47887098/2085356
  test("TheCatApi endpoint fails as expected", async () => {
    server.use(restHandlerSearchError)
    await expect(makeGetRequest()).rejects.toThrow(Error)
  })
})
