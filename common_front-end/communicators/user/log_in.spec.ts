import RequestEnvironment from "$/helpers/request_environment"
import logIn from "./log_in"

describe("Communicator: Log in", () => {
	it("can log in", async () => {
		fetchMock.mockResponseOnce(JSON.stringify({
			meta: {
				redirectURL: "http://localhost"
			},
			data: null
		}),
		{ status: RequestEnvironment.status.OK })

		const response = await logIn({ email: "sample@example.com", password: "1234" })

		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_in")
		expect(request.json()).resolves.toStrictEqual({
			email: "sample@example.com",
			password: "1234"
		})
		expect(response).toHaveProperty("status", RequestEnvironment.status.OK)
		expect(response).toHaveProperty("body.data", null)
		expect(response).toHaveProperty("body.meta.redirectURL", "http://localhost")
	})
})
