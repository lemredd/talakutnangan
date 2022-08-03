import { mount } from "@vue/test-utils"

import UserFactory from "~/factories/user"
import deserialize from "$/helpers/deserialize"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import Manager from "@/resource_management/manager"
import ResourceList from "./resource_list.vue"

describe("Component: Resource List", () => {
	describe("User List", () => {
		async function listUsers() {
			const users = await new UserFactory().makeMany(5)
			const serializedUsers = Serializer.serialize(
				users,
				new UserTransformer(),
				{}
			)

			return deserialize(serializedUsers)!.data
		}

		it("Should list users properly", async () => {
			const sampleUserList = await listUsers()

			const wrapper = mount(ResourceList, {
				global: {
					provide: {
						managerKind: new Manager("dean")
					}
				},
				props: {
					searchFilter: "",
					filteredList: sampleUserList
				}
			})

			const resourceRows = wrapper.findAll(".resource-row")
			expect(resourceRows.length).toBe(5)
		})
	})
})
