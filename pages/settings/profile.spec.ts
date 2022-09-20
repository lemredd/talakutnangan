import { ref } from "vue"
import { shallowMount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"
import ProfilePictureFactory from "~/factories/profile_picture"

import ProfilePictureFetcher from "$@/fetchers/profile_picture"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import Page from "./profile.page.vue"

describe("Page: settings/profile", () => {
	describe("User data placement", () => {
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
})
