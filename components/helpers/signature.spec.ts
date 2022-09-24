import { shallowMount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import "~/setups/database.setup"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import Component from "./signature.vue"

describe("Component: helpers/signature", () => {
	it("should show if user has signature", async() => {
		const sampleURL = "/images/signature.png"
		const signature = {
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
									...userProfile.data,
									signature
								}
							}
						}
					}
				}
			}
		})

		const image = wrapper.find("img")
		const source = image.attributes("src")
		console.log(image.html(), "\n\n\n")

		expect(source).toBe(sampleURL)
	})

	it("should not show if user has no signature", async() => {
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

		expect(source).toBe("")
	})
})
