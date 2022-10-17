import { mount } from "@vue/test-utils"

import Page from "./form.page.vue"

describe("Page: Consultation/form", () => {
	it("can display consultation details", () => {
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"PageContext": {
						"pageProps": {
							"chatMessageActivities": {
								"data": []
							},
							"chatMessages": {
								"data": []
							},
							"consultation": {
								"data": {}
							}
						}
					}
				}
			}
		})
	})
})
