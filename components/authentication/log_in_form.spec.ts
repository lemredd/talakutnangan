import { v4 } from "uuid"
import { mount } from "@vue/test-utils"

import type { UnitError } from "$/types/server"

import UserFetcher from "$@/fetchers/user"
import LogInForm from "@/authentication/log_in_form.vue"
import RequestEnvironment from "$/helpers/request_environment"

describe("Component: Log In Form", () => {
	it("should log in with existing credentials", async() => {
		fetchMock.mockResponse(
			JSON.stringify({
				"body": {
					"token": v4()
				},
				"status": 200
			}),
			{ "status": RequestEnvironment.status.OK })

		const wrapper = mount(LogInForm)

		const emailField = wrapper.find("input[type='email']")
		const passwordField = wrapper.find("input[type='password']")
		const submitBtn = wrapper.find("#submit-btn")

		await emailField.setValue("dean@example.net")
		await passwordField.setValue("password")
		await submitBtn.trigger("click")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_in")

		const response = new UserFetcher().logIn(await request.json())
		const responseBody = (await response).body
		const { token } = responseBody.body as { token: string }
		const { status } = responseBody
		expect(responseBody).toHaveProperty("body")
		expect(token).toBeTruthy()
		expect(status).toEqual(200)
	})

	it("should not log in with non-existing credentials", async() => {
		fetchMock.mockResponse(
			JSON.stringify({
				"errors": [
					{
						"status": RequestEnvironment.status.BAD_REQUEST,
						"code": "3",
						"title": "Validation Error",
						// eslint-disable-next-line max-len
						"detail": "The sample@example.com in field \"email\" does not exists in the database\".",
						"source": {
							"pointer": "email"
						}
					}
				] as UnitError[]
			}),
			{ "status": RequestEnvironment.status.BAD_REQUEST })

		const wrapper = mount(LogInForm)

		const submitBtn = wrapper.find("#submit-btn")
		await submitBtn.trigger("click")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_in")

		const response = new UserFetcher().logIn(await request.json())
		const responseErrors = (await response).body.errors as unknown as UnitError[]
		const { status } = responseErrors[0] as unknown as UnitError
		expect(status).toEqual(RequestEnvironment.status.BAD_REQUEST)
	})

	it("should not log in if user is already logged in", async() => {
		fetchMock.mockResponse(
			JSON.stringify({
				"errors": [
					{
						"status": RequestEnvironment.status.UNAUTHORIZED,
						"code": "1",
						"title": "Authorization Error",
						"detail": "The user must be logged out to invoke the action."
					}
				]
			}),
			{ "status": RequestEnvironment.status.UNAUTHORIZED })

		const wrapper = mount(LogInForm)

		const emailField = wrapper.find("input[type='email']")
		const passwordField = wrapper.find("input[type='password']")
		const submitBtn = wrapper.find("#submit-btn")

		await emailField.setValue("dean@example.net")
		await passwordField.setValue("password")
		await submitBtn.trigger("click")
		await submitBtn.trigger("click")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_in")

		const response = new UserFetcher().logIn(await request.json())
		const responseErrors = (await response).body.errors as unknown as UnitError[]
		const { status } = responseErrors[0] as unknown as UnitError
		expect(status).toEqual(RequestEnvironment.status.UNAUTHORIZED)
	})
})
