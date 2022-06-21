import { faker } from "@faker-js/faker"

import User from "%/models/user"
import Role from "%/models/role"
import UserManager from "./user"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import compare from "!/helpers/auth/compare"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"

describe("Database: User Authentication Operations", () => {
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

describe("Database: User Read Operations", () => {
	it("can search existing user with ID", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		const id = user.id

		const foundUser = await manager.findWithID(id)

		expect(foundUser!.email).toStrictEqual(user.email)
	})

	it("cannot search non-existing user with ID", async () => {
		const manager = new UserManager()
		const id = 0

		const foundUser = await manager.findWithID(id)

		expect(foundUser).toBeNull()
	})

	it("can list users with incomplete profile", async () => {
		const manager = new UserManager()
		const incompleteUserProfile = await (new UserFactory()).hasNoSignature().insertOne()
		// Create dummy complete profile to see if it would return two records or not
		await (new UserFactory()).insertOne()

		const users = await manager.list({ criteria: "incomplete", page: 0 })

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(1)
	})

	it("can list users with complete profile", async () => {
		const manager = new UserManager()
		const completeUserProfile = await (new UserFactory()).insertOne()
		// Create dummy incomplete profile
		await (new UserFactory()).hasNoSignature().insertOne()

		const users = await manager.list({ criteria: "complete", page: 0 })

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(1)
	})

	it("can list all users", async () => {
		const manager = new UserManager()
		const completeUserProfile = await (new UserFactory()).insertOne()
		const incompleteUserProfile =await (new UserFactory()).hasNoSignature().insertOne()

		const users = await manager.list({ criteria: "all", page: 0 })

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(2)
	})

	it("can search users with a specified name", async () => {
		const manager = new UserManager()
		const namesStartWithO = await (new UserFactory())
			.setNameGenerator(() => "O"+faker.random.alpha({
				bannedChars: [ "o", "n", "N" ],
				count: faker.mersenne.rand(7, 1)
			}))
			.insertMany(faker.mersenne.rand(5, 1))
		const namesStartWithN = await (new UserFactory())
			.setNameGenerator(() => "N"+faker.random.alpha({
				bannedChars: [ "n", "N" ],
				count: faker.mersenne.rand(7, 1)
			}))
			.insertMany(faker.mersenne.rand(10, namesStartWithO.length))

		const users = await manager.list({ name: "N", page: 0 })

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(namesStartWithN.length)
	})

	it("cannot search search with non-matching name", async () => {
		const manager = new UserManager()
		await (new UserFactory())
			.setNameGenerator(() => faker.random.alpha({
				bannedChars: [ "n", "N" ],
				count: faker.mersenne.rand(7, 1)
			}))
			.insertMany(faker.mersenne.rand(10, 5))

		const roles = await manager.list({
			name: "N",
			page: 0,
			limit: 1
		})

		expect(roles).toHaveProperty("data")
		expect(roles.data).toHaveLength(0)
	})
})

describe("Database: User Create Operations", () => {
	it("can create user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).makeOne()

		const foundUser = await manager.create(user.toJSON())

		expect(foundUser.email).toStrictEqual(user.email)
		expect(compare(user.password, foundUser.password)).resolves.toBeTruthy()
	})
})

describe("Database: User Update Operations", () => {
	it.todo("update user profile")

	it("can verify user", async () => {
		const manager = new UserManager()
		const user = await ((new UserFactory()).notVerified()).insertOne()

		const verifiedUserCount = await manager.verify(user.email)

		expect(verifiedUserCount).toBe(1)
		expect((await manager.findWithID(user.id))!.emailVerifiedAt).not.toBeNull()
	})
})


describe("Database: User Archive and Restore Operations", () => {
	it("archive user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()

		const deleteCount = await manager.archive(user.id)

		expect(deleteCount).toBe(1)
		expect((
			await User.findOne({
				where: { id: user.id },
				paranoid: true
			})
		)?.deletedAt).not.toBeNull()
	})

	it("restore user", async () => {
		const manager = new UserManager()
		const user = await (new UserFactory()).insertOne()
		await user.destroy({force: false})

		await manager.restore(user.id)

		expect((
			await User.findOne({
				where: { id: user.id }
			})
		)!.deletedAt).toBeNull()
	})
})
