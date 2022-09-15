import { mount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import "~/set-ups/database.set_up"
import Manager from "$/helpers/manager"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import ResourceManager from "./resource_manager.vue"

describe("UI Component: Resource Manager", () => {
	describe("User Management", () => {
		async function listUsers() {
			return await (await new UserFactory().deserializedMany(5)).data
		}

		it("Should identify if resource type is of user profile", async() => {
			const department = await new DepartmentFactory().mayAdmit()
			.insertOne()
			const deanRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.attach(deanRole)
			.deserializedOne()

			const sampleUserList = await listUsers()

			const wrapper = mount(ResourceManager as object, {
				"global": {
					"provide": {
						"managerKind": new Manager(user as DeserializedUserProfile<"roles"|"department">)
					}
				},
				"props": {
					"resource": sampleUserList
				},
				"shallow": true,
			})

			const filters = wrapper.find(".filters")
			expect(filters.exists()).toBeTruthy()
		})
	})
})
