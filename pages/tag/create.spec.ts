import { mount } from "@vue/test-utils"
import RequestEnvironment from "$/singletons/request_environment"

import Page from "./create.page.vue"

describe("Page: /tag", () => {
	it("can create tag", async() => {
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": {
				"type": "tag",
				"attributes": {
					"deletedAt": null,
					"name": "Xmaple"
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
		const tag = {
			"data": {
				"deletedAt": null,
				"name": "Xmaple"
			}
		}

		const nameInput = wrapper.find(".name input")
		const submitBtn = wrapper.find("input[type=submit]")

		await nameInput.setValue(tag.data.name)
		await submitBtn.trigger("submit")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "POST")
		expect(request).toHaveProperty("url", "/api/tag")
		expect(request.json()).resolves.toStrictEqual({
			"data": {
				"type": "tag",
				"attributes": {
					"deletedAt": null,
					"name": "Xmaple"
				}
			}
		})
	})
})
