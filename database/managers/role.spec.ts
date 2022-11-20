import Factory from "~/factories/role"
import UserFactory from "~/factories/user"
import Condition from "%/helpers/condition"
import DatabaseError from "$!/errors/database"
import AttachedRole from "%/models/attached_role"

import Manager from "./role"

describe("Database Manager: Role read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()
		const user = await new UserFactory().attach(model).insertOne()

		try {
			await manager.isModelBelongsTo(model.id, user.id, manager.modelChainToUser)
		} catch (error) {
			expect(error).toBeInstanceOf(DatabaseError)
		}
	})

	it("can check if there is an attached user with only one role", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()
		await new UserFactory().attach(model).insertOne()

		const isTheOnlyRole = await manager.isTheOnlyRoleToAnyUser(model.id)

		expect(isTheOnlyRole).toBeTruthy()
	})

	it("can check if there is an attached user with many role", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()
		const otherModel = await new Factory().insertOne()
		await new UserFactory().attach(model).attach(otherModel).insertOne()

		const isTheOnlyRole = await manager.isTheOnlyRoleToAnyUser(model.id)

		expect(isTheOnlyRole).toBeFalsy()
	})

	it("cannot check for unattached user", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()
		const otherModel = await new Factory().insertOne()
		await new UserFactory().attach(model).insertOne()

		const isTheOnlyRole = await manager.isTheOnlyRoleToAnyUser(otherModel.id)

		expect(isTheOnlyRole).toBeFalsy()
	})

	it("can check if there is a user has surviving roles", async() => {
		const manager = new Manager()
		const modelA = await new Factory().insertOne()
		const modelB = await new Factory().insertOne()
		const otherModel = await new Factory().insertOne()
		await new UserFactory().attach(modelA).attach(modelB).attach(otherModel).insertOne()
		await new UserFactory().attach(modelA).attach(modelB).insertOne()

		const canRolesBeDeLeted = await manager.canRolesBeDeLeted([
			modelA.id,
			modelB.id
		])

		expect(canRolesBeDeLeted).toBeFalsy()
	})

	it("can check if there a user has other roles surviving", async() => {
		const manager = new Manager()
		const modelA = await new Factory().insertOne()
		const modelB = await new Factory().insertOne()
		const otherModelA = await new Factory().insertOne()
		const otherModelB = await new Factory().insertOne()
		await new UserFactory().attach(modelA).attach(modelB).attach(otherModelA).insertOne()
		await new UserFactory().attach(modelA).attach(modelB).attach(otherModelB).insertOne()

		const canRolesBeDeLeted = await manager.canRolesBeDeLeted([
			modelA.id,
			modelB.id
		])

		expect(canRolesBeDeLeted).toBeTruthy()
	})

	it("can count single model", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()
		await new UserFactory().attach(model).insertOne()
		await new UserFactory().attach(model).insertOne()

		const counts = await manager.countUsers([ model.id ])

		expect(counts).toHaveProperty("data.0.id", String(model.id))
		expect(counts).toHaveProperty("data.0.type", "role")
		expect(counts).toHaveProperty("data.0.meta.userCount", 2)
	})

	it("can count single model with zero users", async() => {
		const manager = new Manager()
		const model = await new Factory().insertOne()

		const counts = await manager.countUsers([ model.id ])

		expect(counts).toHaveProperty("data.0.id", String(model.id))
		expect(counts).toHaveProperty("data.0.type", "role")
		expect(counts).toHaveProperty("data.0.meta.userCount", 0)
	})

	it("can count multiple roles", async() => {
		const manager = new Manager()
		const roleA = await new Factory().insertOne()
		const roleB = await new Factory().insertOne()
		await new UserFactory().attach(roleA).insertOne()
		await new UserFactory().attach(roleA).insertOne()
		await new UserFactory().attach(roleA).insertOne()
		await new UserFactory().attach(roleB).insertOne()
		await new UserFactory().attach(roleB).insertOne()

		const counts = await manager.countUsers([ roleA.id, roleB.id ])

		expect(counts).toHaveProperty("data.0.id", String(roleA.id))
		expect(counts).toHaveProperty("data.0.type", "role")
		expect(counts).toHaveProperty("data.0.meta.userCount", 3)
		expect(counts).toHaveProperty("data.1.id", String(roleB.id))
		expect(counts).toHaveProperty("data.1.type", "role")
		expect(counts).toHaveProperty("data.1.meta.userCount", 2)
	})

	it("can search user with matching query", async() => {
		const manager = new Manager()
		const user = await new Factory().insertOne()
		const incompleteName = user.name.slice(0, user.name.length - 2)

		const users = await manager.list({
			"filter": {
				"department": "*",
				"existence": "exists",
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
})

describe("Database Manager: Role update operations", () => {
	it("can reattach roles", async() => {
		const roles = await new Factory().insertMany(4)
		const manager = new Manager()
		const user = await new UserFactory().attach(roles[0]).attach(roles[1]).insertOne()

		await manager.reattach(user.id, [
			roles[1].id,
			roles[2].id,
			roles[3].id
		])

		const attachedRoles = await AttachedRole.findAll({
			"where": new Condition().equal("userID", user.id).build()
		})
		expect(attachedRoles).toHaveLength(3)
		expect(attachedRoles).toHaveProperty("0.roleID", roles[1].id)
		expect(attachedRoles).toHaveProperty("1.roleID", roles[2].id)
		expect(attachedRoles).toHaveProperty("2.roleID", roles[3].id)
	})
})
