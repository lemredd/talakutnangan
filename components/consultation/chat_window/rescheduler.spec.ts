import { nextTick } from "vue"
import { flushPromises, shallowMount } from "@vue/test-utils"

import RequestEnvironment from "$/singletons/request_environment"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import Component from "./rescheduler.vue"

describe("Component: consultation rescheduler", () => {
	it("can update schedule of consultation", async() => {
		const schedules = {
			"data": [
				{
					"attributes": {
						"dayName": "monday",
						"scheduleEnd": convertTimeToMinutes("09:00"),
						"scheduleStart": convertTimeToMinutes("08:00")
					},
					"id": "1",
					"type": "employee_schedule"
				}
			],
			"meta": {
				"count": 1
			}
		}
		fetchMock.mockResponseOnce(
			JSON.stringify(schedules),
			{ "status": RequestEnvironment.status.OK }
		)

		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"consultation": {
								"data": {
									"scheduledStartAt": new Date("2022-10-09T07:00.00.000Z")
								}
							}
						}
					}
				},
				"stubs": {
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		// Load consultant schedules
		await flushPromises()

		// Change day
		const castedWrapper = wrapper.vm as any
		const scheduler = wrapper.findComponent({ "name": "Scheduler" })
		const newDate = new Date("2022-10-10T00:00:00.000Z").toJSON()
		const newTime = String(convertTimeToMinutes("08:00"))
		await scheduler.vm.$emit("update:chosenDay", newDate)
		await scheduler.vm.$emit("update:chosenTime", newTime)
		await nextTick()
		await wrapper.setProps({
			"chosenDate": newDate,
			"chosenTime": newTime
		})

		// Submit changes
		const rescheduleBtn = wrapper.find(".reschedule-btn")
		await rescheduleBtn.trigger("click")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(2)
		const [
			[ unusedRequestForFetchingConsultantSchedule ],
			[ requestForUpdatingConsultationSchedule ]
		] = castFetch.mock.calls
		expect(requestForUpdatingConsultationSchedule).toHaveProperty("method", "PATCH")
		expect(await requestForUpdatingConsultationSchedule.json()).toStrictEqual({
			"data": {
				"attributes": {
					"actionTaken": null,
					"deletedAt": null,
					"finishedAt": null,
					"scheduledStartAt": castedWrapper.scheduledStartAt,
					"startedAt": null
				},
				"relationships": {
					"consultant": {},
					"consultantRole": {
						"data": {
							"type": "role"
						}
					}
				},
				"type": "consultation"
			},
			"meta": {
				"doesAllowConflicts": true
			}
		})
	})
})
