import type { Pipe } from "$/types/database"
import type { GeneralObject, Serializable } from "$/types/general"
import type {
	Model,
	ModelCtor,
	Attributes,
	FindOptions,
	UpdateOptions,
	DestroyOptions,
	RestoreOptions,
	CreationAttributes,
	FindAndCountOptions
} from "%/types/dependent"

import Log from "$!/singletons/log"
import CacheClient from "$!/helpers/cache_client"
import encodeToBase64 from "$!/helpers/encode_to_base64"
import RequestEnvironment from "$/helpers/request_environment"
import TransactionManager from "%/managers/helpers/transaction_manager"

import BaseError from "$!/errors/base"
import Transformer from "%/transformers/base"
import DatabaseError from "$!/errors/database"
import Serializer from "%/transformers/serializer"

import page from "%/queries/base/page"
import sort from "%/queries/base/sort"
import Condition from "%/managers/helpers/condition"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import siftByExistence from "%/queries/base/sift_by_existence"

/**
 * A base class for model managers which contains methods for CRUD operations.
 *
 * First generic argument is `T` that represents the model it controls. Second generic argument is
 * `U` that represents the transformer for the model. Third, `V` represents the filter to be used by
 * the manager which is an object by default. Fourth, W which indicates extra options for the
 * transformer if there are.
 */
export default abstract class Manager<
	T extends Model,
	U,
	V extends GeneralObject = GeneralObject,
	W = void
> extends RequestEnvironment {
	protected transaction: TransactionManager
	protected cache: CacheClient

	constructor(
		transaction: TransactionManager = new TransactionManager(),
		cache: CacheClient = new CacheClient(Symbol("unknown client"))
	) {
		super()
		this.transaction = transaction
		this.cache = cache
	}

	abstract get model(): ModelCtor<T>

	abstract get transformer(): Transformer<T, W>

	get listPipeline(): Pipe<FindAndCountOptions<T>, any>[] {
		return [
			siftByExistence,
			page,
			sort
		]
	}

	get singleReadPipeline(): Pipe<FindAndCountOptions<T>, any>[] {
		return [
			siftByExistence
		]
	}

	get cachePath(): string {
		return `database.${this.model.tableName}`
	}

	async findWithID(id: number, constraints: V = ({} as V)): Promise<Serializable> {
		try {
			{
				// @ts-ignore
				if (constraints.filter === undefined) constraints.filter = {}
				if (constraints.filter.existence === undefined)
					constraints.filter.existence = "exists"
				// @ts-ignore
				if (constraints.sort === undefined) constraints.sort = []
			}

			const foundModel = await this.findOneOnColumn("id", id, constraints)

			Log.success("manager", "done searching for a model using ID")

			return foundModel
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async findOneOnColumn(columnName: string, value: any, constraints: V = {} as V)
	: Promise<Serializable> {
		try {
			const uniquePairSubstring = `column_${columnName}_value_${encodeToBase64(value)}`
			const uniqueConstraintSubstring = `constraints_${encodeToBase64(constraints)}`
			const uniqueFindSubstring = `find_one_on_column__${
				uniquePairSubstring
			}__${
				uniqueConstraintSubstring
			}__`
			const uniquePath = `${this.cachePath}.${uniqueFindSubstring}`
			let cachedModel = this.cache.getCache(uniquePath)

			if (cachedModel === null) {
				const condition = new Condition()
				condition.equal(columnName, value)
				const whereOptions: FindOptions<T> = { where: condition.build() }

				const findOptions = runThroughPipeline(whereOptions, constraints, this.singleReadPipeline)

				const model = await this.model.findOne({
					...findOptions,
					...this.transaction.transactionObject
				})

				Log.success("manager", "done searching for a model on a certain column")

				cachedModel = this.serialize(model, { constraints })

				this.cache.setCache(uniquePath, cachedModel)

				Log.success("manager", "cached serialized model")
			}

			Log.success("manager", "used cached serialized model")

			return cachedModel
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async list(constraints: V): Promise<Serializable> {
		try {
			const options: FindAndCountOptions<T> = runThroughPipeline(
				{},
				constraints,
				this.listPipeline
			)

			const { count, rows } = await this.model.findAndCountAll({
				...options,
				...this.transaction.transactionObject
			})

			Log.success("manager", "done listing models according to constraints")

			return this.serialize(rows, { count, constraints })
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async create(details: U & CreationAttributes<T>): Promise<Serializable> {
		try {
			const model = await this.model.create(details, this.transaction.transactionObject)

			Log.success("manager", "done creating a model")

			return this.serialize(model)
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async update(id: number, details: U & Attributes<T>): Promise<number> {
		try {
			const [ affectedCount ] = await this.model.update(details, <UpdateOptions<T>>{
				where: { id },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done updating a model")

			return affectedCount
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async archive(id: number): Promise<number> {
		try {
			const destroyCount = await this.model.destroy(<DestroyOptions<T>>{
				where: { id },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done archiving a model")

			return destroyCount
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async archiveBatch(IDs: number[]): Promise<number> {
		try {
			const destroyCount = await this.model.destroy(<DestroyOptions<T>>{
				where: { id: IDs },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done archiving models")

			return destroyCount
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async restore(id: number): Promise<void> {
		try {
			await this.model.restore(<RestoreOptions<T>>{
				where: { id },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done restoring a model")
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	async restoreBatch(IDs: number[]): Promise<void> {
		try {
			await this.model.restore(<RestoreOptions<T>>{
				where: { id: IDs },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done restoring models")
		} catch(error) {
			throw this.makeBaseError(error)
		}
	}

	get sortableColumns(): string[] {
		return this.exposableColumns
			.flatMap(column => [ column, `-${column}` ])
			.sort()
	}

	protected get exposableColumns(): string[] {
		const attributeInfo = (this.model.getAttributes() as GeneralObject)
		const attributeNames = []

		for (const name in attributeInfo) {
			if (Object.prototype.hasOwnProperty.call(attributeInfo, name)) {
				attributeNames.push(name)
			}
		}

		return attributeNames
	}

	protected serialize<U = Serializable>(models: T|T[]|null, options: GeneralObject = {}): U {
		return Serializer.serialize(
			models,
			this.transformer,
			options
		) as unknown as U
	}

	protected makeBaseError(error: any): BaseError {
		if (error instanceof BaseError) {
			return error
		} else if (error instanceof Error && this.isNotOnProduction) {
			return new DatabaseError(error.message+` (Stack trace: ${error.stack}`)
		} else {
			return new DatabaseError()
		}
	}
}
