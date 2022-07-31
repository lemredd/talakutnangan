import Role from "%/models/role"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"

import countUsers from "./count_users"

describe("Database Pipe: Count users", () => {
	it("can count single role", async () => {
		const role = await new RoleFactory().insertOne()
		await new UserFactory().attach(role).insertOne()
		await new UserFactory().attach(role).insertOne()

		const options = countUsers({}, { meta: { countUser: true } })
		const { count, rows: foundRoles } = await Role.findAndCountAll(options)

		expect(options).toHaveProperty("group")
		expect(options).toHaveProperty("include")
		expect(count).toHaveProperty("0.count", 2)
		expect(foundRoles).toHaveLength(1)
		expect(foundRoles).toHaveProperty("0.id", role.id)
	})

	it("can count multiple roles", async () => {
		const roleA = await new RoleFactory().insertOne()
		const roleB = await new RoleFactory().insertOne()
		await new UserFactory().attach(roleA).insertOne()
		await new UserFactory().attach(roleA).insertOne()
		await new UserFactory().attach(roleA).insertOne()
		await new UserFactory().attach(roleB).insertOne()
		await new UserFactory().attach(roleB).insertOne()

		const options = countUsers({}, { meta: { countUser: true } })
		const { count, rows: foundRoles } = await Role.findAndCountAll(options)

		expect(options).toHaveProperty("group")
		expect(options).toHaveProperty("include")
		expect(count).toHaveProperty("0.count", 3)
		expect(count).toHaveProperty("1.count", 2)
		expect(foundRoles).toHaveLength(2)
		expect(foundRoles).toHaveProperty("0.id", roleA.id)
		expect(foundRoles).toHaveProperty("1.id", roleB.id)
	})
})
