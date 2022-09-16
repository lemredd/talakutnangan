import type { DeserializedUserProfile } from "$/types/documents/user"

import { mount, flushPromises } from "@vue/test-utils"

import "~/set-ups/database.set_up"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import Manager from "$/helpers/manager"
import DepartmentFactory from "~/factories/department"
import RequestEnvironment from "$/singletons/request_environment"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import DropdownFilter from "./dropdown_filter.vue"

describe("UI Component: Dropdown Filter", () => {
	describe("Role Filters", () => {
		it("Should list all possible roles", async() => {
			fetchMock.mockResponseOnce(
				JSON.stringify(await new RoleFactory().deserializedMany(5)),
				{ "status": RequestEnvironment.status.OK }
			)

			const department = await new DepartmentFactory().mayAdmit()
			.insertOne()
			const deanRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.attach(deanRole)
			.deserializedOne()

			const wrapper = mount(DropdownFilter, {
				"global": {
					"provide": {
						"managerKind": new Manager(user as DeserializedUserProfile<"roles"|"department">)
					}
				},
				"props": {
					"by": "Role"
				},
				"shallow": true
			})

			// Await for roles to be rendered
			await flushPromises()
			const filterOptions = wrapper.findAll("option")

			expect(filterOptions.length).toBeGreaterThan(1)
		})
	})
})
