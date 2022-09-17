/* eslint-disable max-lines */
import type { Pipe } from "$/types/database"
import type { RawUser } from "$!/types/independent"
import type {
	ModelCtor,
	FindAndCountOptions,
	TransformerOptions,
	AttributesObject
} from "%/types/dependent"
import type CacheClient from "$!/helpers/cache_client"

import User from "%/models/user"
import Database from "~/set-ups/database"
import UserFactory from "~/factories/user"
import Transformer from "%/transformers/base"
import DatabaseError from "$!/errors/database"
import Serializer from "%/transformers/serializer"
import TransactionManager from "%/helpers/transaction_manager"

import BaseManager from "./base"

class MockUserTransformer extends Transformer<User, void> {
	constructor() {
		super("user")
	}

	transform(model: User|User[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"email",
			"kind",
			"deletedAt"
		])

		return safeObject
	}
}

class MockUserManager extends BaseManager<User, RawUser> {
	private customReadPipe: Pipe<FindAndCountOptions<User>, any>|null

	get singleReadPipeline(): Pipe<FindAndCountOptions<User>, any>[] {
		return [
			this.customReadPipe,
			...super.singleReadPipeline
		].filter(pipe => pipe !== null) as Pipe<FindAndCountOptions<User>, any>[]
	}

	get model(): ModelCtor<User> { return User }

	get transformer(): MockUserTransformer { return new MockUserTransformer() }

	constructor(
		customReadPipe: Pipe<FindAndCountOptions<User>, any>|null = null,
		transaction: TransactionManager = new TransactionManager(),
		cache: CacheClient = new (jest.fn(() => ({
			"getCache": jest.fn(() => null),
			"setCache": jest.fn()
		})))() as unknown as CacheClient
	) {
		super({
			cache,
			transaction
		})
		this.customReadPipe = customReadPipe
	}

	protected get exposableColumns(): string[] {
		return [ "id", "name", "email" ]
	}
}

describe("Database Manager: Base Read Operations", () => {
	it("can search base with ID", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()
		const { id } = base

		const foundUser = await manager.findWithID(id)

		expect(foundUser).toHaveProperty("data.attributes.email", base.email)
	})

	it("can search base on specific column", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()

		const foundUser = await manager.findOneOnColumn("name", base.name, {
			"filter": {
				"existence": "exists"
			}
		})

		expect(foundUser).toHaveProperty("data.attributes.email", base.email)
	})

	it("can search base with ID through transaction", async() => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await new UserFactory().insertOne()
		const { id } = base

		await transaction.initialize()
		const foundUser = await manager.findWithID(id)
		const transactionObject = transaction.lockedTransactionObject
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("lock", true)
		expect(foundUser).toHaveProperty("data.attributes.email", base.email)
	})

	it("can search base with ID and custom read pipe", async() => {
		const pipe = jest.fn()
		const manager = new MockUserManager(options => {
			pipe()
			return options
		})
		const base = await new UserFactory().insertOne()
		const { id } = base

		const foundUser = await manager.findWithID(id)

		expect(pipe).toHaveBeenCalled()
		expect(foundUser).toHaveProperty("data.attributes.email", base.email)
	})

	it("cannot search non-existing base with ID", async() => {
		const manager = new MockUserManager()
		const id = 0

		const foundUser = await manager.findWithID(id)

		expect(foundUser.data).toBeNull()
	})

	it("cannot find non-existing base with custom column", async() => {
		const manager = new MockUserManager()

		const foundUser = await manager.findOneOnColumn("name", "Hello", {
			"filter": {
				"existence": "exists"
			}
		})

		expect(foundUser.data).toBeNull()
	})

	it("can list base", async() => {
		const manager = new MockUserManager()
		await new UserFactory().insertMany(5)

		const models = await manager.list({
			"filter": {
				"existence": "exists"
			},
			"page": {
				"limit": 3,
				"offset": 0
			},
			"sort": [ "name" ]
		})

		expect(models).toHaveProperty("data")
		expect(models.data).toHaveLength(3)
	})

	it("can search with pipelines", async() => {
		const manager = new MockUserManager()
		await new UserFactory().insertMany(10)

		const models = await manager.list({
			"filter": {
				"existence": "exists"
			},
			"page": {
				"limit": 5,
				"offset": 0
			},
			"sort": [ "name" ]
		})

		expect(models).toHaveProperty("data")
		expect(models.data).toHaveLength(5)
	})

	it("can find on one column with existing", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()

		const model = await manager.findOneOnColumn("name", base.name, {
			"filter": {
				"existence": "exists"
			}
		})

		expect(model).toHaveProperty("data")
		expect(model.data).toHaveProperty("type", "user")
	})

	it("cannot find on one column with existing if destroyed already", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()
		await base.destroy({ "force": false })

		const model = await manager.findOneOnColumn("name", base.name, {
			"filter": {
				"existence": "exists"
			}
		})

		expect(model).toHaveProperty("data")
		expect(model.data).toBeNull()
	})

	it("can find on one column with archived", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()
		await base.destroy({ "force": false })

		const model = await manager.findOneOnColumn("name", base.name, {
			"filter": {
				"existence": "archived"
			}
		})

		expect(model).toHaveProperty("data")
		expect(model.data).toHaveProperty("type", "user")
	})

	it("cannot find on one column with archived if still exists", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()

		const model = await manager.findOneOnColumn("name", base.name, {
			"filter": {
				"existence": "archived"
			}
		})

		expect(model).toHaveProperty("data")
		expect(model.data).toBeNull()
	})

	it("can find on one column with existing that is cached", async() => {
		let cachedModel: any = null
		const getCache = jest.fn(unusedValue => cachedModel)
		const setCache = jest.fn((path, value) => {
			cachedModel = value
		})
		const Cache = jest.fn(() => ({
			getCache,
			setCache
		}))
		// eslint-disable-next-line no-undefined
		const manager = new MockUserManager(null, undefined, new Cache() as unknown as CacheClient)
		const base = await new UserFactory().insertOne()

		const model = await manager.findOneOnColumn("name", base.name, {
			"filter": {
				"existence": "exists"
			}
		})
		const sameUser = await manager.findOneOnColumn("name", base.name, {
			"filter": {
				"existence": "exists"
			}
		})

		expect(getCache).toHaveBeenCalledTimes(2)
		expect(setCache).toHaveBeenCalledTimes(1)
		expect(model).toHaveProperty("data")
		expect(model.data).toHaveProperty("type", "user")
		expect(model).toStrictEqual(sameUser)
	})

	it("can check if model belongs to a user", async() => {
		const manager = new MockUserManager()
		const model = await new UserFactory().insertOne()
		const IDOfModelToCheck = model.id
		const ownerIDToMatch = model.id

		const hasFound = await manager.isModelBelongsTo(IDOfModelToCheck, ownerIDToMatch, [])

		expect(hasFound).toBeTruthy()
	})

	it("can check if model not belongs to a user", async() => {
		const manager = new MockUserManager()
		const model = await new UserFactory().insertOne()
		const IDOfModelToCheck = model.id
		const ownerIDToMatch = model.id + 1

		const hasFound = await manager.isModelBelongsTo(IDOfModelToCheck, ownerIDToMatch, [])

		expect(hasFound).toBeFalsy()
	})
})

describe("Database Manager: Base Create Operations", () => {
	it("can create base", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().makeOne()

		const createdDepartment = await manager.create(base.toJSON())

		expect(createdDepartment).toHaveProperty("data.attributes.email", base.email)
	})

	it("can create base through transaction", async() => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await new UserFactory().makeOne()

		await transaction.initialize()
		const createdDepartment = await manager.create(base.toJSON())
		const { transactionObject } = transaction
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
		expect(createdDepartment).toHaveProperty("data.attributes.email", base.email)
	})
})

describe("Database Manager: Base Update Operations", () => {
	it("can update base", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()
		const newName = `${base.name}1`

		const updateCount = await manager.update(base.id, {
			"name": newName
		})

		expect(updateCount).toBe(1)
		expect((
			await User.findOne({
				"where": { "id": base.id }
			})
		)?.name).not.toBe(base.name)
	})

	it("can update base through transaction", async() => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await new UserFactory().insertOne()
		const newName = `${base.name}1`

		await transaction.initialize()
		const updateCount = await manager.update(base.id, {
			"name": newName
		})
		const { transactionObject } = transaction
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
		expect(updateCount).toBe(1)
		expect((
			await User.findOne({
				"where": { "id": base.id }
			})
		)?.name).not.toBe(base.name)
	})
})

describe("Database Manager: Base Archive and Restore Operations", () => {
	it("can archive base", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()

		const deleteCount = await manager.archive(base.id)

		expect(deleteCount).toBe(1)
		expect((
			await User.findOne({
				"paranoid": true,
				"where": { "id": base.id }
			})
		)?.deletedAt).not.toBeNull()
	})

	it("can restore base", async() => {
		const manager = new MockUserManager()
		const base = await new UserFactory().insertOne()
		await base.destroy({ "force": false })

		await manager.restore(base.id)

		expect((
			await User.findOne({
				"where": { "id": base.id }
			})
		)?.deletedAt).toBeNull()
	})

	it("can archive base through transaction", async() => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await new UserFactory().insertOne()

		await transaction.initialize()
		const deleteCount = await manager.archive(base.id)
		const { transactionObject } = transaction
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
		expect(deleteCount).toBe(1)
		expect((
			await User.findOne({
				"paranoid": true,
				"where": { "id": base.id }
			})
		)?.deletedAt).not.toBeNull()
	})

	it("can restore base through transaction", async() => {
		const transaction = new TransactionManager()
		const manager = new MockUserManager(null, transaction)
		const base = await new UserFactory().insertOne()
		await base.destroy({ "force": false })

		await transaction.initialize()
		await manager.restore(base.id)
		const { transactionObject } = transaction
		await transaction.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
		expect((
			await User.findOne({
				"where": { "id": base.id }
			})
		)?.deletedAt).toBeNull()
	})

	it("can archive multiple bases", async() => {
		const manager = new MockUserManager()
		const bases = await new UserFactory().insertMany(3)

		const deleteCount = await manager.archiveBatch(bases.map(base => base.id))

		expect(deleteCount).toBe(3)
		expect((
			await User.findOne({
				"paranoid": true,
				"where": { "id": bases[0].id }
			})
		)?.deletedAt).not.toBeNull()
		expect((
			await User.findOne({
				"paranoid": true,
				"where": { "id": bases[1].id }
			})
		)?.deletedAt).not.toBeNull()
		expect((
			await User.findOne({
				"paranoid": true,
				"where": { "id": bases[2].id }
			})
		)?.deletedAt).not.toBeNull()
	})

	it("can restore multiple bases", async() => {
		const manager = new MockUserManager()
		const bases = await new UserFactory().insertMany(3)
		await bases[0].destroy({ "force": false })
		await bases[1].destroy({ "force": false })
		await bases[2].destroy({ "force": false })

		await manager.restoreBatch(bases.map(base => base.id))

		expect(
			(await User.findOne({
				"where": { "id": bases[0].id }
			}))?.deletedAt
		).toBeNull()
		expect(
			(await User.findOne({
				"where": { "id": bases[1].id }
			}))?.deletedAt
		).toBeNull()
		expect(
			(await User.findOne({
				"where": { "id": bases[2].id }
			}))?.deletedAt
		).toBeNull()
	})
})

describe("Database Manager: Error handling down errors", () => {
	beforeEach(async() => {
		await Database.destroy()
	})

	it("can handle down errors", () => {
		const manager = new MockUserManager()
		const id = 0

		expect(manager.findWithID(id)).rejects.toThrow(DatabaseError)
	})
})

describe("Database Manager: Miscellaneous operations", () => {
	it("can get sortable columns", () => {
		const manager = new MockUserManager()

		const { sortableColumns } = manager

		expect(sortableColumns).toEqual([
			"-email",
			"-id",
			"-name",
			"email",
			"id",
			"name"
		])
	})
})
