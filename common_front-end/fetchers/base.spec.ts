import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { CommonQueryParameters } from "$/types/query"
import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"
import Fetcher from "./base"

describe("Communicator: Fetcher", () => {
	it("can create resource", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {},
					"type": "user"
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.create({ "name": "A" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"attributes": {
					"name": "A"
				},
				"type": "user"
			}
		})
	})

	it("can list all resources", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": [
					{
						"attributes": {},
						"type": "user"
					}
				]
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const queryObject: CommonQueryParameters = {
			"filter": {
				"existence": "exists"
			},
			"page": {
				"limit": 5,
				"offset": 0
			},
			"sort": [ "id", "name" ]
		}
		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.list(queryObject)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", `/api/user?${stringifyQuery({
			...queryObject,
			"sort": queryObject.sort.join(",")
		})}`)
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(response).toHaveProperty("body.data.0.type")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can update resource", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {},
					"type": "user"
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.update("1", { "name": "A" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/user/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"attributes": {
					"name": "A"
				},
				"id": "1",
				"type": "user"
			}
		})
	})

	it("can archive resource", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {},
					"type": "user"
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.archive([ "1" ])

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "DELETE")
		expect(request).toHaveProperty("url", "/api/user")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			"data": [
				{
					"id": "1",
					"type": "user"
				}
			]
		})
	})

	it("can restore resource", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {},
					"type": "user"
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.restore([ "2" ])

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/user")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			"data": [
				{
					"id": "2",
					"type": "user"
				}
			]
		})
	})

	it("can retrieve JSON from server by GET", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {},
				"type": "user"
			}
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.getJSON("sample")

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", "/api/sample")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("can retrieve JSON from server by POST", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {},
				"type": "role"
			}
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.postJSON("sample", { "hello": "world" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/sample")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({ "hello": "world" })
	})

	it("can retrieve JSON from server by PATCH", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {},
				"type": "department"
			}
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.patchJSON("sample/:id", { "id": "1" }, { "hello": "world" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/sample/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({ "hello": "world" })
	})

	it("can retrieve JSON from server by DELETE", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {},
				"type": "department"
			}
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.deleteJSON("sample/:id", { "id": "1" }, { "hello": "world" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "DELETE")
		expect(request).toHaveProperty("url", "/api/sample/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(await request.json()).toStrictEqual({ "hello": "world" })
	})

	it("can have null body if server replied with no content", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.postJSON("sample", { "hello": "world" })

		expect(response).toHaveProperty("body", null)
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})

	it("can retrieve JSON from server by GET manually", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {},
				"type": "user"
			}
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.getFrom("sample")

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", "/api/sample")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("can retrieve JSON from server by POST manually", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {},
				"type": "role"
			}
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.postTo("sample", JSON.stringify({ "hello": "world" }))

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/sample")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({ "hello": "world" })
	})

	it("can retrieve JSON from server by PATCH manually", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {},
				"type": "department"
			}
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.patchThrough("sample/1", JSON.stringify({ "hello": "world" }))

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/sample/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({ "hello": "world" })
	})

	it("can retrieve JSON from server by DELETE manually", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"attributes": {},
				"type": "department"
			}
		}), { "status": RequestEnvironment.status.OK })

		const fetcher = new Fetcher("/api", "user")
		const response = await fetcher.deleteThrough("sample/1", JSON.stringify({ "hello": "world" }))

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "DELETE")
		expect(request).toHaveProperty("url", "/api/sample/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({ "hello": "world" })
	})
})
