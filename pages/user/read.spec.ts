import { flushPromises, mount } from "@vue/test-utils"

import RequestEnvironment from "$/singletons/request_environment"

import Page from "./read.page.vue"
import Stub from "$/singletons/stub"

describe("Page: user/read", () => {
	it("can populate fields using pre-loaded data", () => {
		const roles = {
			"data": [
				{
					"id": "1",
					"name": "Sample Role 1"
				},
				{
					"id": "2",
					"name": "Sample Role 2"
				},
				{
					"id": "3",
					"name": "Sample Role 3"
				}
			]
		}
		const departments = {
			"data": [
				{
					"fullName": "Sample Test Department",
					"id": "1"
				},
				{
					"fullName": "Sample Test Department aijveorivj",
					"id": "2"
				}
			]
		}
		const userRoles = {
			"data": [ roles.data[0] ]
		}
		const userDepartment = {
			"data": departments.data[0]
		}
		const user = {
			"data": {
				"department": userDepartment,
				"name": "Sample User",
				"roles": userRoles
			}
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							departments,
							roles,
							user
						}
					}
				}
			}
		})
		const userNameInput = wrapper.find(".user-name input").element as HTMLInputElement
		const selectedRoles = wrapper.findAll(".selected-options li")
		const selectedDepartment
		= wrapper.find(".selectable-department select").element as HTMLSelectElement

		expect(userNameInput.value).toEqual(user.data.name)
		selectedRoles.forEach(
			(role, index) => expect(role.text()).toContain(userRoles.data[index].name)
		)
		expect(selectedDepartment.value).toEqual(userDepartment.data.id)
	})

	it("can update user information", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const roles = {
			"data": [
				{
					"id": "1",
					"name": "Sample Role 1",
					"type": "role"
				},
				{
					"id": "2",
					"name": "Sample Role 2",
					"type": "role"
				},
				{
					"id": "3",
					"name": "Sample Role 3"
				}
			]
		}
		const departments = {
			"data": [
				{
					"fullName": "Sample Test Department",
					"id": "1",
					"type": "department"
				},
				{
					"fullName": "Sample Test Department aijveorivj",
					"id": "2",
					"type": "department"
				}
			]
		}
		const userRoles = {
			"data": [ roles.data[0] ]
		}
		const userDepartment = {
			"data": departments.data[0]
		}
		const user = {
			"data": {
				"department": userDepartment,
				"id": "1",
				"name": "Sample User",
				"roles": userRoles
			}
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							departments,
							roles,
							user
						}
					}
				}
			}
		})
		const userNameInput = wrapper.find(".user-name input")
		const editBtn = wrapper.find(".user-name .edit-button")
		const selectableRoles = wrapper.find(".selectable-roles select")
		const addSelectedRoleBtn = wrapper.find(".add-btn")
		const selectedDepartment = wrapper.find(".selectable-department select")
		const submitBtn = wrapper.find("button[type=submit]")

		const updatedUser = {
			"data": {
				"department": {
					"data": departments.data[1]
				},
				"id": 1,
				"name": "New Name",
				"roles": {
					"data": [ ...user.data.roles.data, roles.data[1] ]
				}
			}
		}
		const updatedUserRoles = {
			"data": updatedUser.data.roles.data.map(
				role => ({
					"id": role.id,
					"type": role.type
				})
			)
		}
		const updatedUserDepartment = {
			"data": {
				"id": updatedUser.data.department.data.id,
				"type": updatedUser.data.department.data.type
			}
		}

		jest.useFakeTimers()
		await editBtn.trigger("click")
		await userNameInput.setValue("New Name")
		const saveBtn = wrapper.find(".user-name .save-button")
		await saveBtn.trigger("click")
		await selectableRoles.setValue(roles.data[1].id)
		await addSelectedRoleBtn.trigger("click")
		await selectedDepartment.setValue(departments.data[1].id)
		await submitBtn.trigger("submit")

		// update user info and timeout for 1s
		await flushPromises()
		jest.advanceTimersByTime(1000)
		// update user roles and timeout for 1s
		await flushPromises()
		jest.advanceTimersByTime(1000)
		// update user department and timeout for 1s
		await flushPromises()
		jest.advanceTimersByTime(1000)

		const castFetch = fetch as jest.Mock<any, any>
		const [
			[ requestforUserInfo ],
			[ requestForAttachedRoles ],
			[ requestForAttachedDepartment ]
		] = castFetch.mock.calls
		expect(requestforUserInfo).toHaveProperty("method", "PATCH")
		expect(requestforUserInfo).toHaveProperty("url", `/api/user/${user.data.id}`)
		expect(JSON.stringify(await requestforUserInfo.json())).toContain(updatedUser.data.name)
		expect(requestForAttachedRoles).toHaveProperty("method", "PATCH")
		expect(requestForAttachedRoles).toHaveProperty(
			"url",
			`/api/user/${user.data.id}/relationships/role`
		)
		expect(await requestForAttachedRoles.json()).toEqual(updatedUserRoles)
		expect(requestForAttachedDepartment).toHaveProperty("method", "PATCH")
		expect(requestForAttachedDepartment).toHaveProperty(
			"url",
			`/api/user/${user.data.id}/relationships/department`
		)
		expect(await requestForAttachedDepartment.json()).toEqual(updatedUserDepartment)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments.0", `/user/read/${user.data.id}`)
		expect(previousCalls).not.toHaveProperty("0.arguments.1")
	})

	it.skip("can catch all errors that have occured", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const roles = {
			"data": [
				{
					"id": "1",
					"name": "Sample Role 1",
					"type": "role"
				},
				{
					"id": "2",
					"name": "Sample Role 2",
					"type": "role"
				},
				{
					"id": "3",
					"name": "Sample Role 3"
				}
			]
		}
		const departments = {
			"data": [
				{
					"fullName": "Sample Test Department",
					"id": "1",
					"type": "department"
				},
				{
					"fullName": "Sample Test Department aijveorivj",
					"id": "2",
					"type": "department"
				}
			]
		}
		const userRoles = {
			"data": [ roles.data[0] ]
		}
		const userDepartment = {
			"data": departments.data[0]
		}
		const user = {
			"data": {
				"department": userDepartment,
				"id": "1",
				"name": "Sample User",
				"roles": userRoles
			}
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							departments,
							roles,
							user
						}
					}
				}
			}
		})
		const userNameInput = wrapper.find(".user-name input")
		const editBtn = wrapper.find(".user-name button")
		const selectableRoles = wrapper.find(".selectable-roles select")
		const addSelectedRoleBtn = wrapper.find(".add-btn")
		const selectedDepartment = wrapper.find(".selectable-department select")
		const submitBtn = wrapper.find("button[type=submit]")

		const updatedUser = {
			"data": {
				"department": {
					"data": departments.data[1]
				},
				"id": 1,
				"name": "New Name",
				"roles": {
					"data": [ ...user.data.roles.data, roles.data[1] ]
				}
			}
		}
		const updatedUserRoles = {
			"data": updatedUser.data.roles.data.map(
				role => ({
					"id": role.id,
					"type": role.type
				})
			)
		}
		const updatedUserDepartment = {
			"data": {
				"id": updatedUser.data.department.data.id,
				"type": updatedUser.data.department.data.type
			}
		}
		await editBtn.trigger("click")
		await userNameInput.setValue("New Name")
		await editBtn.trigger("click")
		await selectableRoles.setValue(roles.data[1].id)
		await addSelectedRoleBtn.trigger("click")
		await selectedDepartment.setValue(departments.data[1].id)
		await submitBtn.trigger("submit")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [
			[ requestforUserInfo ],
			[ requestForAttachedRoles ],
			[ requestForAttachedDepartment ]
		] = castFetch.mock.calls
		expect(requestforUserInfo).toHaveProperty("method", "PATCH")
		expect(requestforUserInfo).toHaveProperty("url", `/api/user/${user.data.id}`)
		expect(JSON.stringify(await requestforUserInfo.json())).toContain(updatedUser.data.name)
		expect(requestForAttachedRoles).toHaveProperty("method", "PATCH")
		expect(requestForAttachedRoles).toHaveProperty(
			"url",
			`/api/user/${user.data.id}/relationships/role`
		)
		expect(await requestForAttachedRoles.json()).toEqual(updatedUserRoles)
		expect(requestForAttachedDepartment).toHaveProperty("method", "PATCH")
		expect(requestForAttachedDepartment).toHaveProperty(
			"url",
			`/api/user/${user.data.id}/relationships/department`
		)
		expect(await requestForAttachedDepartment.json()).toEqual(updatedUserDepartment)

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments.0", `/user/read/${user.data.id}`)
		expect(previousCalls).not.toHaveProperty("0.arguments.1")
	})
})
