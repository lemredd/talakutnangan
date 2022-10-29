import { flushPromises, mount } from "@vue/test-utils"

import RequestEnvironment from "$/singletons/request_environment"

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

	it("can update department information", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const department = {
			"data": {
				"acronym": "STD",
				"fullName": "Sample Test Department",
				"id": "0",
				"mayAdmit": false
			}
		}
		const updatedDepartment = {
			"data": {
				"acronym": "TSD",
				"fullName": "Test Sample Department",
				"mayAdmit": true
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
		const fullNameInput = wrapper.find(".full-name")
		const acronymInput = wrapper.find(".acronym")
		const mayAdmitInput = wrapper.find(".may-admit")
		const submitBtn = wrapper.find("input[type=submit]")

		await fullNameInput.setValue(updatedDepartment.data.fullName)
		await acronymInput.setValue(updatedDepartment.data.acronym)
		await mayAdmitInput.setValue(updatedDepartment.data.mayAdmit)
		await submitBtn.trigger("submit")
		const confirmPasswordBtn = wrapper.find(".confirm-btn")
		await confirmPasswordBtn.trigger("click")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", `/api/department/${department.data.id}`)
		expect(JSON.stringify(await request.json())).toContain(JSON.stringify(updatedDepartment.data))
	})
})
