/* eslint-disable no-tabs */
/* eslint-disable no-undef */
/* eslint-disable vue/sort-keys */
import { mount, flushPromises } from "@vue/test-utils"

import type { DeserializedUserProfile, DeserializedUserResource } from "$/types/documents/user"

import UserFetcher from "$@/fetchers/user"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import Manager from "$/helpers/manager"
import RequestEnvironment from "$/singletons/request_environment"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_ALL_DEPARTMENTS,
	READ_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/user_combinations"

import Page from "./list.page.vue"

describe("Page: user/list", () => {
	describe("Content header", () => {
		it("Should display correct header for admin", async() => {
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [ userProfile.data ]
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
			.beReachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [ userProfile.data ]
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

	describe("User listing", () => {
		it("Should include current user in the list", async() => {
			const department = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const role = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const user = await new UserFactory().in(department)
			.beUnreachableEmployee()
			.attach(role)
			.deserializedOne()
			const userProfile = user as DeserializedUserProfile<"roles"|"department">

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [ userProfile.data ]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			UserFetcher.initialize("/api")

			const response = new UserFetcher().list({
				"filter": {
					"department": userProfile.data.department.data.id,
					"existence": "exists",
					"kind": "*",
					"role": "*",
					"slug": ""
				},
				"page": {
					"limit": 10,
					"offset": 0
				},
				"sort": [ "name" ]
			})
			const fetchedData = (await response).body.data

			expect(fetchedData).toStrictEqual([
				JSON.parse(JSON.stringify(userProfile.data)) as DeserializedUserResource
			])

			// TODO(lead): ensure user is in list

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
						"UsersManager": false,
						"Suspensible": false
					}
				},
				"shallow": true
			})
			flushPromises()
			console.log(wrapper.html(), "\n\n\n\n")
		})
	})
})
