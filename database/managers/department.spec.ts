import DepartmentFactory from "~/factories/department"
import UserFactory from "~/factories/user"

import DeparmentManager from "./department"

describe("Database: Department read operations", () => {
	it("can count single department", async () => {
		const manager = new DeparmentManager()
		const department = await new DepartmentFactory().insertOne()
		await new UserFactory().in(department).insertOne()
		await new UserFactory().in(department).insertOne()

		const counts = await manager.countUsers([ department.id ])

		expect(counts).toHaveProperty("data.0.id", String(department.id))
		expect(counts).toHaveProperty("data.0.type", "department")
		expect(counts).toHaveProperty("data.0.meta.userCount", 2)
	})

	it("can count single department with zero users", async () => {
		const manager = new DeparmentManager()
		const department = await new DepartmentFactory().insertOne()

		const counts = await manager.countUsers([ department.id ])

		expect(counts).toHaveProperty("data.0.id", String(department.id))
		expect(counts).toHaveProperty("data.0.type", "department")
		expect(counts).toHaveProperty("data.0.meta.userCount", 0)
	})

	it("can count multiple departments", async () => {
		const manager = new DeparmentManager()
		const departmentA = await new DepartmentFactory().insertOne()
		const departmentB = await new DepartmentFactory().insertOne()
		await new UserFactory().in(departmentA).insertOne()
		await new UserFactory().in(departmentA).insertOne()
		await new UserFactory().in(departmentA).insertOne()
		await new UserFactory().in(departmentB).insertOne()
		await new UserFactory().in(departmentB).insertOne()

		const counts = await manager.countUsers([ departmentA.id, departmentB.id ])

		expect(counts).toHaveProperty("data.0.id", String(departmentA.id))
		expect(counts).toHaveProperty("data.0.type", "department")
		expect(counts).toHaveProperty("data.0.meta.userCount", 3)
		expect(counts).toHaveProperty("data.1.id", String(departmentB.id))
		expect(counts).toHaveProperty("data.1.type", "department")
		expect(counts).toHaveProperty("data.1.meta.userCount", 2)
	})
})
