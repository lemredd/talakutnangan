import type { RawUser, Pipe } from "$/types/database"
import type {
	ModelCtor,
	FindAndCountOptions,
	TransformerOptions,
	AttributesObject
} from "%/types/dependent"

import User from "%/models/user"
import Database from "~/set-ups/database"
import UserFactory from "~/factories/user"
import limit from "%/managers/helpers/limit"
import Transformer from "%/transformers/base"
import DatabaseError from "$!/errors/database"
import Serializer from "%/transformers/serializer"
import TransactionManager from "%/managers/helpers/transaction_manager"

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
	private customReadPipe: Pipe<FindAndCountOptions<User>, any>|null

	get singleReadPipeline(): Pipe<FindAndCountOptions<User>, any>[] {
		return [
			this.customReadPipe
		].filter(pipe => pipe !== null) as Pipe<FindAndCountOptions<User>, any>[]
	}

	get listPipeline(): Pipe<FindAndCountOptions<User>, any>[] { return [ limit ] }

	get model(): ModelCtor<User> { return User }

	get transformer(): MockUserTransformer { return new MockUserTransformer() }

	constructor(
		customReadPipe: Pipe<FindAndCountOptions<User>, any>|null = null,
		transaction: TransactionManager = new TransactionManager()
	) {
		super(transaction)
		this.customReadPipe = customReadPipe
	}
}

describe("Database: Base Read Operations", () => {
	it("can search base with ID", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).insertOne()
		const id = base.id

		const foundUser = await manager.findWithID(id)

		expect(foundUser).toHaveProperty("data.attributes.email", base.email)
	})

	it("can search base on specific column", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).insertOne()

		const foundUser = await manager.findOneOnColumn("name", base.name)

		expect(foundUser).toHaveProperty("data.attributes.email", base.email)
	})

	it("can search base with ID through transaction", async () => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await (new UserFactory()).insertOne()
		const id = base.id

		await transaction.initialize()
		const foundUser = await manager.findWithID(id)
		const transactionObject = transaction.lockedTransactionObject
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("lock", true)
		expect(foundUser).toHaveProperty("data.attributes.email", base.email)
	})

	it("can search base with ID and custom read pipe", async () => {
		const pipe = jest.fn()
		const manager = new MockUserManager(options => {
			pipe()
			return options
		})
		const base = await (new UserFactory()).insertOne()
		const id = base.id

		const foundUser = await manager.findWithID(id)

		expect(pipe).toHaveBeenCalled()
		expect(foundUser).toHaveProperty("data.attributes.email", base.email)
	})

	it("cannot search non-existing base with ID", async () => {
		const manager = new MockUserManager()
		const id = 0

		const foundUser = await manager.findWithID(id)

		expect(foundUser.data).toBeNull()
	})

	it("cannot find non-existing base with custom column", async () => {
		const manager = new MockUserManager()

		const foundUser = await manager.findOneOnColumn("name", "Hello")

		expect(foundUser.data).toBeNull()
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

		expect(createdDepartment).toHaveProperty("data.attributes.email", base.email)
	})

	it("can create base through transaction", async () => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await (new UserFactory()).makeOne()

		await transaction.initialize()
		const createdDepartment = await manager.create(base.toJSON())
		const transactionObject = transaction.transactionObject
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
		expect(createdDepartment).toHaveProperty("data.attributes.email", base.email)
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

	it("can update base through transaction", async () => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await (new UserFactory()).insertOne()
		const newName = base.name+"1"

		await transaction.initialize()
		const updateCount = await manager.update(base.id, {
			name: newName
		})
		const transactionObject = transaction.transactionObject
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
		expect(updateCount).toBe(1)
		expect((
			await User.findOne({
				where: { id: base.id }
			})
		)!.name).not.toBe(base.name)
	})
})

describe("Database: Base Archive and Restore Operations", () => {
	it("can archive base", async () => {
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

	it("can restore base", async () => {
		const manager = new MockUserManager()
		const base = await (new UserFactory()).insertOne()
		await base.destroy({ force: false })

		await manager.restore(base.id)

		expect((
			await User.findOne({
				where: { id: base.id }
			})
		)!.deletedAt).toBeNull()
	})

	it("can archive base through transaction", async () => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await (new UserFactory()).insertOne()

		await transaction.initialize()
		const deleteCount = await manager.archive(base.id)
		const transactionObject = transaction.transactionObject
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
		expect(deleteCount).toBe(1)
		expect((
			await User.findOne({
				where: { id: base.id },
				paranoid: true
			})
		)?.deletedAt).not.toBeNull()
	})

	it("can restore base through transaction", async () => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await (new UserFactory()).insertOne()
		await base.destroy({ force: false })

		await transaction.initialize()
		await manager.restore(base.id)
		const transactionObject = transaction.transactionObject
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
		expect((
			await User.findOne({
				where: { id: base.id }
			})
		)!.deletedAt).toBeNull()
	})

	it("can archive multiple bases", async () => {
		const manager = new MockUserManager()
		const bases = await (new UserFactory()).insertMany(3)

		const deleteCount = await manager.archiveBatch(bases.map(base => base.id))

		expect(deleteCount).toBe(3)
		expect((
			await User.findOne({
				where: { id: bases[0].id },
				paranoid: true
			})
		)?.deletedAt).not.toBeNull()
		expect((
			await User.findOne({
				where: { id: bases[1].id },
				paranoid: true
			})
		)?.deletedAt).not.toBeNull()
		expect((
			await User.findOne({
				where: { id: bases[2].id },
				paranoid: true
			})
		)?.deletedAt).not.toBeNull()
	})

	it("can restore multiple bases", async () => {
		const manager = new MockUserManager()
		const bases = await (new UserFactory()).insertMany(3)
		await bases[0].destroy({ force: false })
		await bases[1].destroy({ force: false })
		await bases[2].destroy({ force: false })

		await manager.restoreBatch(bases.map(base => base.id))

		expect((
			await User.findOne({
				where: { id: bases[0].id }
			})
		)!.deletedAt).toBeNull()
		expect((
			await User.findOne({
				where: { id: bases[1].id }
			})
		)!.deletedAt).toBeNull()
		expect((
			await User.findOne({
				where: { id: bases[2].id }
			})
		)!.deletedAt).toBeNull()
	})
})

describe("Database: Error handling down errors", () => {
	beforeEach(async () => {
		await Database.destroy()
	})

	it("can handle down errors", async () => {
		const manager = new MockUserManager()
		const id = 0

		expect(manager.findWithID(id)).rejects.toThrow(DatabaseError)
	})
})
