import { shallowMount, flushPromises } from "@vue/test-utils"

import Stub from "$/singletons/stub"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"
import RequestEnvironment from "$/singletons/request_environment"

import SchedulePicker from "./schedule_picker.vue"

describe("Component: Schedule Picker", () => {
	it("should identify 12-hour format value", () => {
		const wrapper = shallowMount<any>(SchedulePicker, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": 1
								}
							}
						}
					}
				}
			},
			"props": {
				"dayName": "Monday",
				"scheduleEnd": convertTimeToMinutes("17:00"),
				"scheduleStart": convertTimeToMinutes("08:00")
			}
		})
		const endTimeSelectors = wrapper.find("#end")
		const endTimeSelectable = endTimeSelectors.findComponent({ "name": "Selectable" })

		expect(endTimeSelectable.attributes("modelvalue")).toBe("05:00")
	})

	it("should update existing schedule", async() => {
		const wrapper = shallowMount<any>(SchedulePicker, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": 1
								}
							}
						}
					}
				}
			},
			"props": {
				"dayName": "Monday",
				"scheduleEnd": convertTimeToMinutes("17:00"),
				"scheduleId": "1",
				"scheduleStart": convertTimeToMinutes("08:00")
			}
		})
		const endTimeSelectors = wrapper.find("#end")
		const endTimeSelectable = endTimeSelectors.findComponent({ "name": "Selectable" })
		const editBtn = wrapper.find("#edit-btn")

		fetchMock.mockResponseOnce(
			JSON.stringify({ "data": {} }),
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)
		await editBtn.trigger("click")
		await endTimeSelectable.setValue("06:00")
		const saveBtn = wrapper.find("#save-btn")
		await saveBtn.trigger("click")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls

		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", `/api/employee_schedule/${wrapper.props().scheduleId}`)
		expect(await request.json()).toStrictEqual({
			"data": {
				"attributes": {
					"dayName": "Monday",
					"scheduleEnd": 1080,
					"scheduleStart": 480
				},
				"id": "1",
				"type": "employee_schedule",
				"relationships": {
					"user": {
						"data": {
							"id": 1,
							"type": "user"
						}
					}
				}
			}
		})
	})

	it("should add new schedule in a day", async() => {
		const wrapper = shallowMount<any>(SchedulePicker, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": 1
								}
							}
						}
					}
				}
			},
			"props": {
				"dayName": "Monday",
				"isNew": true,
				"scheduleEnd": convertTimeToMinutes("00:00"),
				"scheduleId": "1",
				"scheduleStart": convertTimeToMinutes("00:00")
			}
		})
		const addBtn = wrapper.find("#add-btn")
		await addBtn.trigger("click")
		const startTimeSelectors = wrapper.find("#start")
		const startTimeSelectable = startTimeSelectors.findComponent({ "name": "Selectable" })
		const endTimeSelectors = wrapper.find("#end")
		const endTimeSelectable = endTimeSelectors.findComponent({ "name": "Selectable" })
		await startTimeSelectable.setValue("10:30")
		await endTimeSelectable.setValue("10:45")

		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"dayName": "sunday",
						"scheduleEnd": 1365,
						"scheduleStart": 1350
					},
					"id": "1",
					"type": "employee_schedule"
				}
			}),
			{ "status": RequestEnvironment.status.CREATED }
		)
		fetchMock.mockResponseOnce(
			JSON.stringify({ "data": {} }),
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)
		const saveBtn = wrapper.find("#save-new-btn")
		await saveBtn.trigger("click")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls

		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/employee_schedule")

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments.0", "/settings/profile")
	})

	it("should delete existing schedule", async() => {
		const wrapper = shallowMount<any>(SchedulePicker, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": 1
								}
							}
						}
					}
				}
			},
			"props": {
				"dayName": "Monday",
				"scheduleEnd": convertTimeToMinutes("17:00"),
				"scheduleId": "1",
				"scheduleStart": convertTimeToMinutes("08:00")
			}
		})
		const editBtn = wrapper.find("#edit-btn")
		await editBtn.trigger("click")

		fetchMock.mockResponseOnce(
			JSON.stringify({ "data": {} }),
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)
		const deleteBtn = wrapper.find("#delete-btn")
		await deleteBtn.trigger("click")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls

		expect(request).toHaveProperty("method", "DELETE")
		expect(request).toHaveProperty("url", "/api/employee_schedule")

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments.0", "/settings/profile")
	})
})
