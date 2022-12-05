import { mount } from "@vue/test-utils"

import { UPDATE } from "$/permissions/semester_combinations"
import RequestEnvironment from "$/singletons/request_environment"
import { semester as permissionGroup } from "$/permissions/permission_list"
import convertToRawDate from "$@/helpers/convert_to_raw_date"

import Page from "./read.page.vue"

describe("Page: semester/read", () => {
	it("can update semester information", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const semester = {
			"data": {
				"endAt": new Date("2022-10-20"),
				"id": "0",
				"name": "Semesterexample1",
				"semesterOrder": "first",
				"startAt": new Date("2022-10-10")
			}
		}
		const updatedSemester = {
			"data": {
				"endAt": new Date("2022-10-30"),
				"name": "Xmaple",
				"semesterOrder": "second",
				"startAt": new Date("2022-10-20")
			}
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							semester,
							"userProfile": {
								"data": {
									"roles": {
										"data": [
											{
												"name": "A",
												"semesterFlags": permissionGroup.generateFlags(...UPDATE)
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

		const nameInput = wrapper.find(".name input")
		const orderInput = wrapper.find(".order select")
		const startAtInput = wrapper.find(".start-at input")
		const endAtInput = wrapper.find(".end-at input")
		const submitBtn = wrapper.find("button[type=submit]")

		await nameInput.setValue(updatedSemester.data.name)
		await orderInput.setValue(updatedSemester.data.semesterOrder)
		await startAtInput.setValue(convertToRawDate(updatedSemester.data.startAt))
		await endAtInput.setValue(convertToRawDate(updatedSemester.data.endAt))
		await submitBtn.trigger("submit")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", `/api/semester/${semester.data.id}`)

		const body = await request.json()
		expect(body).toHaveProperty("data.attributes.name", updatedSemester.data.name)
		expect(body).toHaveProperty(
			"data.attributes.semesterOrder", updatedSemester.data.semesterOrder)
		expect(body).toHaveProperty(
			"data.attributes.startAt", updatedSemester.data.startAt.toJSON())
		expect(body).toHaveProperty(
			"data.attributes.endAt", updatedSemester.data.endAt.toJSON())
	})
})
