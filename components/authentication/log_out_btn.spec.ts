import { mount } from "@vue/test-utils"

import Stub from "$/helpers/singletons/stub"
import RequestEnvironment from "$/helpers/request_environment"
import Component from "./log_out_btn.vue"

describe("Component: Log Out Button", () => {
	it("should log out", async() => {
		fetchMock.mockResponse(
			JSON.stringify({}),
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)

		const logOutBtn = mount(Component).find("#log-out-btn")
		await logOutBtn.trigger("click")

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
