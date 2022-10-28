/* eslint-disable no-magic-numbers */
import type { RawBulkDataForStudents, RawBulkDataForEmployees } from "%/types/independent"

import compare from "$!/auth/compare"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import Model from "%/models/user"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import EmployeeSchedule from "%/models/employee_schedule"

import Factory from "~/factories/user"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import Manager from "./user"

describe("Database Manager: User authentication operations", () => {
	it("can find user using credentials", async() => {
		const role = await new RoleFactory().insertOne()
		const manager = new Manager()
		const user = await new Factory().insertOne()
		await AttachedRole.create({
			"roleID": role.id,
			"userID": user.id
		})
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser).not.toBeNull()
		expect(foundUser).toHaveProperty("data.attributes.email", user.email)
		expect(foundUser).toHaveProperty("data.relationships.department")
		expect(foundUser).toHaveProperty("included.0.id", user.departmentID)
		expect(foundUser).toHaveProperty("data.relationships.roles")
		expect(foundUser).toHaveProperty("included.1.attributes.name", role.name)
	})

	it("cannot search user with incorrect credentials", async() => {
		const manager = new Manager()
		const user = await new Factory().makeOne()
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser).toBeNull()
	})

	it("can reset password of existing user", async() => {
		const manager = new Manager()
		const user = await new Factory().insertOne()
		const newPassword = "12345678"

		const isResetSuccess = await manager.resetPassword(user.id, newPassword)

		expect(isResetSuccess).toBeTruthy()
		const foundUser = await Model.findByPk(user.id) as Model
		expect(compare(
			newPassword,
			foundUser.password
		)).resolves.toBeTruthy()
	})

	it("can reset password of non-existing user", async() => {
		const manager = new Manager()
		const user = await new Factory().insertOne()
		const newPassword = "12345678"

		const isResetSuccess = await manager.resetPassword(user.id + 1, newPassword)

		expect(isResetSuccess).toBeFalsy()
		const foundUser = await Model.findOne({ "where": { "id": user.id } }) as Model
		expect(compare(
			newPassword,
			foundUser.password
		)).resolves.toBeFalsy()
	})
})

describe("Database Manager: User read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const user = await new Factory().insertOne()

		const doesBelong = await manager.isModelBelongsTo(user.id, user.id, manager.modelChainToUser)

		expect(doesBelong).toBeTruthy()
	})

	it("can search user with matching query", async() => {
		const manager = new Manager()
		const user = await new Factory().insertOne()
		const incompleteName = user.name.slice(0, user.name.length - 2)

		const users = await manager.list({
			"filter": {
				"department": "*",
				"existence": "exists",
				"kind": "*",
				"role": "*",
				"slug": incompleteName
			},
			"page": {
				"limit": 5,
				"offset": 0
			},
			"sort": []
		})

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(1)
	})

	it("cannot search user with non-matching query", async() => {
		const manager = new Manager()
		const user = await new Factory().insertOne()
		const incorrectName = `${user.name}133`

		const users = await manager.list({
			"filter": {
				"department": "*",
				"existence": "exists",
				"kind": "*",
				"role": "*",
				"slug": incorrectName
			},
			"page": {
				"limit": 5,
				"offset": 0
			},
			"sort": []
		})

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(0)
	})

	it("can get unreachable employees", async() => {
		const manager = new Manager()
		await new Factory().beUnreachableEmployee().insertOne()

		const users = await manager.list({
			"filter": {
				"department": "*",
				"existence": "exists",
				"kind": "unreachable_employee",
				"role": "*",
				"slug": ""
			},
			"page": {
				"limit": 5,
				"offset": 0
			},
			"sort": []
		})

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(1)
	})
})

describe("Database Manager: User create operations", () => {
	it("can create students in bulk", async() => {
		const roles = await new RoleFactory().insertMany(3)
		const departments = await new DepartmentFactory().insertMany(2)
		const fakeUserA = await new Factory().in(departments[0]).makeOne()
		const fakeUserB = await new Factory().in(departments[1]).makeOne()
		const manager = new Manager()
		const bulkData: RawBulkDataForStudents = {
			"importedCSV": [
				{
					"department": departments[0].acronym,
					"email": fakeUserA.email,
					"name": fakeUserA.name,
					"password": fakeUserA.password,
					"prefersDark": false,
					"studentNumber": "1920-1"
				},
				{
					"department": departments[1].acronym,
					"email": fakeUserB.email,
					"name": fakeUserB.name,
					"password": fakeUserB.password,
					"prefersDark": false,
					"studentNumber": "1920-2"
				}
			],
			"kind": "student",
			"roles": roles.map(role => role.id)
		}

		const userData = await manager.bulkCreate(bulkData)

		expect(await StudentDetail.count()).toBe(2)
		expect(await AttachedRole.count()).toBe(6)
		expect(userData).toHaveProperty("data")
		expect(userData.data).toHaveLength(2)
		expect(userData.included).toHaveLength(7)
		expect(userData).toHaveProperty("included.0.type", "department")
		expect(userData).toHaveProperty("included.1.type", "department")
		expect(userData).toHaveProperty("included.2.type", "role")
		expect(userData).toHaveProperty("included.3.type", "role")
		expect(userData).toHaveProperty("included.4.type", "role")
		expect(userData).toHaveProperty("included.5.type", "student_detail")
		expect(userData).toHaveProperty("included.6.type", "student_detail")
	})

	it("can create reachable employees in bulk", async() => {
		const roles = await new RoleFactory().insertMany(2)
		const departments = await new DepartmentFactory().insertMany(3)
		const fakeUserA = await new Factory().in(departments[0]).makeOne()
		const fakeUserB = await new Factory().in(departments[1]).makeOne()
		const fakeUserC = await new Factory().in(departments[2]).makeOne()
		const manager = new Manager()
		const bulkData: RawBulkDataForEmployees = {
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
			],
			"kind": "reachable_employee",
			"roles": roles.map(role => role.id)
		}

		const userData = await manager.bulkCreate(bulkData)

		expect(await AttachedRole.count()).toBe(6)
		expect(await EmployeeSchedule.count()).toBe(15)
		expect(userData).toHaveProperty("data")
		expect(userData.data).toHaveLength(3)
		expect(userData.included).toHaveLength(20)
		expect(userData).toHaveProperty("included.0.type", "department")
		expect(userData).toHaveProperty("included.1.type", "department")
		expect(userData).toHaveProperty("included.2.type", "department")
		expect(userData).toHaveProperty("included.3.type", "employee_schedule")
		expect(userData).toHaveProperty(
			"included.3.attributes.scheduleStart",
			convertTimeToMinutes("08:00")
		)
		expect(userData).toHaveProperty(
			"included.3.attributes.scheduleEnd",
			convertTimeToMinutes("17:00")
		)
		expect(userData).toHaveProperty("included.4.type", "employee_schedule")
		expect(userData).toHaveProperty("included.5.type", "employee_schedule")
		expect(userData).toHaveProperty("included.6.type", "employee_schedule")
		expect(userData).toHaveProperty("included.7.type", "employee_schedule")
		expect(userData).toHaveProperty("included.8.type", "employee_schedule")
		expect(userData).toHaveProperty("included.9.type", "employee_schedule")
		expect(userData).toHaveProperty("included.10.type", "employee_schedule")
		expect(userData).toHaveProperty("included.11.type", "employee_schedule")
		expect(userData).toHaveProperty("included.12.type", "employee_schedule")
		expect(userData).toHaveProperty("included.13.type", "employee_schedule")
		expect(userData).toHaveProperty("included.14.type", "employee_schedule")
		expect(userData).toHaveProperty("included.15.type", "employee_schedule")
		expect(userData).toHaveProperty("included.16.type", "employee_schedule")
		expect(userData).toHaveProperty("included.17.type", "employee_schedule")
		expect(userData).toHaveProperty("included.18.type", "role")
		expect(userData).toHaveProperty("included.19.type", "role")
		expect(userData).not.toHaveProperty("included.20")
	})

	it("can create unreachable employees in bulk", async() => {
		const roles = await new RoleFactory().insertMany(2)
		const departments = await new DepartmentFactory().insertMany(3)
		const fakeUserA = await new Factory().in(departments[0]).makeOne()
		const fakeUserB = await new Factory().in(departments[1]).makeOne()
		const fakeUserC = await new Factory().in(departments[2]).makeOne()
		const manager = new Manager()
		const bulkData: RawBulkDataForEmployees = {
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
			],
			"kind": "unreachable_employee",
			"roles": roles.map(role => role.id)
		}

		const userData = await manager.bulkCreate(bulkData)

		expect(await AttachedRole.count()).toBe(6)
		expect(await EmployeeSchedule.count()).toBe(0)
		expect(userData).toHaveProperty("data")
		expect(userData.data).toHaveLength(3)
		expect(userData.included).toHaveLength(5)
		expect(userData).toHaveProperty("included.0.type", "department")
		expect(userData).toHaveProperty("included.1.type", "department")
		expect(userData).toHaveProperty("included.2.type", "department")
		expect(userData).toHaveProperty("included.3.type", "role")
		expect(userData).toHaveProperty("included.4.type", "role")
	})
})

describe("Database Manager: User update operations", () => {
	it("can verify user", async() => {
		const manager = new Manager()
		const user = await new Factory().notVerified().insertOne()

		const verifiedUserCount = await manager.verify(user.id)

		expect(verifiedUserCount).toBe(1)
		const foundUser = await Model.findOne({ "where": { "id": user.id } }) as Model
		expect(foundUser.emailVerifiedAt).not.toBeNull()
	})
})

describe("Database Manager: Miscellaneous operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

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
