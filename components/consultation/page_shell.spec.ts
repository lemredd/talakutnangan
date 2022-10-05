import { shallowMount } from "@vue/test-utils"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import "~/setups/database.setup"
import UserFactory from "~/factories/user"
import ConsultationFactory from "~/factories/consultation"

import Component from "./page_shell.vue"

describe("Component: consultation/page_shell", () => {
	it("should show add consultation button for student", async() => {
		const userProfile = await new UserFactory().beStudent().deserializedOne(false)
		const consultations = await new ConsultationFactory().deserializedMany(2, false)
		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
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


		const addConsultatonButton = wrapper.find(".consultations-list-header ~.add")

		expect(addConsultatonButton.exists()).toBeTruthy()
	})

	it("should hide add consultation button for reachable employee", async() => {
		const userProfile = await new UserFactory().beReachableEmployee().deserializedOne(false)
		const consultations = await new ConsultationFactory().deserializedMany(2, false)
		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
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
