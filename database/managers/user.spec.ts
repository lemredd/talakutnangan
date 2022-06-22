import type { RawBulkDataForStudents, RawBulkDataForEmployees } from "%/types/independent"

import Role from "%/models/role"
import UserManager from "./user"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import DepartmentFactory from "~/factories/department"

describe("Database: User Authentication Operations", () => {
	it("can find user using credentials", async () => {
		const role = await (new RoleFactory()).insertOne()
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		AttachedRole.create({ userID: user.id, roleID: role.id })
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser!.email).toStrictEqual(user.email)
		expect(foundUser!.roles).toHaveLength(1)
		expect(foundUser!.roles[0] instanceof Role).toBeTruthy()
		expect(foundUser!.department instanceof Department).toBeTruthy()
	})

	it("cannot search user with incorrect credentials", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).makeOne()
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser).toBeNull()
	})

	it("can reset password of existing user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const newPassword = "12345678"

		const isResetSuccess = await manager.resetPassword(user.id, newPassword)

		expect(isResetSuccess).toBeTruthy()
		expect(compare(
			newPassword,
			(await manager.findWithID(user.id))!.password,
		)).resolves.toBeTruthy()
	})

	it("can reset password of non-existing user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const newPassword = "12345678"

		const isResetSuccess = await manager.resetPassword(user.id+1, newPassword)

		expect(isResetSuccess).toBeFalsy()
		expect(compare(
			newPassword,
			(await manager.findWithID(user.id))!.password,
		)).resolves.toBeFalsy()
	})
})

describe("Database: User Create Operations", () => {
	it("can create students in bulk", async () => {
		const roles = await (new RoleFactory()).insertMany(3)
		const departments = await (new DepartmentFactory()).insertMany(2)
		const fakeUserA = await ((new UserFactory()).in(departments[0])).makeOne()
		const fakeUserB = await ((new UserFactory()).in(departments[1])).makeOne()
		const manager = new UserManager()
		const bulkData: RawBulkDataForStudents = {
			kind: "student",
			roles: roles.map(role => role.name),
			importedCSV: [
				{
					department: departments[0].acronym,
					email: fakeUserA.email,
					name: fakeUserA.name,
					password: fakeUserA.password,
					studentNumber: "1920-1"
				},
				{
					department: departments[1].acronym,
					email: fakeUserB.email,
					name: fakeUserB.name,
					password: fakeUserB.password,
					studentNumber: "1920-2"
				}
			]
		}

		const userData = await manager.bulkCreate(bulkData)

		expect(await StudentDetail.count()).toBe(2)
		expect(await AttachedRole.count()).toBe(6)
		expect(userData).toHaveProperty("data")
		expect(userData.data).toHaveLength(2)
		expect(userData.included).toHaveLength(5)
		expect(userData.included).toHaveProperty([ 0, "type" ], "role")
		expect(userData.included).toHaveProperty([ 1, "type" ], "role")
		expect(userData.included).toHaveProperty([ 2, "type" ], "role")
		expect(userData.included).toHaveProperty([ 3, "type" ], "department")
		expect(userData.included).toHaveProperty([ 4, "type" ], "department")
	})
})

describe("Database: User Read Operations", () => {
	it("can list users with incomplete profile", async () => {
		const manager = new UserManager()
		const incompleteUserProfile = await (new UserFactory()).hasNoSignature().insertOne()
		// Create dummy complete profile to see if it would return two records or not
		await (new UserFactory()).insertOne()

		const users = await manager.list({ criteria: "incomplete", page: 0 })

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(1)
	})

	it("can list users with complete profile", async () => {
		const manager = new UserManager()
		const completeUserProfile = await (new UserFactory()).insertOne()
		// Create dummy incomplete profile
		await (new UserFactory()).hasNoSignature().insertOne()

		const users = await manager.list({ criteria: "complete", page: 0 })

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(1)
	})

	it("can list all users", async () => {
		const manager = new UserManager()
		const completeUserProfile = await (new UserFactory()).insertOne()
		const incompleteUserProfile =await (new UserFactory()).hasNoSignature().insertOne()

		const users = await manager.list({ criteria: "all", page: 0 })

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(2)
	})
})

describe("Database: User Update Operations", () => {
	it("can verify user", async () => {
		const manager = new UserManager()
		const user = await ((new UserFactory()).notVerified()).insertOne()

		const verifiedUserCount = await manager.verify(user.email)

		expect(verifiedUserCount).toBe(1)
		expect((await manager.findWithID(user.id))!.emailVerifiedAt).not.toBeNull()
	})
})
