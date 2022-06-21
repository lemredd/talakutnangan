import type { RawUser, Pipe } from "$/types/database"
import type {
	ModelCtor,
	FindAndCountOptions,
	TransformerOptions,
	AttributesObject
} from "%/types/dependent"

import User from "%/models/user"
import UserFactory from "~/factories/user"
import limit from "%/managers/helpers/limit"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"

import BaseManager from "./base"

class MockUserTransformer extends Transformer<User, void> {
	constructor() {
		super()
		this.type = "user"
	}

	transform(model: User|User[], options: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"email",
			"kind"
		])

		return safeObject
	}
}

class MockUserManager extends BaseManager<User, RawUser> {
	get listPipeline(): Pipe<FindAndCountOptions<User>, any>[] { return [ limit ] }

	get model(): ModelCtor<User> { return User }

	get transformer(): MockUserTransformer { return new MockUserTransformer() }
}

describe("Database: Base Read Operations", () => {
	it("can search base with ID", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).insertOne()
		const id = base.id

		const foundUser = await manager.findWithID(id)

		expect(foundUser!.email).toStrictEqual(base.email)
	})

	it("cannot search non-existing base with ID", async () => {
		const manager = new MockUserManager()
		const id = 0

		const foundUser = await manager.findWithID(id)

		expect(foundUser).toBeNull()
	})

	it("can list base", async () => {
		const manager = new MockUserManager()
		const bases = await (new UserFactory()).insertMany(5)

		const users = await manager.list({})

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(bases.length)
	})

	it("can search with pipelines", async() => {
		const manager = new MockUserManager()
		await (new UserFactory()).insertMany(10)

		const users = await manager.list({ limit: 5 })

		expect(users).toHaveProperty("data")
		expect(users.data).toHaveLength(5)
	})
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

describe("Database: Base Archive and Restore Operations", () => {
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
