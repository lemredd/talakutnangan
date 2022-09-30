import { v4 } from "uuid"
import { flushPromises, shallowMount } from "@vue/test-utils"

import Stub from "$/singletons/stub"
import type { UnitError } from "$/types/server"
import type { GeneralObject } from "$/types/general"

import UserFetcher from "$@/fetchers/user"
import Component from "@/authentication/log_in_form.vue"
import RequestEnvironment from "$/singletons/request_environment"


describe("Component: Log In Form", () => {
	describe("general features", () => {
		it("should log in with existing credentials", async() => {
			fetchMock.mockResponse(
				JSON.stringify({
					"body": {
						"token": v4()
					},
					"status": 200
				}),
				{ "status": RequestEnvironment.status.OK })

			const wrapper = shallowMount(Component)

			const emailField = wrapper.findComponent({ "name": "TextualField" })
			const passwordField = wrapper.findComponent({ "name": "PasswordField" })
			const submitBtn = wrapper.find("#submit-btn")

			await emailField.setValue("dean@example.net")
			await passwordField.setValue("password")
			await submitBtn.trigger("click")
			await flushPromises()

			const castFetch = fetch as jest.Mock<any, any>
			const [ [ request ] ] = castFetch.mock.calls
			expect(request).toHaveProperty("method", "POST")
			expect(request).toHaveProperty("url", "/api/user/log_in")

			const previousCalls = Stub.consumePreviousCalls()
			expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
			expect(previousCalls).toHaveProperty("0.arguments.0", "/")
			expect(previousCalls).not.toHaveProperty("0.arguments.1")
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

			const wrapper = shallowMount(Component)

			const submitBtn = wrapper.find("#submit-btn")
			await submitBtn.trigger("click")

			const castFetch = fetch as jest.Mock<any, any>
			const [ [ request ] ] = castFetch.mock.calls
			expect(request).toHaveProperty("method", "POST")
			expect(request).toHaveProperty("url", "/api/user/log_in")
			await flushPromises()

			const error = wrapper.find(".error")
			console.log(error.html())
		})

		it.only("should not log in with non-existing credentials", async() => {
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

			const wrapper = shallowMount(Component)

			const submitBtn = wrapper.find("#submit-btn")
			await submitBtn.trigger("click")

			const castFetch = fetch as jest.Mock<any, any>
			const [ [ request ] ] = castFetch.mock.calls
			expect(request).toHaveProperty("method", "POST")
			expect(request).toHaveProperty("url", "/api/user/log_in")
			await flushPromises()


			const error = wrapper.find(".error")
			const errorDetails
			= "The sample@example.com in field \"email\" does not exists in the database\"."
			console.log(errorDetails, "\n\n\n\n")
			expect(error.exists()).toBeTruthy()
			expect(error.html()).toContain(errorDetails)
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

			const wrapper = shallowMount(Component)

			const emailField = wrapper.findComponent({ "name": "TextualField" })
			const passwordField = wrapper.findComponent({ "name": "PasswordField" })
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
	describe("development mode features", () => {
		it("should fill details according to selected role", async() => {
			let role = ""
			const wrapper = shallowMount<any>(Component)
			const emailField = wrapper.findComponent({ "name": "TextualField" })
			const passwordField = wrapper.findComponent({ "name": "PasswordField" })
			const roleSelector = wrapper.findComponent({ "name": "RoleSelector" })

			role = "student"
			await roleSelector.setValue(role)
			expect(emailField.attributes("modelvalue")).toBe(`${role}@example.net`)
			expect(passwordField.attributes("modelvalue")).toBe("password")
		})
	})
})
