import { faker } from "@faker-js/faker"

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
		// Create dummy complete profile
		await (new UserFactory()).insertOne()

		const { records, count } = await manager.list({ criteria: "incomplete", page: 0 })

		expect(count).toBe(1)
		expect(records).toHaveLength(1)
		expect(records[0].email).toStrictEqual(incompleteUserProfile.email)
	})

	it("can list users with complete profile", async () => {
		const manager = new UserManager()
		const completeUserProfile = await (new UserFactory()).insertOne()
		// Create dummy incomplete profile
		await (new UserFactory()).hasNoSignature().insertOne()

		const { records, count } = await manager.list({ criteria: "complete", page: 0 })

		expect(count).toBe(1)
		expect(records).toHaveLength(1)
		expect(records[0].email).toStrictEqual(completeUserProfile.email)
	})

	it("can list all users", async () => {
		const manager = new UserManager()
		const completeUserProfile = await (new UserFactory()).insertOne()
		const incompleteUserProfile =await (new UserFactory()).hasNoSignature().insertOne()

		const { records, count } = await manager.list({ criteria: "all", page: 0 })

		expect(count).toBe(2)
		expect(records).toHaveLength(2)
		expect(records[0].email).toStrictEqual(completeUserProfile.email)
		expect(records[1].email).toStrictEqual(incompleteUserProfile.email)
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

		const { records, count } = await manager.list({name: "N", page: 0 })

		expect(count).toBe(namesStartWithN.length)
		expect(records).toHaveLength(namesStartWithN.length)
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

	it.todo("update user profile")
	it.todo("archive user")
	it.todo("restore user")
})

describe("Extra: Custom Operations", () => {
	it("can verify user", async () => {
		const manager = new UserManager()
		const user = await ((new UserFactory()).notVerified()).insertOne()

		const verifiedUserCount = await manager.verify(user.email)

		expect(verifiedUserCount).toBe(1)
		expect((await manager.findWithID(user.id))!.emailVerifiedAt).not.toBeNull()
	})
})
