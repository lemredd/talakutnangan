import { shallowMount, flushPromises } from "@vue/test-utils"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"
import Component from "./log_out_btn.vue"

describe("Component: Log Out Button", () => {
	it("should log out", async() => {
		fetchMock.mockResponse(
			JSON.stringify({}),
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)

		const logOutBtn = shallowMount(Component).find("#log-out-btn")
		await logOutBtn.trigger("click")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_out")

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments.0", "/user/log_in")
		expect(previousCalls).not.toHaveProperty("0.arguments.1")
	})
})
