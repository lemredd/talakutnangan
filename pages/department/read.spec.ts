import RequestEnvironment from "$/singletons/request_environment"
import { mount } from "@vue/test-utils"

import Page from "./read.page.vue"

describe("Page: department/read", () => {
	it("Should populate fields with pre-loaded data", () => {
		const department = {
			"data": {
				"acronym": "STD",
				"fullName": "Sample Test Department",
				"mayAdmit": false
			}
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							department
						}
					}
				}
			}
		})
		const castedWrapper = wrapper.vm as any
		const fullNameInput = wrapper.find(".full-name").element as HTMLInputElement
		const acronymInput = wrapper.find(".acronym").element as HTMLInputElement
		// Checkbox value always returns "on". ensure the page's interal data instead
		const { mayAdmit } = castedWrapper.department.data

		expect(fullNameInput.value).toEqual(department.data.fullName)
		expect(acronymInput.value).toEqual(department.data.acronym)
		expect(mayAdmit).toEqual(department.data.mayAdmit)
	})

	it("can update department information", () => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
	})
})
