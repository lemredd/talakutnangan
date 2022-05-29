import UserManager from "./user_manager"
import UserFactory from "~/factories/user"

describe("Authentication: Search user with credentials", () => {
	it("can search user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser.email).toStrictEqual(user.email)
		expect(foundUser.password).toStrictEqual(user.password)
	})

	it("cannot search user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).makeOne()
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser).toBeNull()
	})
})

describe("General: Search user with ID", () => {
	it("can search user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const id = user.id

		const foundUser = await manager.findWithID(id)

		expect(foundUser.email).toStrictEqual(user.email)
		expect(foundUser.password).toStrictEqual(user.password)
	})

	it("cannot search user", async () => {
		const manager = new UserManager()
		const id = 0

		const foundUser = await manager.findWithID(id)

		expect(foundUser).toBeNull()
	})
})
