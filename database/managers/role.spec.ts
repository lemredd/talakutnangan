import RoleFactory from "~/factories/role"

import RoleManager from "./role"

describe("Database: Role read operations", () => {
	it("can search role with matching query", async () => {
		const manager = new RoleManager()
		const role = await (new RoleFactory()).insertOne()
		const incompleteName = role.name.slice(1)

		const roles = await manager.list({
			name: incompleteName,
			filter: {
				existence: "exists"
			},
			page: 0,
			limit: 1
		})

		expect(roles).toHaveProperty("data")
		expect(roles.data).toHaveLength(1)
	})

	it("cannot search role with non-matching query", async () => {
		const manager = new RoleManager()
		const role = await (new RoleFactory()).insertOne()
		const incorrectName = role.name + "1"

		const roles = await manager.list({
			name: incorrectName,
			filter: {
				existence: "exists"
			},
			page: 0,
			limit: 1
		})

		expect(roles).toHaveProperty("data")
		expect(roles.data).toHaveLength(0)
	})
})
