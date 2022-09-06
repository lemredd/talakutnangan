import { ref } from "vue"

import { mount } from "@vue/test-utils"
import RoleSpecificLinks from "./navigation_links.vue"

describe("Component: Page Shell/Role Specific Links", () => {
	it("should specify the right link/s for authenticated user", () => {
		const wrapper = mount(RoleSpecificLinks, {
			"shallow": true,
			"global": {
				"stubs": {
					"RoleLinksList": false
				},
				"provide": {
					"bodyClasses": ref<string[]>([ "dark" ]),
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"type": "user",
									"id": 1,
									"kind": "student",
									"roles": {
										"data": []
									}
								}
							},
							"parsedUnitError": {}
						}
					}
				}
			}
		})
		const link = wrapper.find("anchor-stub:first-of-type")
		const linkHref = link.attributes("href")

		expect(linkHref).toBe("/notifications")
	})

	it("should specify the right link/s for a guest user", () => {
		const wrapper = mount(RoleSpecificLinks, {
			"shallow": true,
			"global": {
				"stubs": {
					"RoleLinksList": false
				},
				"provide": {
					"bodyClasses": ref<string[]>([ "dark" ]),
					"pageContext": {
						"pageProps": {
							"userProfile": null,
							"parsedUnitError": {}
						}
					}
				}
			}
		})
		const link = wrapper.find("anchor-stub:first-of-type")
		const linkHref = link.attributes("href")

		expect(linkHref).toBe("/user/log_in")
	})

	it("should appear different in desktop", () => {
		const wrapper = mount(RoleSpecificLinks, {
			"shallow": true,
			"global": {
				"stubs": {
					"RoleLinksList": false
				},
				"provide": {
					"bodyClasses": ref<string[]>([ "dark" ]),
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"type": "user",
									"id": 1,
									"kind": "student",
									"roles": {
										"data": []
									}
								}
							},
							"parsedUnitError": {}
						}
					}
				}
			}
		})

		const desktopLinks = wrapper.findAll("anchor-stub")
		expect(desktopLinks.length).toBeGreaterThan(1)
	})
})
