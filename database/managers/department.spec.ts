import UserFactory from "~/factories/user"
import Factory from "~/factories/department"
import DatabaseError from "$!/errors/database"

import Manager from "./department"

describe("Database Manager: Department read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()
		const user = await new UserFactory().in(model).insertOne()

		try {
			await manager.isModelBelongsTo(model.id, user.id, manager.modelChainToUser)
		} catch (error) {
			expect(error).toBeInstanceOf(DatabaseError)
		}
	})

	it("can count single model", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()
		await new UserFactory().in(model).insertOne()
		await new UserFactory().in(model).insertOne()

		const counts = await manager.countUsers([ model.id ])

		expect(counts).toHaveProperty("data.0.id", String(model.id))
		expect(counts).toHaveProperty("data.0.type", "department")
		expect(counts).toHaveProperty("data.0.meta.userCount", 2)
	})

	it("can count single model with zero users", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()

		const counts = await manager.countUsers([ model.id ])

		expect(counts).toHaveProperty("data.0.id", String(model.id))
		expect(counts).toHaveProperty("data.0.type", "department")
		expect(counts).toHaveProperty("data.0.meta.userCount", 0)
	})

	it("can count multiple departments", async() => {
		const manager = new Manager()
		const departmentA = await new Factory().insertOne()
		const departmentB = await new Factory().insertOne()
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
