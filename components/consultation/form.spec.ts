import { shallowMount } from "@vue/test-utils"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { UserListDocument } from "$/types/documents/user"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"

import Component from "./chat_message_item.vue"

describe("Component: consultation/form", () => {
	it("can search students", async() => {
		jest.useFakeTimers()
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
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})

		const consulterBox = wrapper.find(".consulters")
		const consulterSearchField = consulterBox.findComponent({ "name": "NonSensitiveTextField" })
		await consulterSearchField.setValue(students.data[0].attributes.name)
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)

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
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})

		const consulterBox = wrapper.find(".consultant")
		const consulterSearchField = consulterBox.findComponent({ "name": "NonSensitiveTextField" })
		await consulterSearchField.setValue(employees.data[0].attributes.name)
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
})
