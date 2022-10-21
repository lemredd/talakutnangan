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
		const fullNameInput = wrapper.find("input.full-name").element as HTMLInputElement
		const acronymInput = wrapper.find(".acronym").element as HTMLInputElement
		const mayAdmitInput = wrapper.find(".may-admit").element as HTMLInputElement

		expect(fullNameInput.value).toEqual(department.data.fullName)
		expect(acronymInput.value).toEqual(department.data.acronym)
		expect(mayAdmitInput.value).toEqual(department.data.mayAdmit)
	})
})
