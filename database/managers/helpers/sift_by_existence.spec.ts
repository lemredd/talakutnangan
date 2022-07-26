import User from "%/models/user"
import UserFactory from "~/factories/user"
import siftByExistence from "./sift_by_existence"

describe("Database Pipe: Sift by existence", () => {
	it("can find all", async () => {
		const user = await new UserFactory().insertOne()
		const archivedUser = await new UserFactory().insertOne()
		await archivedUser.destroy()

		const options = siftByExistence({}, { filter: { existence: "*" } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("paranoid", false)
		expect(foundUsers).toHaveLength(2)
		expect(foundUsers).toHaveProperty("0.id", user.id)
		expect(foundUsers).toHaveProperty("1.id", archivedUser.id)
	})

	it("can find existing only", async () => {
		const user = await new UserFactory().insertOne()
		const archivedUser = await new UserFactory().insertOne()
		await archivedUser.destroy()

		const options = siftByExistence({}, { filter: { existence: "exists" } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("paranoid", true)
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", user.id)
	})

	it("can find archived only", async () => {
		const user = await new UserFactory().insertOne()
		const archivedUser = await new UserFactory().insertOne()
		await archivedUser.destroy()

		const options = siftByExistence({}, { filter: { existence: "archived" } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("paranoid", false)
		expect(options).toHaveProperty("where")
		expect(foundUsers).toHaveLength(1)
		expect(foundUsers).toHaveProperty("0.id", archivedUser.id)
	})

	it("cannot find existing if all were archived", async () => {
		const user = await new UserFactory().insertOne()
		const archivedUser = await new UserFactory().insertOne()
		await archivedUser.destroy()
		await user.destroy()

		const options = siftByExistence({}, { filter: { existence: "exists" } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("paranoid", true)
		expect(foundUsers).toHaveLength(0)
	})

	it("cannot find archived if all are existing", async () => {
		const user = await new UserFactory().insertOne()
		const archivedUser = await new UserFactory().insertOne()

		const options = siftByExistence({}, { filter: { existence: "archived" } })
		const foundUsers = await User.findAll(options)

		expect(options).toHaveProperty("paranoid", false)
		expect(foundUsers).toHaveLength(0)
	})
})
