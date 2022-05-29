import UserManager from "./user_manager"
import UserFactory from "~/factories/user"

describe("Authentication: Search user by credentials", () => {
	it("can search user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const { email, password } = user

		const foundUser = await manager.searchUserByCredentials(email, password)

		expect(foundUser.email).toStrictEqual(user.email)
		expect(foundUser.password).toStrictEqual(user.password)
	})

	it("cannot search user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).makeOne()
		const { email, password } = user

		const foundUser = await manager.searchUserByCredentials(email, password)

		expect(foundUser).toBeNull()
	})
})
