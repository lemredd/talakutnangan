import { mount } from "@vue/test-utils"

import Page from "./per_student.page.vue"

describe("Page: user/report", () => {
	it("can display properly", () => {
		const consultationsRelatedToUser = {
			"data": [
				{
					"finishedAt": new Date("2022-10-20 10:00:01"),
					"id": "1",
					"reason": "Sample Reason",
					"startedAt": new Date("2022-10-20 10:01:00")
				}
			]
		}
		const timeConsumedPerStudent = {
			"data": [
				{
					"email": "B@email",
					"id": "1",
					"meta": {
						"consultations": consultationsRelatedToUser,
						"timeConsumedPerStudent": 60000
					},
					"name": "A"
				}
			]
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							timeConsumedPerStudent
						}
					}
				}
			}
		})
		const sumEntryOwner = wrapper.find(".sum-entry-owner")
		const milliseconds = wrapper.find(".milliseconds")
		const consultations = wrapper.findAll(".consultation")

		expect(sumEntryOwner.text()).toEqual(
			`${timeConsumedPerStudent.data[0].name} (${timeConsumedPerStudent.data[0].email})`
		)
		expect(milliseconds.text()).toEqual(
			"Time consumed: 0 hours 1 minutes 0 seconds"
		)
		consultations.forEach((consultation, index) => {
			expect(consultation.text()).toEqual(
				// eslint-disable-next-line max-len
				`#${consultationsRelatedToUser.data[index].id} ${consultationsRelatedToUser.data[index].reason} 0 hours 0 minutes 59 seconds`
			)
		})
	})

	it.todo("can modify date time range")
})
