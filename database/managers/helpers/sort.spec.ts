import User from "%/models/user"
import UserFactory from "~/factories/user"
import sort from "./sort"

describe("Database Pipe: Sift by existence", () => {
	it("can sort in ascending order", async () => {
		const users = await (await new UserFactory().insertMany(3)).sort((a, b) => {
			return a.name.localeCompare(b.name)
		})

		const options = sort({}, { sort: [ "name" ] })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("order.0.0", "name")
		expect(options).toHaveProperty("order.0.1", "ASC")
		expect(foundUsers).toHaveLength(3)
		expect(foundUsers).toHaveProperty("0.id", users[0].id)
		expect(foundUsers).toHaveProperty("1.id", users[1].id)
		expect(foundUsers).toHaveProperty("2.id", users[2].id)
	})

	it("can sort in descending order", async () => {
		const users = await (await new UserFactory().insertMany(3)).sort((a, b) => {
			return a.name.localeCompare(b.name)
		})

		const options = sort({}, { sort: [ "name" ] })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("order.0.0", "name")
		expect(options).toHaveProperty("order.0.1", "DESC")
		expect(foundUsers).toHaveLength(3)
		expect(foundUsers).toHaveProperty("0.id", users[2].id)
		expect(foundUsers).toHaveProperty("1.id", users[1].id)
		expect(foundUsers).toHaveProperty("2.id", users[0].id)
	})
})
