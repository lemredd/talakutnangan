import User from "%/models/user"
import UserFactory from "~/factories/user"
import type { RawUser, Pipe, List } from "%/types/independent"
import type { FindAndCountOptions } from "sequelize"
import type { ModelCtor } from "sequelize-typescript"

import BaseManager from "./base_manager"

class MockUserManager extends BaseManager<User, RawUser> {
	get listPipeline(): Pipe<FindAndCountOptions<User>, any>[] { return [] }

	get model(): ModelCtor<User> { return User }
}

describe("Database: Base Read Operations", () => {
	it("can search base", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).insertOne()
		const id = base.id

		const foundUser = await manager.findWithID(id)

		expect(foundUser!.email).toStrictEqual(base.email)
	})

	it("cannot search base", async () => {
		const manager = new MockUserManager()
		const id = 0

		const foundUser = await manager.findWithID(id)

		expect(foundUser).toBeNull()
	})

	it.todo("can search with pipelines")
})

describe("Database: Base Create Operations", () => {
	it("can create base", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).makeOne()

		const createdDepartment = await manager.create(base.toJSON())

		expect(createdDepartment.email).toStrictEqual(base.email)
	})
})

describe("Database: Base Update Operations", () => {
	it("can update base", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).insertOne()
		const newName = base.name+"1"

		const updateCount = await manager.update(base.id, {
			name: newName
		})

		expect(updateCount).toBe(1)
		expect((
			await User.findOne({
				where: { id: base.id }
			})
		)!.name).not.toBe(base.name)
	})
})

describe("Database: Base Archival and Restoration Operations", () => {
	it("archive base", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).insertOne()

		const deleteCount = await manager.archive(base.id)

		expect(deleteCount).toBe(1)
		expect((
			await User.findOne({
				where: { id: base.id },
				paranoid: true
			})
		)?.deletedAt).not.toBeNull()
	})

	it("restore base", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).insertOne()
		await base.destroy({force: false})

		await manager.restore(base.id)

		expect((
			await User.findOne({
				where: { id: base.id }
			})
		)!.deletedAt).toBeNull()
	})
})
