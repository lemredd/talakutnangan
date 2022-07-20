import { shallowMount, VueWrapper } from "@vue/test-utils"
import RequestEnvironment from "$/helpers/request_environment"
import Page from "./create.page.vue"

describe("Page: /department/create", () => {
	it("can create department", async () => {
		fetchMock.mockResponseOnce("{}", { status: RequestEnvironment.status.NO_CONTENT })
		const wrapper = shallowMount(Page, {
			global: {
				provide: {
					pageContext: {}
				}
			}
		})
		const fullName = wrapper.find("#full-name")
		const acronym = wrapper.find("#acronym")
		const mayAdmit = wrapper.find("#may-admit")
		const submit = wrapper.find("input[type=submit]")

		await fullName.setValue("Hello World")
		await acronym.setValue("HW")
		await mayAdmit.setValue(true)
		await submit.trigger("submit")
		const request = (fetch as jest.Mock<any, any>).mock.calls[0][0]
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/department/create")
		expect(request.json()).resolves.toStrictEqual({
			data: {
				type: "department",
				attributes: {
					fullName: "Hello World",
					acronym: "HW",
					mayAdmit: true
				}
			}
		})
	})
})
