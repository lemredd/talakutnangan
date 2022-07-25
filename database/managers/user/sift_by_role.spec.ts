import User from "%/models/user"
import Role from "%/models/role"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"

import siftByRole from "./sift_by_role"

describe("Database Pipe: Sift by role", () => {
	it("can find all", async () => {
		const role = await new RoleFactory().insertOne()
		const user = await new UserFactory().attach(role).insertOne()

		const options = siftByRole({}, { filter: { role: "*" } })
		const foundUsers = await User.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
	})

	it("can find on specific role", async () => {
		const role = await new RoleFactory().insertOne()
		const user = await new UserFactory().attach(role).insertOne()

		const options = siftByRole({}, {
			filter: {
				role: role.name
			}
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.0.where.name")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
		expect(foundUsers).toHaveProperty("0.roles.0.id", role.id)
	})

	it("can find on with existing role model", async () => {
		const role = await new RoleFactory().insertOne()
		const user = await new UserFactory().attach(role).insertOne()

		const options = siftByRole({ include: [Role] }, {
			filter: {
				role: role.name
			}
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.1.where.name")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
		expect(foundUsers).toHaveProperty("0.roles.0.id", role.id)
	})

	it("cannot find on empty role", async () => {
		const roleA = await new RoleFactory().insertOne()
		const roleB = await new RoleFactory().insertOne()
		const user = await new UserFactory().attach(roleA).insertOne()

		const options = siftByRole({}, {
			filter: {
				role: roleB.name
			}
		})
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("include.0.where.name")
		expect(foundUsers).toHaveLength(0)
	})
})
