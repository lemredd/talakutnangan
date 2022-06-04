import UserManager from "./user_manager"
import UserFactory from "~/factories/user"
import compare from "!/helpers/auth/compare"

describe("Authentication: Search user with credentials", () => {
	it("can search user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser.email).toStrictEqual(user.email)
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
	})

	it("cannot search user", async () => {
		const manager = new UserManager()
		const id = 0

		const foundUser = await manager.findWithID(id)

		expect(foundUser).toBeNull()
	})
})

describe("General: Basic CRUD", () => {
	it("can create user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).makeOne()

		const foundUser = await manager.create(user.toJSON())

		expect(foundUser.email).toStrictEqual(user.email)
		expect(compare(user.password, foundUser.password)).resolves.toBeTruthy()
	})

	it.todo("read user profile")
	it.todo("update user profile")
	it.todo("archive user")
	it.todo("restore user")
})

describe("Extra: Custom Operations", () => {
	it("can list unadmitted users", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()

		const foundUsers = await manager.list("unadmitted")

		expect(foundUsers).toHaveLength(1)
		expect(foundUsers[0].email).toStrictEqual(user.email)
	})

	it.todo("can list admitted users")
	it.todo("can list incomplete users")

	it("can admit user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()

		const admittedUserCount = await manager.admit(user.id, true)

		expect(admittedUserCount).toBe(1)
		expect((await manager.findWithID(user.id)).admittedAt).not.toBeNull()
	})

	it.todo("can reject user")

	it("can verify user", async () => {
		const manager = new UserManager()
		const user = await ((new UserFactory()).notVerified()).insertOne()

		const verifiedUserCount = await manager.verify(user.email)

		expect(verifiedUserCount).toBe(1)
		expect((await manager.findWithID(user.id)).emailVerifiedAt).not.toBeNull()
	})
})
