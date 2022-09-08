/* eslint-disable vue/sort-keys */
import { mount } from "@vue/test-utils"

import type { DeserializedUserProfile } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import Page from "./list.page.vue"

describe("Page: user/list", () => {
	it("should be admin (for the lack of better term, this will be changed)", async() => {
		const department = await new DepartmentFactory().mayAdmit()
		.insertOne()
		const deanRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
		.insertOne()
		const user = await new UserFactory().in(department)
		.attach(deanRole)
		.deserializedOne()
		const userProfile = user as DeserializedUserProfile

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

		console.log(wrapper.html())
	})
})
