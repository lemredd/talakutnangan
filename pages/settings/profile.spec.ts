/* eslint-disable vue/sort-keys */
import { ref } from "vue"
import { flushPromises, shallowMount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import Page from "./profile.page.vue"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"

describe("Page: settings/profile", () => {
	describe("Reading", () => {
		it("should place display name", async() => {
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						"bodyClasses": ref([]),
						"pageContext": {
							"pageProps": {
								userProfile
							}
						}
					}
				}
			})

			const displayNameField = wrapper.findComponent({ "name": "TextualField" })

			expect(displayNameField.props().modelValue).toEqual(user.data.name)
			expect(displayNameField.html()).toContain(user.data.name)
		})
		it("can display profile picture", async() => {
			const sampleURL = "/images/profile.png"
			const profilePicture = {
				"data": {
					"fileContents": sampleURL
				}
			}
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						"bodyClasses": ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": {
									"data": {
										...userProfile,
										profilePicture
									}
								}
							}
						}
					},
					"stubs": {
						"PicturePicker": false,
						"Picture": false
					}
				}
			})
			const picture = wrapper.findComponent({ "name": "Picture" })

			expect(picture.attributes().src).toEqual(sampleURL)
		})
		it("can display signature", async() => {
			const sampleURL = "/images/signature.png"
			const signature = {
				"data": {
					"attributes": {
						"fileContents": sampleURL
					}
				}
			}
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						"bodyClasses": ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": {
									"data": {
										...userProfile,
										signature
									}
								}
							}
						}
					},
					"stubs": {
						"PicturePicker": false,
						"Picture": false
					}
				}
			})
			const picture = wrapper.findComponent({ "name": "Picture" })

			expect(picture.attributes().src).toEqual(sampleURL)
		})
	})

	describe("Editing", () => {
		it("can edit display name", async() => {
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						"bodyClasses": ref([]),
						"pageContext": {
							"pageProps": {
								userProfile
							}
						}
					},
					"stubs": {
						"TextualField": false
					}
				}
			})

			const displayNameField = wrapper.findComponent({ "name": "TextualField" })
			const displayNameBtn = displayNameField.find("button")
			const displayNameInput = displayNameField.find("input")

			fetchMock.mockResponseOnce(
				JSON.stringify({}),
				{ "status": RequestEnvironment.status.NO_CONTENT }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			await displayNameBtn.trigger("click")
			await displayNameInput.setValue("Something")
			await displayNameBtn.trigger("click")

			expect(displayNameField.props().modelValue).toEqual("Something")
		})
		it("can create profile picture", async() => {
			const sampleURL = "/images/profile.png"
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						"bodyClasses": ref([]),
						"pageContext": {
							"pageProps": {
								userProfile
							}
						}
					},
					"stubs": {
						"PicturePicker": false
					}
				}
			})
			const fileInput = wrapper.find("#input-profile-picture")

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": {
						"type": "profile_picture",
						"id": 1,
						"attributes": {
							"fileContents": sampleURL
						}
					}
				}),
				{ "status": RequestEnvironment.status.CREATED }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			await fileInput.setValue("")
			await flushPromises()

			const fetcher = fetch as jest.Mock<any, any>
			const [ [ request ] ] = fetcher.mock.calls
			expect(request).toHaveProperty(
				"url",
				`/api/user/${user.data.id}/relationships/profile_picture`
			)

			const previousCalls = Stub.consumePreviousCalls()
			expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
			expect(previousCalls).toHaveProperty("0.arguments.0", "/settings/profile")
		})
		it("can create signature", async() => {
			const sampleURL = "/images/signature.png"
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						"bodyClasses": ref([]),
						"pageContext": {
							"pageProps": {
								userProfile
							}
						}
					},
					"stubs": {
						"PicturePicker": false
					}
				}
			})
			const fileInput = wrapper.find("#input-signature")

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": {
						"type": "signature",
						"id": 1,
						"attributes": {
							"fileContents": sampleURL
						}
					}
				}),
				{ "status": RequestEnvironment.status.CREATED }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			await fileInput.setValue("")
			await flushPromises()

			const fetcher = fetch as jest.Mock<any, any>
			const [ [ request ] ] = fetcher.mock.calls
			expect(request).toHaveProperty(
				"url",
				`/api/user/${user.data.id}/relationships/signature`
			)

			const previousCalls = Stub.consumePreviousCalls()
			expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
			expect(previousCalls).toHaveProperty("0.arguments.0", "/settings/profile")
		})
		it("can edit dark mode preference", async() => {
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						"bodyClasses": ref([]),
						"pageContext": {
							"pageProps": {
								userProfile
							}
						}
					},
					"stubs": {
						"TextualField": false
					}
				}
			})

			const darkModeBtn = wrapper.find("#dark-mode-toggle")

			fetchMock.mockResponseOnce(
				JSON.stringify({}),
				{ "status": RequestEnvironment.status.NO_CONTENT }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			await darkModeBtn.trigger("click")

			expect(wrapper.emitted()).toHaveProperty("toggleDarkMode")
		})
	})
})
