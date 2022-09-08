/* eslint-disable no-undef */
/* eslint-disable vue/sort-keys */
import { mount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import RequestEnvironment from "$/helpers/request_environment"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_ALL_DEPARTMENTS,
	READ_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/user_combinations"

import Page from "./list.page.vue"

describe("Page: user/list", () => {
	describe("Content header", () => {
		it("Should display correct header for admin", async() => {
			const department = await new DepartmentFactory().mayAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile

			fetchMock.mockResponse(
				JSON.stringify({
					"data": [ userProfile.data ]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								userProfile
							}
						},
						"managerKind": new Manager(userProfile)
					},
					"stubs": {
						"AdminConfigHeader": false
					}
				},
				"shallow": true
			})
			const header = wrapper.find("header h1")

			expect(header.text()).toContain("Admin")
		})
		it("Should display correct header for department limited resource manager", async() => {
			const department = await new DepartmentFactory().mayAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
			.insertOne()
			const user = await new UserFactory().in(department)
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile

			fetchMock.mockResponse(
				JSON.stringify({
					"data": [ userProfile.data ]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								userProfile
							}
						},
						"managerKind": new Manager(userProfile)
					},
					"stubs": {
						"AdminConfigHeader": false
					}
				},
				"shallow": true
			})
			const header = wrapper.find("h1")

			expect(header.text()).toContain(department.fullName)
		})
	})
})
