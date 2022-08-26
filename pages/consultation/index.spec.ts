import { shallowMount } from "@vue/test-utils"

import "~/set-ups/database.set_up"
import UserFactory from "~/factories/user"
import ConsultationFactory from "~/factories/consultation"

import Page from "./index.page.vue"

describe("Page: consultation/index", () => {
	it("should show add consultation button for student", async() => {
		const userProfile = await new UserFactory().beStudent().deserializedOne(false)
		const consultations = await new ConsultationFactory().deserializedMany(2, false)
		const wrapper = shallowMount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							consultations,
							userProfile
						}
					}
				}
			},
			"props": {
				"purpose": ""
			}
		})

		const addConsultatonButton = wrapper.find(".consultations-list-header .add")

		expect(addConsultatonButton.exists()).toBeTruthy()
	})

	it("should hide add consultation button for reachable employee", async() => {
		const userProfile = await new UserFactory().beReachableEmployee().deserializedOne(false)
		const consultations = await new ConsultationFactory().deserializedMany(2, false)
		const wrapper = shallowMount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							consultations,
							userProfile
						}
					}
				}
			},
			"props": {
				"purpose": ""
			}
		})

		const addConsultatonButton = wrapper.find(".consultations-list-header .add")

		expect(addConsultatonButton.exists()).toBeFalsy()
	})
})
