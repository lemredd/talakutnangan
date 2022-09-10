/* eslint-disable no-undef */
import type { UnitError } from "$/types/server"

import UserFetcher from "$@/fetchers/user"
import RequestEnvironment from "$/singletons/request_environment"

describe("Communicator: UserFetcher", () => {
	it("can log in", async() => {
		fetchMock.mockResponse(
			JSON.stringify({
				"data": null,
				"meta": {
					"redirectURL": "http://localhost"
				}
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
			JSON.stringify({}),
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)

		const fetcher = new UserFetcher()
		const response = await fetcher.logOut()
		expect(response).toHaveProperty("body", null)
		expect(response).toHaveProperty("status", RequestEnvironment.status.NO_CONTENT)
	})

	it("should not log out if user is not authenticated", async() => {
		fetchMock.mockResponse(
			JSON.stringify({
				"errors": [
					{
						"code": "1",
						"detail": "The user must be logged in to invoke the action.",
						"status": RequestEnvironment.status.UNAUTHORIZED,
						"title": "Authorization Error"
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

	it("should import", async() => {
		fetchMock.mockResponse(
			JSON.stringify({
				"data": [
					{
						"attributes": {
							"name": "admin@example.com"
						},
						"id": "1",
						"type": "user"
					}
				]
			}),
			{ "status": RequestEnvironment.status.CREATED }
		)
		const fetcher = new UserFetcher()

		const response = await fetcher.import({} as FormData)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/import")
		const { body } = response
		expect(body).toStrictEqual({
			"data": [
				{
					"id": "1",
					"name": "admin@example.com",
					"type": "user"
				}
			]
		})
	})
})
