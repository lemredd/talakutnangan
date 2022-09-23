import { shallowMount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import "~/setups/database.setup"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import Component from "./profile_picture.vue"

describe("Component: helpers/profile_picture", () => {
	it("should show if user has profile picture", async() => {
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
		.deserializedOne()
		const userProfile = user as DeserializedUserProfile<"roles"|"department">

		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
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
				}
			}
		})

		const image = wrapper.find("img")
		const source = image.attributes("src")

		expect(source).toBe(sampleURL)
	})

	it("should not show if user has no profile picture", async() => {
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

		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							userProfile
						}
					}
				}
			}
		})

		const image = wrapper.find("img")
		const source = image.attributes("src")

		expect(source).toBe("stub")
	})
})
