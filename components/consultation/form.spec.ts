import { nextTick } from "vue"
import { shallowMount, flushPromises } from "@vue/test-utils"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { UserListDocument } from "$/types/documents/user"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"

import Component from "./form.vue"

jest.useFakeTimers()

describe("Component: consultation/form", () => {
	it("can search students", async() => {
		const students = {
			"data": [
				{
					"attributes": {
						"email": "",
						"kind": "student",
						"name": "Student A",
						"prefersDark": true
					},
					"id": "1",
					"type": "user"
				}
			]
		} as UserListDocument

		fetchMock.mockResponseOnce(
			JSON.stringify(students),
			{ "status": RequestEnvironment.status.OK }
		)

		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"Overlay": false,
					"SearchableChip": false
				}
			},
			"props": {
				"isShown": true
			}
		})

		const consulterBox = wrapper.find(".consulters")
		const consulterSearchField = consulterBox.findComponent({ "name": "NonSensitiveTextField" })
		await consulterSearchField.vm.$emit("update:modelValue", students.data[0].attributes.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await nextTick()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", `/api/user?${
			stringifyQuery({
				"filter": {
					"department": "*",
					"existence": "exists",
					"kind": "student",
					"role": "*",
					"slug": students.data[0].attributes.name
				},
				"page": {
					"limit": 10,
					"offset": 0
				},
				"sort": [ "name" ]
			})
		}`)
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("can search employees", async() => {
		const employees = {
			"data": [
				{
					"attributes": {
						"email": "",
						"kind": "reachable_employee",
						"name": "Employee A",
						"prefersDark": true
					},
					"id": "2",
					"type": "user"
				}
			]
		} as UserListDocument
		fetchMock.mockResponseOnce(
			JSON.stringify(employees),
			{ "status": RequestEnvironment.status.OK }
		)


		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"Overlay": false,
					"SearchableChip": false
				}
			},
			"props": {
				"isShown": true
			}
		})

		const consultantBox = wrapper.find(".consultant")
		const consultantSearchField = consultantBox.findComponent({ "name": "NonSensitiveTextField" })
		await consultantSearchField.setValue(employees.data[0].attributes.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", `/api/user?${
			stringifyQuery({
				"filter": {
					"department": "*",
					"existence": "exists",
					"kind": "reachable_employee",
					"role": "*",
					"slug": employees.data[0].attributes.name
				},
				"page": {
					"limit": 10,
					"offset": 0
				},
				"sort": [ "name" ]
			})
		}`)
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})
	it("can select employee's available roles", async() => {
		const roles = {
			"data": [
				{
					"id": 1,
					"name": "role"
				}
			]
		}
		const employees = {
			"data": [
				{
					"attributes": {
						"email": "",
						"kind": "reachable_employee",
						"name": "Employee A",
						"prefersDark": true,
						roles
					},
					"id": "2",
					"type": "user"
				}
			]
		} as UserListDocument
		fetchMock.mockResponseOnce(
			JSON.stringify(employees),
			{ "status": RequestEnvironment.status.OK }
		)

		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"Overlay": false,
					"SearchableChip": false
				}
			},
			"props": {
				"isShown": true
			}
		})

		const consultantBox = wrapper.find(".consultant")
		const consultantSearchField = consultantBox.findComponent({ "name": "NonSensitiveTextField" })
		await consultantSearchField.setValue(employees.data[0].attributes.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)

		await flushPromises()
		const employeeChip = wrapper.find(".chip")
		await employeeChip.trigger("click")

		await nextTick()
		const selectableConsultantRoles = wrapper.findComponent({ "name": "SelectableOptionsField" })
		expect(selectableConsultantRoles.exists()).toBeTruthy()

		await selectableConsultantRoles.setValue(roles.data[0].name)
		expect(selectableConsultantRoles.props("modelValue")).toEqual(roles.data[0].name)
	})
})
