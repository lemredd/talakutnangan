import RequestEnvironment from "$/helpers/request_environment"
import { JSON_API_MEDIA_TYPE } from "$/types/server"
import Fetcher from "./fetcher"

describe("Communicator: Fetcher", () => {
	it("can create resource", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "user", "attributes": {} },
		}),
		{ status: RequestEnvironment.status.OK })

		Fetcher.initialize("/api", "user")
		const response = await Fetcher.create({ name: "A" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/create")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			data: {
				type: "user",
				attributes: {
					name: "A"
				}
			}
		})
	})

	it("can update resource", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "user", "attributes": {} },
		}),
		{ status: RequestEnvironment.status.OK })

		Fetcher.initialize("/api", "user")
		const response = await Fetcher.update(1, { name: "A" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/user/update/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			data: {
				type: "user",
				id: 1,
				attributes: {
					name: "A"
				}
			}
		})
	})

	it("can archive resource", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "user", "attributes": {} },
		}),
		{ status: RequestEnvironment.status.OK })

		Fetcher.initialize("/api", "user")
		const response = await Fetcher.archive([ 1 ])

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "DELETE")
		expect(request).toHaveProperty("url", "/api/user/archive")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			data: [
				{ type: "user", id: 1 }
			]
		})
	})

	it("can restore resource", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "user", "attributes": {} },
		}),
		{ status: RequestEnvironment.status.OK })

		Fetcher.initialize("/api", "user")
		const response = await Fetcher.restore([ 2 ])

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/user/restore")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({
			data: [
				{ type: "user", id: 2 }
			]
		})
	})

	it("can retrieve JSON from server by GET", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "user", "attributes": {} },
		}), { status: RequestEnvironment.status.OK })

		const response = await Fetcher.getJSON("sample")

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", "/api/sample")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("can retrieve JSON from server by POST", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "role", "attributes": {} },
		}), { status: RequestEnvironment.status.OK })

		const response = await Fetcher.postJSON("sample", { hello: "world" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/sample")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({ hello: "world" })
	})

	it("can retrieve JSON from server by PATCH", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "department", "attributes": {} },
		}), { status: RequestEnvironment.status.OK })

		const response = await Fetcher.patchJSON("sample/:id", { id: 1 }, { hello: "world" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/sample/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({ hello: "world" })
	})

	it("can retrieve JSON from server by DELETE", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "department", "attributes": {} },
		}), { status: RequestEnvironment.status.OK })

		const response = await Fetcher.deleteJSON("sample/:id", { id: 1 }, { hello: "world" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "DELETE")
		expect(request).toHaveProperty("url", "/api/sample/1")
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.json()).resolves.toStrictEqual({ hello: "world" })
	})
})
