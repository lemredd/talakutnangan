/* eslint-disable vue/sort-keys */
import { mount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import ResourceManager from "./resource_manager.vue"

import "~/set-ups/database.set_up"
import Manager from "$/helpers/manager"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

describe("UI Component: Resource Manager", () => {
	describe("User Management", () => {
		it("Should identify if resource type is of user profile", async() => {
			async function listUsers() {
				const department = await new DepartmentFactory().mayAdmit().insertOne()
				const role = await new RoleFactory()
				.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
				.insertOne()

				return (
					await new UserFactory()
					.in(department)
					.attach(role)
					.deserializedMany(5)
				).data
			}

			const department = await new DepartmentFactory().mayAdmit()
			.insertOne()
			const deanRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.attach(deanRole)
			.deserializedOne()

			const sampleUserList = await listUsers()
			const deserializedRoles = await new RoleFactory().deserializedMany(9)

			const wrapper = mount(ResourceManager as object, {
				"shallow": true,
				"props": {
					"resource": sampleUserList
				},
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								"roles": deserializedRoles
							}
						},
						"managerKind": new Manager(
							user as DeserializedUserProfile<"roles" | "department">
						)
					}
				}
			})
			const roleFilter = wrapper.findComponent({ "name": "SelectableFilter" })

			await roleFilter.setValue("1")
			expect(roleFilter.emitted("update:modelValue")).toStrictEqual([ [ "1" ] ])
			expect(wrapper.emitted("filterByRole")).toStrictEqual([ [ "1" ] ])
		})
	})
})
