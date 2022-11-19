import { mount } from "@vue/test-utils"
import RequestEnvironment from "$/singletons/request_environment"
import convertToRawDate from "$@/helpers/convert_to_raw_date"

import Page from "./create.page.vue"

describe("Page: /semester", () => {
	it("can create semester", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"type": "semester",
				"attributes": {
					"deletedAt": null,
					"endAt": new Date("2022-10-30"),
					"name": "Xmaple",
					"semesterOrder": "second",
					"startAt": new Date("2022-10-20")
				}
			}
		}), { "status": RequestEnvironment.status.OK })

		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {}
				}
			}
		})
		const semester = {
			"data": {
				"deletedAt": null,
				"endAt": new Date("2022-10-30"),
				"name": "Xmaple",
				"semesterOrder": "second",
				"startAt": new Date("2022-10-20")
			}
		}

		const nameInput = wrapper.find(".name input")
		const orderInput = wrapper.find(".order select")
		const startAtInput = wrapper.find(".start input")
		const endAtInput = wrapper.find(".end input")
		const submitBtn = wrapper.find("button[type=submit]")

		await nameInput.setValue(semester.data.name)
		await orderInput.setValue(semester.data.semesterOrder)
		await startAtInput.setValue(convertToRawDate(semester.data.startAt))
		await endAtInput.setValue(convertToRawDate(semester.data.endAt))
		await submitBtn.trigger("submit")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/semester")
		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"type": "semester",
				"attributes": {
					"deletedAt": null,
					"endAt": new Date("2022-10-30").toJSON(),
					"name": "Xmaple",
					"semesterOrder": "second",
					"startAt": new Date("2022-10-20").toJSON()
				}
			}
		})
	})
})
