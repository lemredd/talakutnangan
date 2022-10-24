/* eslint-disable max-lines */
/* eslint-disable vue/sort-keys */
import { ref } from "vue"
import { flushPromises, shallowMount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"
import UserProfileTransformer from "%/transformers/user_profile"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import Page from "./profile.page.vue"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"

describe("Page: settings/profile", () => {
	describe("Reading", () => {
		it("should read display name and dark mode", async() => {
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<
				"roles"|"department"|"employeeSchedules"
			>
			userProfile.data.employeeSchedules = { "data": [] }

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						[BODY_CLASSES]: ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": {
									"data": {
										...userProfile.data,
										"prefersDark": true
									}
								}
							}
						}
					}
				}
			})


			const displayNameField = wrapper.findComponent({ "name": "TextualField" })
			const [ darkMode ] = wrapper.find("#dark-mode-toggle").getRootNodes()
			const darkModeCheckbox = darkMode as HTMLInputElement

			expect(displayNameField.props().modelValue).toEqual(user.data.name)
			expect(displayNameField.html()).toContain(user.data.name)
			expect(darkModeCheckbox.value).toBe("on")
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
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<
				"roles"|"department"|"employeeSchedules"
			>
			userProfile.data.employeeSchedules = { "data": [] }

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						[BODY_CLASSES]: ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": {
									"data": {
										...userProfile.data,
										profilePicture
									}
								}
							}
						}
					},
					"stubs": {
						"PicturePicker": false,
						"ProfilePicture": false
					}
				}
			})
			const picture = wrapper.find("img")

			expect(picture.attributes().src).toEqual(sampleURL)
		})

		it("can display signature", async() => {
			const sampleURL = "/images/signature.png"
			const signature = {
				"data": {
					"fileContents": sampleURL
				}
			}
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beReachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<
				"roles"|"department"|"employeeSchedules"
			>
			userProfile.data.employeeSchedules = { "data": [] }

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						[BODY_CLASSES]: ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": {
									"data": {
										...userProfile.data,
										signature
									}
								}
							}
						}
					},
					"stubs": {
						"PicturePicker": false,
						"Signature": false
					}
				}
			})
			const picture = wrapper.find("img")

			expect(picture.attributes().src).toEqual(sampleURL)
		})

		it("can not display signature user is admin", async() => {
			const sampleURL = "/images/signature.png"
			const signature = {
				"data": {
					"fileContents": sampleURL
				}
			}
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<
				"roles"|"department"|"employeeSchedules"
			>
			userProfile.data.employeeSchedules = { "data": [] }

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						[BODY_CLASSES]: ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": {
									"data": {
										...userProfile.data,
										signature
									}
								}
							}
						}
					},
					"stubs": {
						"PicturePicker": false,
						"Signature": false
					}
				}
			})

			expect(wrapper.html()).not.toContain("img")
		})
	})

	describe("Editing", () => {
		it("can edit display name", async() => {
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<
				"roles"|"department"|"employeeSchedules"
			>
			userProfile.data.employeeSchedules = { "data": [] }

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						[BODY_CLASSES]: ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": userProfile as DeserializedUserProfile<"roles"|"department">
							}
						}
					},
					"stubs": {
						"TextualField": false
					}
				}
			})

			const displayNameField = wrapper.find(".input-container")
			const editNameButton = displayNameField.find(".edit-button")
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

			await editNameButton.trigger("click")
			await displayNameInput.setValue("Something")
			const saveNameButton = displayNameField.find(".save-button")
			await saveNameButton.trigger("click")
			await flushPromises()

			const displayNameInputElement = displayNameInput.getRootNodes()[0] as HTMLInputElement
			expect(displayNameInputElement.value).toEqual("Something")

			const previousCalls = Stub.consumePreviousCalls()
			expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
			expect(previousCalls).toHaveProperty("0.arguments.0", "/settings/profile")
		})

		it("can create profile picture", async() => {
			const sampleURL = "/images/profile.png"
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<
				"roles"|"department"|"employeeSchedules"
			>
			userProfile.data.employeeSchedules = { "data": [] }

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						[BODY_CLASSES]: ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": userProfile as DeserializedUserProfile<"roles"|"department">
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
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beReachableEmployee()
			.attach(role)
			.deserializedOne(true)
			const userProfile = user as DeserializedUserProfile<
				"roles"|"department"|"employeeSchedules"
			>
			userProfile.data.employeeSchedules = { "data": [] }

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						[BODY_CLASSES]: ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": userProfile as DeserializedUserProfile<"roles"|"department">
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
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne(false, {} as unknown as void, new UserProfileTransformer())
			const userProfile = user as DeserializedUserProfile<
				"roles"|"department"|"employeeSchedules"
			>
			userProfile.data.employeeSchedules = { "data": [] }

			const wrapper = shallowMount(Page, {
				"global": {
					"provide": {
						[BODY_CLASSES]: ref([]),
						"pageContext": {
							"pageProps": {
								"userProfile": userProfile as DeserializedUserProfile<"roles"|"department">
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
