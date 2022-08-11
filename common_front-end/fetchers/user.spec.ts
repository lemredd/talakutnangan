import RequestEnvironment from "$/helpers/request_environment"
import UserFetcher from "./user"

describe("Communicator: UserFetcher", () => {
	it("can log in", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"meta": {
					"redirectURL": "http://localhost"
				},
				"data": null
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const fetcher = new UserFetcher()
		const response = await fetcher.logIn({
			"email": "sample@example.com",
			"password": "1234"
		})

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_in")
		expect(request.json()).resolves.toStrictEqual({
			"email": "sample@example.com",
			"password": "1234"
		})
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty("body.data", null)
		expect(response).toHaveProperty("body.meta.redirectURL", "http://localhost")
	})
})
