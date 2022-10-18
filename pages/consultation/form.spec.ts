import { mount } from "@vue/test-utils"

import Page from "./form.page.vue"

describe("Page: Consultation/form", () => {
	it("can display consultation details", () => {
		const consultant = {
			"data": {
				"id": 0,
				"name": "Consultant Name"
			}
		}
		const consultantRole = {
			"data": {
				"name": "Consultant Role"
			}
		}
		const chatMessageActivities = {
			"data": [
				{
					"user": consultant
				},
				{
					"user": {
						"data": {
							"id": 1,
							"name": "Consulter Name"
						}
					}
				}
			]
		}

		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							chatMessageActivities,
							"chatMessages": {
								"data": []
							},
							"consultation": {
								"data": {
									consultant,
									consultantRole,
									"reason": "Reason",
									"scheduledStartAt": new Date("2022-10-04 10:00"),
									"startedAt": new Date("2022-10-04 10:00")
								}
							}
						}
					}
				}
			}
		})
		const consultantNameField = wrapper.find(".consultant")
		const consultantRoleField = wrapper.find(".consultant-role")
		const consulterField = wrapper.find(".consulters")
		const reasonField = wrapper.find(".reason")
		const scheduledStartAtField = wrapper.find(".scheduled-start")
		const startedAtField = wrapper.find(".actual-start")
		const fields = [
			consultantNameField,
			consultantRoleField,
			consulterField,
			reasonField,
			scheduledStartAtField,
			startedAtField
		]

		fields.forEach(field => {
			expect(field.exists()).toBeTruthy()
			expect(field.text()).not.toEqual("")
		})

		const consulters = consulterField.findAll(".consulter")
		expect(consulters).not.toHaveLength(0)
		consulters.forEach((element, index) => {
			expect(element.exists()).toBeTruthy()
			expect(element.text()).not.toEqual(consultant.data.name)
			expect(element.text()).toEqual(chatMessageActivities.data[index + 1].user.data.name)
		})
	})
})
