import type { DeserializedUserProfile } from "$/types/documents/user"

import "~/set-ups/database.setup"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import KindManager from "./manager"

describe("Resource management: Kind manager", () => {
	it("can detect admin user", async() => {
		const department = await new DepartmentFactory().mayNotAdmit()
		.insertOne()
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
		.insertOne()
		const user = await new UserFactory().in(department)
		.attach(adminRole)
		.deserializedOne()

		const manager = new KindManager(user as DeserializedUserProfile<"roles"|"department">)

		expect(manager.isAdmin()).toBeTruthy()
		expect(manager.isInstituteLimited()).toBeFalsy()
		expect(manager.isStudentServiceLimited()).toBeFalsy()
	})

	it("can detect institute-limited user", async() => {
		const department = await new DepartmentFactory().mayAdmit()
		.insertOne()
		const deanRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
		.insertOne()
		const user = await new UserFactory().in(department)
		.attach(deanRole)
		.deserializedOne()

		const manager = new KindManager(user as DeserializedUserProfile<"roles"|"department">)

		expect(manager.isAdmin()).toBeFalsy()
		expect(manager.isInstituteLimited()).toBeTruthy()
		expect(manager.isStudentServiceLimited()).toBeFalsy()
	})

	it("can detect service-limited user", async() => {
		const department = await new DepartmentFactory().mayNotAdmit()
		.insertOne()
		const serviceHeadRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_OWN_DEPARTMENT))
		.insertOne()
		const user = await new UserFactory().in(department)
		.attach(serviceHeadRole)
		.deserializedOne()

		const manager = new KindManager(user as DeserializedUserProfile<"roles"|"department">)

		expect(manager.isAdmin()).toBeFalsy()
		expect(manager.isInstituteLimited()).toBeFalsy()
		expect(manager.isStudentServiceLimited()).toBeTruthy()
	})
})
