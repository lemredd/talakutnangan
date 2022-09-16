import type { DeserializedUserProfile } from "$/types/documents/user"

import { mount } from "@vue/test-utils"

import "~/set-ups/database.set_up"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import Manager from "$/helpers/manager"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import ResourceList from "./resource_list.vue"

describe("Component: Resource List", () => {
	describe("User List", () => {
		it("Should list users properly", async() => {
			const sampleUserList = await new UserFactory().deserializedMany(5)

			const department = await new DepartmentFactory().mayAdmit()
			.insertOne()
			const deanRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.attach(deanRole)
			.deserializedOne()

			const wrapper = mount(ResourceList, {
				"global": {
					"provide": {
						"managerKind": new Manager(user as DeserializedUserProfile<"roles"|"department">)
					}
				},
				"props": {
					"filteredList": sampleUserList.data,
					"searchFilter": ""
				}
			})

			const resourceRows = wrapper.findAll(".resource-row")
			expect(resourceRows.length).toBe(5)
		})
	})
})
