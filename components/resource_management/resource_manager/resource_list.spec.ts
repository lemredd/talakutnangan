import type { DeserializedUserProfile } from "$/types/documents/user"

import { mount } from "@vue/test-utils"

import "~/setups/database.setup"
import Manager from "$/helpers/manager"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import ResourceList from "./resource_list.vue"

describe("Component: Resource List", () => {
	it("should have a read link", async() => {
		const sampleDepartment = await new DepartmentFactory().mayAdmit().insertOne()
		const sampleRole = await new RoleFactory().insertOne()
		const sampleList = await new UserFactory()
		.in(sampleDepartment)
		.attach(sampleRole)
		.deserializedMany(5, true)

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
					"managerKind": new Manager(
							user as DeserializedUserProfile<"roles"|"department">
					)
				}
			},
			"props": {
				"filteredList": sampleList.data,
				"searchFilter": ""
			}
		})
		const readResourceBtn = wrapper.findAll(".read-resource-btn")

		readResourceBtn.forEach(
			(btn, index) => expect(btn.attributes("href")).toEqual(`read/${index + 1}`)
		)
	})

	describe("User List", () => {
		it("should list users properly", async() => {
			const sampleDepartment = await new DepartmentFactory().mayAdmit().insertOne()
			const sampleRole = await new RoleFactory().insertOne()
			const sampleList = await new UserFactory()
			.in(sampleDepartment)
			.attach(sampleRole)
			.deserializedMany(5)

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
						"managerKind": new Manager(
							user as DeserializedUserProfile<"roles"|"department">
						)
					}
				},
				"props": {
					"filteredList": sampleList.data,
					"searchFilter": ""
				}
			})

			const resourceRows = wrapper.findAll(".resource-row")
			expect(resourceRows.length).toBe(5)
			expect(resourceRows[0].html()).toContain(sampleList.data[0].name)
			expect(resourceRows[1].html()).toContain(sampleList.data[1].name)
			expect(resourceRows[2].html()).toContain(sampleList.data[2].name)
			expect(resourceRows[3].html()).toContain(sampleList.data[3].name)
			expect(resourceRows[4].html()).toContain(sampleList.data[4].name)
		})

		it("should list no users properly", async() => {
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
						"managerKind": new Manager(
							user as DeserializedUserProfile<"roles"|"department">
						)
					}
				},
				"props": {
					"filteredList": [],
					"searchFilter": ""
				}
			})

			const resourceRows = wrapper.findAll(".resource-row")
			expect(resourceRows.length).toBe(0)
		})
	})

	describe("Role List", () => {
		it("should list role properly", async() => {
			const sampleList = await new RoleFactory().deserializedMany(5)

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
						"managerKind": new Manager(
							user as DeserializedUserProfile<"roles"|"department">
						)
					}
				},
				"props": {
					"filteredList": sampleList.data,
					"searchFilter": ""
				}
			})

			const resourceRows = wrapper.findAll(".resource-row")
			expect(resourceRows.length).toBe(5)
			expect(resourceRows[0].html()).toContain(sampleList.data[0].name)
			expect(resourceRows[1].html()).toContain(sampleList.data[1].name)
			expect(resourceRows[2].html()).toContain(sampleList.data[2].name)
			expect(resourceRows[3].html()).toContain(sampleList.data[3].name)
			expect(resourceRows[4].html()).toContain(sampleList.data[4].name)
		})

		it("should list no roles properly", async() => {
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
						"managerKind": new Manager(
							user as DeserializedUserProfile<"roles"|"department">
						)
					}
				},
				"props": {
					"filteredList": [],
					"searchFilter": ""
				}
			})

			const resourceRows = wrapper.findAll(".resource-row")
			expect(resourceRows.length).toBe(0)
		})
	})
})
