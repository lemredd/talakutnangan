import { v4 } from "uuid"
import { shallowMount } from "@vue/test-utils"

import type { UnitError } from "$/types/server"
import type { GeneralObject } from "$/types/general"

import UserFetcher from "$@/fetchers/user"
import LogInForm from "@/authentication/log_in_form.vue"
import RequestEnvironment from "$/singletons/request_environment"

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

		const wrapper = shallowMount(LogInForm)

		const textualFields = wrapper.findAllComponents({ "name": "TextualField" })
		const [ emailField, passwordField ] = textualFields
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

		const wrapper = shallowMount(LogInForm)

		const submitBtn = wrapper.find("#submit-btn")
		await submitBtn.trigger("click")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_in")

		try {
			const response = new UserFetcher().logIn(await request.json())
			await response
		} catch (response) {
			const castResponse = response as GeneralObject
			const responseErrors = castResponse.body.errors as unknown as UnitError[]
			const { status } = responseErrors[0] as unknown as UnitError
			expect(status).toEqual(RequestEnvironment.status.BAD_REQUEST)
		}
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

		const wrapper = shallowMount(LogInForm)

		const textualFields = wrapper.findAllComponents({ "name": "TextualField" })
		const [ emailField, passwordField ] = textualFields
		const submitBtn = wrapper.find("#submit-btn")

		await emailField.setValue("dean@example.net")
		await passwordField.setValue("password")
		await submitBtn.trigger("click")
		await submitBtn.trigger("click")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_in")

		try {
			const response = new UserFetcher().logIn(await request.json())
			await response
		} catch (response) {
			const castResponse = response as GeneralObject
			const responseErrors = castResponse.body.errors as unknown as UnitError[]
			const { status } = responseErrors[0] as unknown as UnitError
			expect(status).toEqual(RequestEnvironment.status.UNAUTHORIZED)
		}
	})
})
