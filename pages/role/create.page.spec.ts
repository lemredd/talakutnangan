import { mount } from "@vue/test-utils"

import Page from "./create.page.vue"
import { UnitError } from "$/types/server"
import RequestEnvironment from "$/helpers/request_environment"

describe("Page: /role", () => {
	it("can create role", async() => {
		fetchMock.mockResponseOnce("{}", { "status": RequestEnvironment.status.NO_CONTENT })
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {}
				}
			}
		})

		const roleNameField = wrapper.find("input[type=text]")
		const viewCheckboxes = wrapper.findAll("input[value='view']")
		const submit = wrapper.find("input[type=submit]")

		await roleNameField.setValue("Role Sample")
		viewCheckboxes.map(async checkbox => await checkbox.setValue(true))
		await submit.trigger("submit")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/role")

		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"type": "role",
				"attributes": {
					"name": "Role Sample",
					"postFlags": 1,
					"semesterFlags": 1,
					"tagFlags": 1,
					"commentFlags": 1,
					"profanityFlags": 1,
					"userFlags": 1,
					"auditTrailFlags": 1,
					"departmentFlags": 1,
					"roleFlags": 1
				}
			}
		})
	})

	it("cannot create role with invalid name", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"errors": [
				{
					"status": RequestEnvironment.status.BAD_REQUEST,
					"code": "3",
					"title": "Validation Error",
					"detail": "Field \"data.attributes.name\" must match the expression.",
					"source": {
						"pointer": "/data/attributes/name"
					}
				}
			] as UnitError[]
		}), { "status": RequestEnvironment.status.BAD_REQUEST })
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {}
				}
			}
		})

		const viewCheckboxes = wrapper.findAll("input[value='view']")
		const submit = wrapper.find("input[type=submit]")

		viewCheckboxes.map(async checkbox => await checkbox.setValue(true))
		await submit.trigger("submit")

		// TODO: Test the showing of error messages in the UI
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/role")

		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"type": "role",
				"attributes": {
					"name": "",
					"postFlags": 1,
					"semesterFlags": 1,
					"tagFlags": 1,
					"commentFlags": 1,
					"profanityFlags": 1,
					"userFlags": 1,
					"auditTrailFlags": 1,
					"departmentFlags": 1,
					"roleFlags": 1
				}
			}
		})
	})
})
