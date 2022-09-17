import { nextTick } from "vue"
import { shallowMount, flushPromises } from "@vue/test-utils"

import RequestEnvironment from "$/singletons/request_environment"

import Component from "./change_password_field.vue"

describe("Component: settings/change_password_field", () => {
	it("should verify user password", async() => {
		const OLD_PASSWORD = "Hello"
		const NEW_PASSWORD = "World"
		const CONFIRM_NEW_PASSWORD = "!"
		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"user": {
								"data": {
									"id": "1"
								}
							}
						}
					}
				},
				"stubs": {
					"Overlay": false,
					"SensitiveTextField": false
				}
			},
			"props": {
				"confirmNewPassword": "",
				"newPassword": "",
				"oldPassword": ""
			}
		})
		const editButton = wrapper.find(".input-and-controls button")
		const oldInput = wrapper.find("input:nth-child(1)")
		const newInput = wrapper.find("input:nth-child(2)")
		const confirmationInput = wrapper.find("input:nth-child(3)")

		await editButton.trigger("click")
		await oldInput.setValue(OLD_PASSWORD)
		await newInput.setValue(NEW_PASSWORD)
		await confirmationInput.setValue(CONFIRM_NEW_PASSWORD)

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("update:oldPassword.0", [ OLD_PASSWORD ])
		expect(updates).toHaveProperty("update:newPassword.0", [ NEW_PASSWORD ])
		expect(updates).toHaveProperty("update:confirmNewPassword.0", [ CONFIRM_NEW_PASSWORD ])
	})

	it("can save user password", async() => {
		const OLD_PASSWORD = "Hello"
		const NEW_PASSWORD = "World"
		const CONFIRM_NEW_PASSWORD = "!"
		const userID = "1"
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"user": {
								"data": {
									"id": userID
								}
							}
						}
					}
				},
				"stubs": {
					"Overlay": false,
					"SensitiveTextField": false
				}
			},
			"props": {
				"confirmNewPassword": "",
				"newPassword": "",
				"oldPassword": ""
			}
		})
		const editButton = wrapper.find(".input-and-controls button")
		const oldInput = wrapper.find("input:nth-child(1)")
		const newInput = wrapper.find("input:nth-child(2)")
		const confirmationInput = wrapper.find("input:nth-child(3)")
		const saveButton = wrapper.find(".overlay-footer button")

		await editButton.trigger("click")
		await oldInput.setValue(OLD_PASSWORD)
		await newInput.setValue(NEW_PASSWORD)
		await confirmationInput.setValue(CONFIRM_NEW_PASSWORD)
		await saveButton.trigger("click")
		await flushPromises()
		await nextTick()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "PATCH")
		expect(firstRequest).toHaveProperty("url", `/api/user/${userID}/update_password`)
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.attributes.password", NEW_PASSWORD)
		expect(firstRequestBody).toHaveProperty("data.id", userID)
		expect(firstRequestBody).toHaveProperty("data.type", "user")
		expect(firstRequestBody).toHaveProperty("meta.confirmPassword", CONFIRM_NEW_PASSWORD)
		expect(firstRequestBody).toHaveProperty("meta.oldPassword", OLD_PASSWORD)
	})
})
