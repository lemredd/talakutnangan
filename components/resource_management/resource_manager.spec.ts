import { mount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import "~/set-ups/database.set_up"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import deserialize from "$/helpers/deserialize"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import Manager from "$/helpers/manager"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import ResourceManager from "./resource_manager.vue"

describe("UI Component: Resource Manager", () => {
	describe("User Management", () => {
		async function listUsers() {
			const users = await new UserFactory().makeMany(5)
			const serializedUsers = Serializer.serialize(
				users,
				new UserTransformer(),
				{}
			)

			return deserialize(serializedUsers)!.data
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
				"shallow": true,
				"props": {
					"resource": sampleUserList
				},
				"global": {
					"provide": {
						"managerKind": new Manager(user as DeserializedUserProfile)
					}
				}
			})

			const filters = wrapper.find(".filters")
			expect(filters.exists()).toBeTruthy()
		})
	})
})
