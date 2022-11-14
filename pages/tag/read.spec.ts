import { mount } from "@vue/test-utils"

import { UPDATE } from "$/permissions/tag_combinations"
import RequestEnvironment from "$/singletons/request_environment"
import { tag as permissionGroup } from "$/permissions/permission_list"

import Page from "./read.page.vue"

describe("Page: tag/read", () => {
	it("should populate fields with pre-loaded data", () => {
		const tag = {
			"data": {
				"name": "Tagexample1"
			}
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							tag,
							"userProfile": {
								"data": {
									"roles": {
										"data": [
											{
												"name": "A",
												"tagFlags": 0
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

		const nameInput = wrapper.find("input.name").element as HTMLInputElement

		expect(nameInput.value).toEqual(tag.data.name)
	})

	it("can update tag information", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

		const tag = {
			"data": {
				"id": "0",
				"name": "Tagexample1"
			}
		}
		const updatedTag = {
			"data": {
				"name": "Xmaple"
			}
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							tag,
							"userProfile": {
								"data": {
									"roles": {
										"data": [
											{
												"name": "A",
												"tagFlags": permissionGroup.generateMask(...UPDATE)
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

		const nameInput = wrapper.find("input.name")
		const submitBtn = wrapper.find("input[type=submit]")

		await nameInput.setValue(updatedTag.data.name)
		await submitBtn.trigger("submit")
		const confirmPasswordBtn = wrapper.find(".confirm-btn")
		await confirmPasswordBtn.trigger("click")

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", `/api/tag/${tag.data.id}`)

		const body = await request.json()
		expect(body).toHaveProperty("data.attributes.name", updatedTag.data.name)
	})
})
