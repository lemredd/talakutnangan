import { mount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"
import RequestEnvironment from "$/singletons/request_environment"

import { UPDATE as UPDATE_ROLES } from "$/permissions/role_combinations"
import { UPDATE as UPDATE_DEPARTMENTS } from "$/permissions/department_combinations"
import {
	user as userPermissionGroup,
	department as departmentPermissionGroup,
	role as rolePermissionGroup
} from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import Page from "./list.page.vue"

describe("Page: role/list", () => {
	describe("Basic rendering", () => {
		it.only("should display correct header for admin", async() => {
			const departmentFactory = new DepartmentFactory()
			const department = await departmentFactory.mayNotAdmit()
			.insertOne()
			const roleFactory = new RoleFactory()
			const role = await roleFactory
			.userFlags(userPermissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.departmentFlags(departmentPermissionGroup.generateMask(...UPDATE_DEPARTMENTS))
			.roleFlags(rolePermissionGroup.generateMask(...UPDATE_ROLES))
			.insertOne()
			const user = await new UserFactory()
			.in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [
						{
							"id": String(role.id),
							"meta": {
								"userCount": 1
							}
						}
					]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								"departments": await departmentFactory.deserialize([ department ]),
								"roles": await roleFactory.deserialize([ role ]),
								userProfile
							}
						}
					}
				}
			})

			const header = wrapper.find("header h1")

			expect(header.text()).toContain("Admin")
		})
	})
})
