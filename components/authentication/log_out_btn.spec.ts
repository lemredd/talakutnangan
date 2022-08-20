/* eslint-disable no-undef */
import { mount } from "@vue/test-utils"

import LogOutBtn from "@/authentication/log_out_btn.vue"
import RequestEnvironment from "$/helpers/request_environment"

describe("Component: Log Out Button", () => {
	it("should log out", async() => {
		fetchMock.mockResponse(
			JSON.stringify({}),
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)

		const logOutBtn = mount(LogOutBtn).find("#log-out-btn")
		await logOutBtn.trigger("click")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/user/log_out")
	})
})
