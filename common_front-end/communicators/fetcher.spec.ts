import RequestEnvironment from "$/helpers/request_environment"
import Fetcher from "./fetcher"

describe("Communicator: Fetcher", () => {
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
})
