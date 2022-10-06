/* eslint-disable no-tabs */
/* eslint-disable no-undef */
/* eslint-disable vue/sort-keys */
import { mount, flushPromises } from "@vue/test-utils"

import type { DeserializedUserProfile, DeserializedUserResource } from "$/types/documents/user"

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
		it("should display correct header for admin", async() => {
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
		it("should display correct header for department limited resource manager", async() => {
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
		it("should include current user in the list", async() => {
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
					"data": [ user ]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			const roleFilter = await new RoleFactory().deserializedMany(5)
			const deptFilter = await new DepartmentFactory().deserializedMany(5)

			// TODO(lead): ensure user is in list

			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								userProfile,
								"departments": deptFilter,
								"roles": roleFilter
							}
						},
						"managerKind": new Manager(userProfile)
					}
				},
				"shallow": true
			})
			await flushPromises()

			const usersManager = wrapper.findComponent({ "name": "UsersManager" })
			expect(usersManager.props().resource).toEqual([ user ])
		})
	})
	describe("User Filtering", () => {
		it.skip("should filter users based on given role", async() => {
			const managerDepartment = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const managerRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const managerUser = await new UserFactory().in(managerDepartment)
			.beUnreachableEmployee()
			.attach(managerRole)
			.deserializedOne()
			const userProfile = managerUser as DeserializedUserProfile<"roles"|"department">

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
			const users: DeserializedUserResource[] = []
			for (let i = 0, limit = 5; i < limit; i++) {
				// eslint-disable-next-line no-await-in-loop
				users.push(await generateUser())
			}
			const existingUserRoles = {
				"data": [] as any[]
			}
			users.forEach(sampleUser => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				sampleUser.roles!.data.forEach(
					sampleRole => existingUserRoles.data.push(sampleRole)
				)
			})
			const existingUserDepartments = {
				"data": [] as any[]
			}
			users.forEach(sampleUser => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				existingUserDepartments.data.push(sampleUser.department!.data)
			})
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [ ...users, managerUser ]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			// TODO(lead): ensure user is in list

			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								userProfile,
								"departments": existingUserDepartments,
								"roles": existingUserRoles
							}
						},
						"managerKind": new Manager(userProfile)
					},
					"stubs": {
						"UsersManager": false,
						"SelectableFilter": false
					}
				},
				"shallow": true
			})
			await flushPromises()
			const usersManager = wrapper.findComponent({ "name": "UsersManager" })
			const roleFilter = usersManager
			.findComponent({ "name": "SelectableFilter" })
			.find("select")
			const selectedRoleId = "5"

			function filterUsersByGivenRole() {
				const filteredUsers: DeserializedUserResource[] = []

				users.forEach(user => {
					user.roles?.data.forEach(role => {
						if (String(role.id) === selectedRoleId) {
							filteredUsers.push(user)
						}
					})
				})

				return filteredUsers
			}
			const filteredUsers = filterUsersByGivenRole()
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [ ...filteredUsers, managerUser ]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			await roleFilter.setValue(selectedRoleId)
			await flushPromises()
			expect(usersManager.props().resource).toEqual([ ...filteredUsers, managerUser ])
		})

		it.skip("should filter users based on given department", async() => {
			const managerDepartment = await new DepartmentFactory().mayNotAdmit()
			.insertOne()
			const managerRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
			.insertOne()
			const managerUser = await new UserFactory().in(managerDepartment)
			.beUnreachableEmployee()
			.attach(managerRole)
			.deserializedOne()
			const userProfile = managerUser as DeserializedUserProfile<"roles"|"department">

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
			const users: DeserializedUserResource[] = []
			for (let i = 0, limit = 5; i < limit; i++) {
				// eslint-disable-next-line no-await-in-loop
				users.push(await generateUser())
			}
			const existingUserRoles = {
				"data": [] as any[]
			}
			users.forEach(sampleUser => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				sampleUser.roles!.data.forEach(
					sampleRole => existingUserRoles.data.push(sampleRole)
				)
			})
			const existingUserDepartments = {
				"data": [] as any[]
			}
			users.forEach(sampleUser => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				existingUserDepartments.data.push(sampleUser.department!.data)
			})
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [ ...users, managerUser ]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			// TODO(lead): ensure user is in list

			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								userProfile,
								"departments": existingUserDepartments,
								"roles": existingUserRoles
							}
						},
						"managerKind": new Manager(userProfile)
					},
					"stubs": {
						"UsersManager": false,
						"SelectableFilter": false
					}
				},
				"shallow": true
			})
			await flushPromises()
			const usersManager = wrapper.findComponent({ "name": "UsersManager" })
			const [ unusedRoleFilter, departmentFilterComponent ] = usersManager
			.findAllComponents({ "name": "SelectableFilter" })
			const departmentFilter = departmentFilterComponent.find("select")
			const selectedDepartmentId = "5"

			function filterUsersByGivenDepartment() {
				const filteredUsers = users.filter(
					user => String(user.department?.data.id) === selectedDepartmentId
				)

				return filteredUsers
			}
			const filteredUsers = filterUsersByGivenDepartment()
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [ ...filteredUsers, managerUser ]
				}),
				{ "status": RequestEnvironment.status.OK }
			)
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": []
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			await departmentFilter.setValue(selectedDepartmentId)
			await flushPromises()
			expect(usersManager.props().resource).toEqual([ ...filteredUsers, managerUser ])
		})
	})
})
