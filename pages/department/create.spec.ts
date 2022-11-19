import { shallowMount } from "@vue/test-utils"
import RequestEnvironment from "$/singletons/request_environment"

import Page from "./create.page.vue"

describe("Page: /department", () => {
	it("can create department", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const wrapper = shallowMount(Page, {
			"global": {
				"provide": {
					"pageContext": {}
				}
			}
		})
		const fullName = wrapper.findComponent("#full-name")
		const acronym = wrapper.findComponent("#acronym")
		const mayAdmit = wrapper.find("#may-admit")
		const submit = wrapper.find("input[type=submit]")

		await fullName.setValue("Hello World")
		await acronym.setValue("HW")
		await mayAdmit.setValue(true)
		await submit.trigger("submit")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/department")
		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"type": "department",
				"attributes": {
					"fullName": "Hello World",
					"acronym": "HW",
					"mayAdmit": true
				}
			}
		})
	})
})
