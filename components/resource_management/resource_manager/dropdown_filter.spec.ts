import { mount } from "@vue/test-utils"
import flushPromises from "flush-promises"

import RequestEnvironment from "$/helpers/request_environment"
import RoleTransformer from "%/transformers/role"
import RoleFactory from "~/factories/role"

import DropdownFilter from "./dropdown_filter.vue"
import Serializer from "%/transformers/serializer"
import Manager from "../manager"

describe("UI Component: Dropdown Filter", () => {
	describe("Role Filters", () => {
		async function listFilters() {
			const transformer = new RoleTransformer()

			const roles = await new RoleFactory().makeMany(5)
			const serializedRoles = Serializer.serialize(roles, transformer, {})
			fetchMock.mockResponseOnce(JSON.stringify(serializedRoles),
			{ status: RequestEnvironment.status.OK })

			return serializedRoles
		}

		it("Should list all possible roles", async () => {
			await listFilters()

			const wrapper = mount(DropdownFilter, {
				shallow: true,
				props: {
					by: "Role"
				},
				global: {
					provide: {
						managerKind: new Manager("dean")
					}
				}
			})

			await flushPromises() // await for roles to be rendered
			const filterOptions = wrapper.findAll("option")

			expect(filterOptions.length).toBeGreaterThan(1)
		})
	})
})
