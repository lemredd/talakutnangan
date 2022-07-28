import User from "%/models/user"
import UserFactory from "~/factories/user"
import page from "./page"

describe("Database Pipe: Page", () => {
	it("can page initially", async () => {
		const users = await (await new UserFactory().insertMany(4)).sort((a, b) => {
			return a.id === b.id ? 0 : a.id < b.id ? -1 : 1
		})

		const options = page({}, { page: { offset: 0, limit: 2 } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("offset", 0)
		expect(options).toHaveProperty("limit", 2)
		expect(foundUsers).toHaveLength(2)
		expect(foundUsers).toHaveProperty("0.id", users[0].id)
		expect(foundUsers).toHaveProperty("1.id", users[1].id)
	})

	it("can page consecutively", async () => {
		const users = await (await new UserFactory().insertMany(6)).sort((a, b) => {
			return a.id === b.id ? 0 : a.id < b.id ? -1 : 1
		})

		const options = page({}, { page: { offset: 2, limit: 2 } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("offset", 2)
		expect(options).toHaveProperty("limit", 2)
		expect(foundUsers).toHaveLength(2)
		expect(foundUsers).toHaveProperty("0.id", users[2].id)
		expect(foundUsers).toHaveProperty("1.id", users[3].id)
	})
})
