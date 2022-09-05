import { mount } from "@vue/test-utils"
import RequestEnvironment from "$/helpers/request_environment"
import { UnitError } from "$/types/server"
import Page from "./create.page.vue"

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
		await Promise.all(viewCheckboxes.map(async checkbox => await checkbox.setValue(true)))
		await submit.trigger("submit")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/role")
		const requestBody = await request.json()
		expect(requestBody).toStrictEqual({
			"data": {
				"attributes": {
					"auditTrailFlags": 1,
					"commentFlags": 1,
					"deletedAt": null,
					"departmentFlags": 1,
					"name": "Role Sample",
					"postFlags": 1,
					"profanityFlags": 1,
					"roleFlags": 1,
					"semesterFlags": 1,
					"tagFlags": 1,
					"userFlags": 1
				},
				"type": "role"
			}
		})
	})

	it("cannot create role with invalid name", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"errors": [
				{
					"code": "3",
					"detail": "Field \"data.attributes.name\" must match the expression.",
					"source": {
						"pointer": "/data/attributes/name"
					},
					"status": RequestEnvironment.status.BAD_REQUEST,
					"title": "Validation Error"
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

		await Promise.all(viewCheckboxes.map(async checkbox => await checkbox.setValue(true)))
		await submit.trigger("submit")

		// TODO: Test the showing of error messages in the UI
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/role")
		const requestBody = await request.json()
		expect(requestBody).toStrictEqual({
			"data": {
				"attributes": {
					"auditTrailFlags": 1,
					"commentFlags": 1,
					"deletedAt": null,
					"departmentFlags": 1,
					"name": "",
					"postFlags": 1,
					"profanityFlags": 1,
					"roleFlags": 1,
					"semesterFlags": 1,
					"tagFlags": 1,
					"userFlags": 1
				},
				"type": "role"
			}
		})
	})
})
