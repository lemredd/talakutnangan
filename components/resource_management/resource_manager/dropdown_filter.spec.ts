import type { DeserializedUserProfile } from "$/types/documents/user"

import { mount } from "@vue/test-utils"
import flushPromises from "flush-promises"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import RoleTransformer from "%/transformers/role"
import DepartmentFactory from "~/factories/department"
import RequestEnvironment from "$/helpers/request_environment"

import DropdownFilter from "./dropdown_filter.vue"
import Serializer from "%/transformers/serializer"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import Manager from "../manager"

describe("UI Component: Dropdown Filter", () => {
	describe("Role Filters", () => {
		it("Should list all possible roles", async () => {
			fetchMock.mockResponseOnce(
				JSON.stringify(await new RoleFactory().deserializedMany(5)),
				{ status: RequestEnvironment.status.OK }
			)

			const department = await new DepartmentFactory().mayAdmit().insertOne()
			const deanRole = await new RoleFactory()
				.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
				.insertOne()
			const user = await new UserFactory().in(department).attach(deanRole).deserializedOne()

			const wrapper = mount(DropdownFilter, {
				shallow: true,
				props: {
					by: "Role"
				},
				global: {
					provide: {
						managerKind: new Manager(user as DeserializedUserProfile)
					}
				}
			})

			await flushPromises() // await for roles to be rendered
			const filterOptions = wrapper.findAll("option")

			expect(filterOptions.length).toBeGreaterThan(1)
		})
	})
})
