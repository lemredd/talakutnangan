import { nextTick } from "vue"
import { shallowMount, flushPromises } from "@vue/test-utils"

import { BODY_CLASSES } from "$@/constants/provided_keys"
import { UPDATE_PASSWORD_LINK } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$/singletons/request_environment"

import Component from "./change_password.vue"

describe.skip("Component: authentication/change_password", () => {
	it("can prompt for new user password as necessary", async() => {
		const CURRENT_PASSWORD = "Hello"
		const NEW_PASSWORD = "World"
		const CONFIRM_NEW_PASSWORD = "!"
		const userID = "1"
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": userID
								},
								"meta": {
									"hasDefaultPassword": true
								}
							}
						}
					}
				},
				"stubs": {
					"Overlay": false
				}
			}
		})

		await nextTick()
		const overlay = wrapper.find(".overlay")
		const overlayInputs = overlay.findAllComponents({ "name": "SensitiveTextField" })
		const [ currentInput, newInput, confirmationInput ] = overlayInputs
		const saveButton = wrapper.find(".save-btn")
		await currentInput.setValue(CURRENT_PASSWORD)
		await newInput.setValue(NEW_PASSWORD)
		await confirmationInput.setValue(CONFIRM_NEW_PASSWORD)
		await saveButton.trigger("click")
		await flushPromises()
		await nextTick()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "PATCH")
		expect(firstRequest).toHaveProperty("url", specializePath(UPDATE_PASSWORD_LINK, {
			"id": userID
		}))
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.attributes.password", NEW_PASSWORD)
		expect(firstRequestBody).toHaveProperty("data.id", userID)
		expect(firstRequestBody).toHaveProperty("data.type", "user")
		expect(firstRequestBody).toHaveProperty("meta.confirmPassword", CONFIRM_NEW_PASSWORD)
		expect(firstRequestBody).toHaveProperty("meta.currentPassword", CURRENT_PASSWORD)
	})

	it("cannot prompt for new user password or already-changed", async() => {
		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": "1"
								},
								"meta": {
									"hasDefaultPassword": false
								}
							}
						}
					}
				},
				"stubs": {
					"Overlay": false
				}
			}
		})

		await nextTick()
		const overlay = wrapper.find(".overlay")

		expect(overlay.exists()).toBe(false)
	})
})
