import { shallowMount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"


import Manager from "$/helpers/manager"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import Component from "./resource_manager.vue"

describe("UI Component: resource_management/resource_manager", () => {
	it.only("should update department", async() => {
		const departmentID = "1"
		const wrapper = shallowMount(Component as object, {
			"props": {
				"chosenDepartment": "",
				"departmentNames": [
					{
						"label": "Hello",
						"value": "2"
					},
					{
						"label": "World",
						"value": departmentID
					}
				],
				"isLoaded": true,
				"roleNames": []
			}
		})

		const departmentOptions = wrapper.findComponent({ "name": "SelectableOptionsField" })
		await departmentOptions.setValue(departmentID)

		const updateDepartment = wrapper.emitted("update:chosenDepartment")
		expect(updateDepartment).toHaveProperty("0.0", departmentID)
	})

	describe("Additional Filters", () => {
		it("Should update users with given role filters", async() => {
			async function generateUser() {
				const department = await new DepartmentFactory().mayAdmit().insertOne()
				const role = await new RoleFactory()
				.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
				.insertOne()

				return (
					await new UserFactory()
					.in(department)
					.attach(role)
					.deserializedOne()
				).data
			}

			const managerDept = await new DepartmentFactory().mayAdmit()
			.insertOne()
			const managerRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(managerDept)
			.attach(managerRole)
			.deserializedOne()

			const sampleUserList = []
			for (let i = 0; i < 5; i++) {
				// eslint-disable-next-line no-await-in-loop
				sampleUserList.push(await generateUser())
			}

			const deserializedRoles = {
				"data": [] as any[]
			}
			sampleUserList.forEach(sampleUser => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				sampleUser.roles!.data.forEach(sampleRole => deserializedRoles.data.push(sampleRole))
			})

			const deserializedDepartments = await new DepartmentFactory()
			.mayAdmit()
			.deserializedMany(7)

			const wrapper = shallowMount(Component, {
				"shallow": true,
				"props": {
					"isLoaded": true,
					"resource": sampleUserList,
					"isResourceTypeUser": true
				},
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								"roles": deserializedRoles,
								"departments": deserializedDepartments
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

		it("Should update users with given department filters", async() => {
			async function generateUser() {
				const department = await new DepartmentFactory().mayAdmit().insertOne()
				const role = await new RoleFactory()
				.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
				.insertOne()

				return (
					await new UserFactory()
					.in(department)
					.attach(role)
					.deserializedOne()
				).data
			}

			const managerDept = await new DepartmentFactory().mayAdmit()
			.insertOne()
			const managerRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(managerDept)
			.attach(managerRole)
			.deserializedOne()

			const sampleUserList = []
			for (let i = 0; i < 5; i++) {
				// eslint-disable-next-line no-await-in-loop
				sampleUserList.push(await generateUser())
			}

			const deserializedRoles = {
				"data": [] as any[]
			}
			sampleUserList.forEach(sampleUser => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				sampleUser.roles!.data.forEach(sampleRole => deserializedRoles.data.push(sampleRole))
			})

			const deserializedDepartments = await new DepartmentFactory()
			.mayAdmit()
			.deserializedMany(7)

			const wrapper = shallowMount(Component, {
				"shallow": true,
				"props": {
					"isLoaded": true,
					"resource": sampleUserList,
					"isResourceTypeUser": true
				},
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								"roles": deserializedRoles,
								"departments": deserializedDepartments
							}
						},
						"managerKind": new Manager(
							user as DeserializedUserProfile<"roles" | "department">
						)
					}
				}
			})
			const [
				unusedRoleFilter,
				deptFilter
			] = wrapper.findAllComponents({ "name": "SelectableFilter" })

			await deptFilter.setValue("1")
			expect(wrapper.emitted("filterByDept")).toStrictEqual([ [ "1" ] ])
		})
	})
})
