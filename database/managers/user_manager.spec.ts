import Role from "%/models/role"
import UserManager from "./user_manager"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"

describe("Authentication: Search user with credentials", () => {
	it("can search user", async () => {
		const role = await (new RoleFactory()).insertOne()
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		AttachedRole.create({ userID: user.id, roleID: role.id })
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser!.email).toStrictEqual(user.email)
		expect(foundUser!.roles).toHaveLength(1)
		expect(foundUser!.roles[0] instanceof Role).toBeTruthy()
		expect(foundUser!.department instanceof Department).toBeTruthy()
	})

	it("cannot search user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).makeOne()
		const { email, password } = user

		const foundUser = await manager.findWithCredentials(email, password)

		expect(foundUser).toBeNull()
	})

	it("can reset password of existing user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const newPassword = "12345678"

		const isResetSuccess = await manager.resetPassword(user.id, newPassword)

		expect(isResetSuccess).toBeTruthy()
		expect(compare(
			newPassword,
			(await manager.findWithID(user.id))!.password,
		)).resolves.toBeTruthy()
	})

	it("can reset password of non-existing user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const newPassword = "12345678"

		const isResetSuccess = await manager.resetPassword(user.id+1, newPassword)

		expect(isResetSuccess).toBeFalsy()
		expect(compare(
			newPassword,
			(await manager.findWithID(user.id))!.password,
		)).resolves.toBeFalsy()
	})
})

describe("General: Search user with ID", () => {
	it("can search user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const id = user.id

		const foundUser = await manager.findWithID(id)

		expect(foundUser!.email).toStrictEqual(user.email)
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
		expect((await manager.findWithID(user.id))!.admittedAt).not.toBeNull()
	})

	it.todo("can reject user")

	it("can verify user", async () => {
		const manager = new UserManager()
		const user = await ((new UserFactory()).notVerified()).insertOne()

		const verifiedUserCount = await manager.verify(user.email)

		expect(verifiedUserCount).toBe(1)
		expect((await manager.findWithID(user.id))!.emailVerifiedAt).not.toBeNull()
	})
})
