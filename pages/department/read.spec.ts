import { flushPromises, mount } from "@vue/test-utils"

import { UPDATE } from "$/permissions/department_combinations"
import RequestEnvironment from "$/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Page from "./read.page.vue"

describe("Page: department/read", () => {
	it("should populate fields with pre-loaded data", () => {
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
							department,
							"userProfile": {
								"data": {
									"roles": {
										"data": [
											{
												"departmentFlags": 0,
												"name": "A"
											}
										]
									}
								}
							}
						}
					}
				}
			}
		})
		const castedWrapper = wrapper.vm as any
		const fullNameInput = wrapper.find(".full-name input").element as HTMLInputElement
		const acronymInput = wrapper.find(".acronym input").element as HTMLInputElement
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
							department,
							"userProfile": {
								"data": {
									"roles": {
										"data": [
											{
												"departmentFlags": permissionGroup.generateMask(...UPDATE),
												"name": "A"
											}
										]
									}
								}
							}
						}
					}
				}
			}
		})
		const fullNameInput = wrapper.find(".full-name input")
		const acronymInput = wrapper.find(".acronym input")
		const mayAdmitInput = wrapper.find(".may-admit input")
		const submitBtn = wrapper.find("button[type=submit]")

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
