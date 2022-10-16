import { faker } from "@faker-js/faker"
import { shallowMount } from "@vue/test-utils"

import { post as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import Component from "./create_post_form.vue"

describe("Component: post/create_post_form", () => {
	it("may select one of the multiple roles but for one department", async() => {
		const departmentAResource = {
			"id": "3",
			"name": "C"
		}
		const roleResourceA = {
			"id": "1",
			"name": "A",
			"postFlags": permissionGroup.generateMask(...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
		}
		const roleResourceB = {
			"id": "2",
			"name": "B",
			"postFlags": permissionGroup.generateMask(...CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT)
		}
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"departments": [],
							"userProfile": {
								"data": {
									"department": {
										"data": departmentAResource
									},
									"roles": {
										"data": [
											roleResourceA,
											roleResourceB
										]
									}
								}
							}
						}
					}
				},
				"stubs": {
					"DraftForm": false,
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		const roleOptionsField = wrapper
		.find(".role-selector")
		.findComponent({ "name": "SelectableOptionsField" })

		await roleOptionsField.setValue(roleResourceB.id)

		const departmentOptionsField = wrapper
		.find(".department-selector")
		expect(roleOptionsField.exists()).toBeTruthy()
		expect(departmentOptionsField.exists()).toBeFalsy()
	})

	it("may select one of the multiple roles and any department", async() => {
		const departmentAResource = {
			"id": "3",
			"name": "C"
		}
		const departmentBResource = {
			"id": "4",
			"name": "D"
		}
		const roleResourceA = {
			"id": "1",
			"name": "A",
			"postFlags": permissionGroup.generateMask(...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
		}
		const roleResourceB = {
			"id": "2",
			"name": "B",
			"postFlags": permissionGroup.generateMask(...CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT)
		}
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"departments": [ departmentAResource, departmentBResource ],
							"userProfile": {
								"data": {
									"department": {
										"data": departmentAResource
									},
									"roles": {
										"data": [
											roleResourceB,
											roleResourceA
										]
									}
								}
							}
						}
					}
				},
				"stubs": {
					"DraftForm": false,
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		const roleOptionsField = wrapper
		.find(".role-selector")
		.findComponent({ "name": "SelectableOptionsField" })

		await roleOptionsField.setValue(roleResourceA.id)

		const departmentOptionsField = wrapper
		.find(".department-selector")
		.findComponent({ "name": "SelectableOptionsField" })
		expect(roleOptionsField.exists()).toBeTruthy()
		expect(departmentOptionsField.exists()).toBeTruthy()
	})

	it("may select any department but only one role", async() => {
		const departmentAResource = {
			"id": "3",
			"name": "C"
		}
		const departmentBResource = {
			"id": "4",
			"name": "D"
		}
		const roleResourceA = {
			"id": "1",
			"name": "A",
			"postFlags": permissionGroup.generateMask(...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
		}
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"departments": [ departmentAResource, departmentBResource ],
							"userProfile": {
								"data": {
									"department": {
										"data": departmentAResource
									},
									"roles": {
										"data": [
											roleResourceA
										]
									}
								}
							}
						}
					}
				},
				"stubs": {
					"DraftForm": false,
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		const roleOptionsField = wrapper
		.find(".role-selector")
		const departmentOptionsField = wrapper
		.find(".department-selector")
		.findComponent({ "name": "SelectableOptionsField" })

		expect(roleOptionsField.exists()).toBeFalsy()
		expect(departmentOptionsField.exists()).toBeTruthy()
	})
})
