import { v4 } from "uuid"
import { flushPromises, shallowMount } from "@vue/test-utils"

import Stub from "$/singletons/stub"
import type { UnitError } from "$/types/server"

import Component from "@/authentication/log_in_form.vue"
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

		const wrapper = shallowMount(Component)
		const emailField = wrapper.findComponent({ "name": "TextualField" })
		const passwordField = wrapper.findComponent({ "name": "PasswordField" })
		const submitBtn = wrapper.find(".submit-btn")

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

	it("should show error from authentication-guarded route", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"receivedErrorFromPageContext": {
					"detail": "redirected from authentication-guarded route"
				}
			}
		})
		const error = wrapper.find(".error")
		expect(error.html()).toContain(wrapper.props().receivedErrorFromPageContext.detail)
	})

	it.only("should not log in with non-existing credentials", async() => {
		const errorDetail1
		= "The sample@example.com in field \"email\" does not exists in the database\"."
		const errorDetail2
		= "sample error."
		fetchMock.mockResponse(
			JSON.stringify({
				"errors": [
					{
						"code": "3",
						"detail": errorDetail1,
						"source": {
							"pointer": "email"
						},
						"status": RequestEnvironment.status.BAD_REQUEST,
						"title": "Validation Error"
					},
					{
						"code": "3",
						"detail": errorDetail2,
						"source": {
							"pointer": "email"
						},
						"status": RequestEnvironment.status.BAD_REQUEST,
						"title": "Validation Error"
					}
				] as UnitError[]
			}),
			{ "status": RequestEnvironment.status.BAD_REQUEST })

		const wrapper = shallowMount(Component)

		const submitBtn = wrapper.find(".submit-btn")
		await submitBtn.trigger("click")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_in")
		await flushPromises()

		const error = wrapper.find(".error")
		expect(error.exists()).toBeTruthy()
		expect(error.html()).toContain(errorDetail1)
		expect(error.html()).toContain(errorDetail2)
	})
})
