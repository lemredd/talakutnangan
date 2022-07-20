import RequestEnvironment from "$/helpers/request_environment"
import Fetcher from "./fetcher"

describe("Communicator: Fetcher", () => {
	it("can create resource", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "user", "attributes": {} },
		}),
		{ status: RequestEnvironment.status.OK })

		const response = await Fetcher.create("user", { name: "A" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("url", "/user/create")
	})

	it("can upate resource", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "user", "attributes": {} },
		}),
		{ status: RequestEnvironment.status.OK })

		const response = await Fetcher.update("user", 1, { name: "A" })

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("url", "/user/update/1")
	})

	it("can retrieve JSON from server by GET", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "user", "attributes": {} },
		}), { status: RequestEnvironment.status.OK })

		const response = await Fetcher.getJSON("/api/sample")

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can retrieve JSON from server by POST", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "role", "attributes": {} },
		}), { status: RequestEnvironment.status.OK })

		const response = await Fetcher.getJSON("/api/sample")

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})

	it("can retrieve JSON from server by PATCH", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			data: { type: "department", "attributes": {} },
		}), { status: RequestEnvironment.status.OK })

		const response = await Fetcher.getJSON("/api/sample")

		expect(response).toHaveProperty("body.data")
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
	})
})
