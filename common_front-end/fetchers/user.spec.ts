import { v4 } from "uuid"

import type { UnitError } from "$/types/server"

import UserFetcher from "$@/fetchers/user"
import RequestEnvironment from "$/helpers/request_environment"

describe("Communicator: UserFetcher", () => {
	it("can log in", async() => {
		fetchMock.mockResponse(
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

	it("can log out", async() => {
		fetchMock.mockResponse(
			JSON.stringify({
				"body": {
					"token": v4()
				},
				"status": 200
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		const fetcher = new UserFetcher()
		await fetcher.logIn({
			"email": "sample@example.com",
			"password": "1234"
		})

		fetchMock.mockResponse(
			JSON.stringify({}),
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)
		const response = await fetcher.logOut()
		expect(response).toHaveProperty("body", null)
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})
	it("should not log out if user is not authenticated", async() => {
		fetchMock.mockResponse(
			JSON.stringify({
				"errors": [
					{
						"status": RequestEnvironment.status.UNAUTHORIZED,
						"code": "1",
						"title": "Authorization Error",
						"detail": "The user must be logged in to invoke the action."
					}
				] as UnitError[]
			}),
			{ "status": RequestEnvironment.status.UNAUTHORIZED }
		)
		const fetcher = new UserFetcher()

		const response = await fetcher.logOut()
		const { body } = response
		expect(body).toHaveProperty("errors")
		expect(response).toHaveProperty("status", RequestEnvironment.status.UNAUTHORIZED)
	})
})
