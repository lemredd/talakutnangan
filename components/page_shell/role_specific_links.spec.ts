import { mount } from "@vue/test-utils"
import RoleSpecificLinks from "./role_specific_links.vue"
import { ref } from "vue"

describe("Component: Page Shell/Role Specific Links", () => {
	it("should specify the right link/s for authenticated user", async () => {
		const wrapper = mount(RoleSpecificLinks, {
			shallow: true,
			global: {
				stubs: {
					RoleLinksList: false
				},
				provide: {
					bodyClasses: ref<string[]>(["dark"]),
					pageContext: {
						pageProps: {
							userProfile: {
								data: {
									type: "user",
									id: 1,
									kind: "student",
									roles: {
										data: []
									}
								}
							},
							parsedUnitError: {}
						}
					}
				}
			},
			props: {
				role: "student_or_employee"
			}
		})
		const link = wrapper.find("link-stub:first-of-type")
		const linkHref = link.attributes("href")

		expect(linkHref).toBe("/notifications")
	})

	it("should specify the right link/s for a guest user", async () => {
		const wrapper = mount(RoleSpecificLinks, {
			shallow: true,
			global: {
				stubs: {
					RoleLinksList: false
				},
				provide: {
					bodyClasses: ref<string[]>(["dark"]),
					pageContext: {
						pageProps: {
							userProfile: null,
							parsedUnitError: {}
						}
					}
				}
			},
			props: {
				role: "guest"
			}
		})
		const link = wrapper.find("link-stub:first-of-type")
		const linkHref = link.attributes("href")

		expect(linkHref).toBe("/log_in")
	})

	it("should appear different in desktop", () => {
		const wrapper = mount(RoleSpecificLinks, {
			shallow: true,
			global: {
				stubs: {
					RoleLinksList: false
				},
				provide: {
					bodyClasses: ref<string[]>(["dark"]),
					pageContext: {
						pageProps: {
							userProfile: {
								data: {
									type: "user",
									id: 1,
									kind: "student",
									roles: {
										data: []
									}
								}
							},
							parsedUnitError: {}
						}
					}
				}
			},
			props: {
				role: "student_or_employee"
			}
		})

		const desktopLinks = wrapper.findAll("link-stub")
		expect(desktopLinks.length).toBeGreaterThan(1)
	})
})
