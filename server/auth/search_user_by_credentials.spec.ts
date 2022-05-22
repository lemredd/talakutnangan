import Database from "~/database"
import User from "!/models/user"
import UserFactory from "~/factories/user"
import searchUserByCredentials from "./search_user_by_credentials"

describe("Authentication: Search user by credentials", () => {
	it("can search user", async () => {
		const manager = Database.manager
		const user = await (new UserFactory()).insertOne()
		const { email, password } = user

		const foundUser = await searchUserByCredentials(manager, email, password)

		expect(foundUser).toStrictEqual(user)
	})
})
