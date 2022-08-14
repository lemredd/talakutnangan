import type { RawBulkDataForStudents, RawBulkDataForEmployees } from "%/types/independent"

import User from "%/models/user"
import UserManager from "./user"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import compare from "$!/auth/compare"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import DepartmentFactory from "~/factories/department"
import EmployeeSchedule from "%/models/employee_schedule"

describe("Database: User Authentication Operations", () => {
	it("can find user using credentials", async() => {
		const role = await new RoleFactory().insertOne()
		const manager = new UserManager()
		const user = await new UserFactory().insertOne()
		await AttachedRole.create({ "userID": user.id,
			"roleID": role.id })
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser).not.toBeNull()
		expect(foundUser).toHaveProperty("data.attributes.email", user.email)
		expect(foundUser).toHaveProperty("data.relationships.roles")
		expect(foundUser).toHaveProperty("included.0.attributes.name", role.name)
		expect(foundUser).toHaveProperty("data.relationships.department")
		expect(foundUser).toHaveProperty("included.1.id", user.departmentID)
	})

	it("cannot search user with incorrect credentials", async() => {
		const manager = new UserManager()
		const user = await new UserFactory().makeOne()
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser).toBeNull()
	})

	it("can reset password of existing user", async() => {
		const manager = new UserManager()
		const user = await new UserFactory().insertOne()
		const newPassword = "12345678"

		const isResetSuccess = await manager.resetPassword(user.id, newPassword)

		expect(isResetSuccess).toBeTruthy()
		expect(compare(
			newPassword,
			(await User.findByPk(user.id))!.password
		)).resolves.toBeTruthy()
	})

	it("can reset password of non-existing user", async() => {
		const manager = new UserManager()
		const user = await new UserFactory().insertOne()
		const newPassword = "12345678"

		const isResetSuccess = await manager.resetPassword(user.id + 1, newPassword)

		expect(isResetSuccess).toBeFalsy()
		expect(compare(
			newPassword,
			(await User.findOne({ "where": { "id": user.id } }))!.password
		)).resolves.toBeFalsy()
	})
})

describe("Database: User read operations", () => {
	it("can search user with matching query", async() => {
		const manager = new UserManager()
		const user = await new UserFactory().insertOne()
		const incompleteName = user.name.slice(0, user.name.length - 2)

		const users = await manager.list({
			"filter": {
				"slug": incompleteName,
				"department": "*",
				"role": "*",
				"kind": "*",
				"existence": "exists"
			},
			"sort": [],
			"page": {
				"offset": 0,
				"limit": 5
			}
		})

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(1)
	})

	it("cannot search user with non-matching query", async() => {
		const manager = new UserManager()
		const user = await new UserFactory().insertOne()
		const incorrectName = `${user.name}133`

		const users = await manager.list({
			"filter": {
				"slug": incorrectName,
				"department": "*",
				"role": "*",
				"kind": "*",
				"existence": "exists"
			},
			"sort": [],
			"page": {
				"offset": 0,
				"limit": 5
			}
		})

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(0)
	})

	it("can get unreachable employees", async() => {
		const manager = new UserManager()
		await new UserFactory().beUnreachableEmployee().insertOne()

		const users = await manager.list({
			"filter": {
				"slug": "",
				"department": "*",
				"role": "*",
				"kind": "unreachable_employee",
				"existence": "exists"
			},
			"sort": [],
			"page": {
				"offset": 0,
				"limit": 5
			}
		})

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(1)
	})
})

describe("Database: User Create Operations", () => {
	it("can create students in bulk", async() => {
		const roles = await new RoleFactory().insertMany(3)
		const departments = await new DepartmentFactory().insertMany(2)
		const fakeUserA = await new UserFactory().in(departments[0]).makeOne()
		const fakeUserB = await new UserFactory().in(departments[1]).makeOne()
		const manager = new UserManager()
		const bulkData: RawBulkDataForStudents = {
			"kind": "student",
			"roles": roles.map(role => role.id),
			"importedCSV": [
				{
					"department": departments[0].acronym,
					"email": fakeUserA.email,
					"name": fakeUserA.name,
					"password": fakeUserA.password,
					"studentNumber": "1920-1",
					"prefersDark": false
				},
				{
					"department": departments[1].acronym,
					"email": fakeUserB.email,
					"name": fakeUserB.name,
					"password": fakeUserB.password,
					"studentNumber": "1920-2",
					"prefersDark": false
				}
			]
		}

		const userData = await manager.bulkCreate(bulkData)

		expect(await StudentDetail.count()).toBe(2)
		expect(await AttachedRole.count()).toBe(6)
		expect(userData).toHaveProperty("data")
		expect(userData.data).toHaveLength(2)
		expect(userData.included).toHaveLength(7)
		expect(userData.included).toHaveProperty([ 0, "type" ], "role")
		expect(userData.included).toHaveProperty([ 1, "type" ], "role")
		expect(userData.included).toHaveProperty([ 2, "type" ], "role")
		expect(userData.included).toHaveProperty([ 3, "type" ], "department")
		expect(userData.included).toHaveProperty([ 4, "type" ], "department")
		expect(userData.included).toHaveProperty([ 5, "type" ], "student_detail")
		expect(userData.included).toHaveProperty([ 6, "type" ], "student_detail")
	})

	it("can create reachable employees in bulk", async() => {
		const roles = await new RoleFactory().insertMany(2)
		const departments = await new DepartmentFactory().insertMany(3)
		const fakeUserA = await new UserFactory().in(departments[0]).makeOne()
		const fakeUserB = await new UserFactory().in(departments[1]).makeOne()
		const fakeUserC = await new UserFactory().in(departments[2]).makeOne()
		const manager = new UserManager()
		const bulkData: RawBulkDataForEmployees = {
			"kind": "reachable_employee",
			"roles": roles.map(role => role.id),
			"importedCSV": [
				{
					"department": departments[0].acronym,
					"email": fakeUserA.email,
					"name": fakeUserA.name,
					"password": fakeUserA.password,
					"prefersDark": false
				},
				{
					"department": departments[1].acronym,
					"email": fakeUserB.email,
					"name": fakeUserB.name,
					"password": fakeUserB.password,
					"prefersDark": false
				},
				{
					"department": departments[2].acronym,
					"email": fakeUserC.email,
					"name": fakeUserC.name,
					"password": fakeUserC.password,
					"prefersDark": false
				}
			]
		}

		const userData = await manager.bulkCreate(bulkData)

		expect(await AttachedRole.count()).toBe(6)
		expect(await EmployeeSchedule.count()).toBe(15)
		expect(userData).toHaveProperty("data")
		expect(userData.data).toHaveLength(3)
		expect(userData.included).toHaveLength(5)
		expect(userData.included).toHaveProperty([ 0, "type" ], "role")
		expect(userData.included).toHaveProperty([ 1, "type" ], "role")
		expect(userData.included).toHaveProperty([ 2, "type" ], "department")
		expect(userData.included).toHaveProperty([ 3, "type" ], "department")
		expect(userData.included).toHaveProperty([ 4, "type" ], "department")
	})

	it("can create unreachable employees in bulk", async() => {
		const roles = await new RoleFactory().insertMany(2)
		const departments = await new DepartmentFactory().insertMany(3)
		const fakeUserA = await new UserFactory().in(departments[0]).makeOne()
		const fakeUserB = await new UserFactory().in(departments[1]).makeOne()
		const fakeUserC = await new UserFactory().in(departments[2]).makeOne()
		const manager = new UserManager()
		const bulkData: RawBulkDataForEmployees = {
			"kind": "unreachable_employee",
			"roles": roles.map(role => role.id),
			"importedCSV": [
				{
					"department": departments[0].acronym,
					"email": fakeUserA.email,
					"name": fakeUserA.name,
					"password": fakeUserA.password,
					"prefersDark": false
				},
				{
					"department": departments[1].acronym,
					"email": fakeUserB.email,
					"name": fakeUserB.name,
					"password": fakeUserB.password,
					"prefersDark": false
				},
				{
					"department": departments[2].acronym,
					"email": fakeUserC.email,
					"name": fakeUserC.name,
					"password": fakeUserC.password,
					"prefersDark": false
				}
			]
		}

		const userData = await manager.bulkCreate(bulkData)

		expect(await AttachedRole.count()).toBe(6)
		expect(await EmployeeSchedule.count()).toBe(0)
		expect(userData).toHaveProperty("data")
		expect(userData.data).toHaveLength(3)
		expect(userData.included).toHaveLength(5)
		expect(userData.included).toHaveProperty([ 0, "type" ], "role")
		expect(userData.included).toHaveProperty([ 1, "type" ], "role")
		expect(userData.included).toHaveProperty([ 2, "type" ], "department")
		expect(userData.included).toHaveProperty([ 3, "type" ], "department")
		expect(userData.included).toHaveProperty([ 4, "type" ], "department")
	})
})

describe("Database: User Update Operations", () => {
	it("can verify user", async() => {
		const manager = new UserManager()
		const user = await new UserFactory().notVerified().insertOne()

		const verifiedUserCount = await manager.verify(user.id)

		expect(verifiedUserCount).toBe(1)
		expect((await User.findOne({ "where": { "id": user.id } }))!.emailVerifiedAt).not.toBeNull()
	})
})

describe("Database: Miscellaneous operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new UserManager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-deletedAt",
			"-email",
			"-emailVerifiedAt",
			"-id",
			"-kind",
			"-name",
			"-updatedAt",
			"createdAt",
			"deletedAt",
			"email",
			"emailVerifiedAt",
			"id",
			"kind",
			"name",
			"updatedAt"
		])
	})
})
