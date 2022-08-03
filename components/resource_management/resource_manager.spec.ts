import type { CommonQueryParameters } from "$/types/query"

import { mount } from "@vue/test-utils"

import UserFactory from "~/factories/user"
import deserialize from "$/helpers/deserialize"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import ResourceManager from "./resource_manager.vue"
import Manager from "./manager"

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

		it("Should identify if resource type is of user profile", async () => {
			const sampleUserList = await listUsers()

			const wrapper = mount(ResourceManager as object, {
				shallow: true,
				props: {
					resource: sampleUserList
				},
				global: {
					provide: {
						managerKind: new Manager("admin")
					}
				}
			})

			const filters = wrapper.find(".filters")
			expect(filters.exists()).toBeTruthy()
		})
	})
})
