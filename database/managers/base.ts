import type { Pipe } from "$/types/database"
import type { CommonFilter } from "$/types/query"
import type { GeneralObject, Serializable } from "$/types/general"
import type { TransactionManagerInterface, SharedManagerState } from "$!/types/dependent"
import type {
	Model,
	ModelCtor,
	Attributes,
	FindOptions,
	UpdateOptions,
	IncludeOptions,
	DestroyOptions,
	RestoreOptions,
	CreationAttributes,
	FindAndCountOptions
} from "%/types/dependent"

import Log from "$!/singletons/log"
import CacheClient from "$!/helpers/cache_client"
import encodeToBase64 from "$!/helpers/encode_to_base64"
import RequestEnvironment from "$/singletons/request_environment"
import TransactionManager from "%/helpers/transaction_manager"

import BaseError from "$!/errors/base"
import Transformer from "%/transformers/base"
import DatabaseError from "$!/errors/database"
import Serializer from "%/transformers/serializer"

import User from "%/models/user"
import page from "%/queries/base/page"
import sort from "%/queries/base/sort"
import Condition from "%/helpers/condition"
import siftByExistence from "%/queries/base/sift_by_existence"
import runThroughPipeline from "$/helpers/run_through_pipeline"

/**
 * A base class for model managers which contains methods for CRUD operations.
 *
 * First generic argument is `T` that represents the model it controls. Second generic argument is
 * `U` that represents the columns of the model. Third, `V` represents the filter to be used by the
 * manager which is an object by default. Fourth, W which indicates extra options for the
 * transformer if there are. Fifth, X indicates the type of primary ID.
 */
export default abstract class Manager<
	T extends Model,
	U,
	V extends GeneralObject = GeneralObject,
	W = void,
	X extends number|string= number,
	Y extends CommonFilter = CommonFilter
> extends RequestEnvironment {
	protected transaction: TransactionManagerInterface
	protected cache: CacheClient

	constructor({
		transaction = new TransactionManager(),
		cache = new CacheClient(Symbol("unknown client"))
	}: Partial<SharedManagerState> = {}) {
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

	async findWithID(
		id: X,
		{
			constraints = {} as Y,
			transformerOptions = {} as W,
			transformer = this.transformer
		}: Partial<{
			constraints: Y,
			transformerOptions: W,
			transformer: Transformer<T, W>
		}> = {}
	): Promise<Serializable> {
		try {
			{
				// @ts-ignore
				if (!constraints.filter) constraints.filter = {}
				if (!constraints.filter.existence) constraints.filter.existence = "exists"
			}

			const foundModel = await this.findOneOnColumn("id", id, {
				constraints,
				transformer,
				transformerOptions
			})

			Log.success("manager", "done searching for a model using ID")

			return foundModel
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	/*
	 * ! Does not differentiate if there is a different transformer used. The cached model that uses
	 * ! a different transformer will still be returned.
	 */
	async findOneOnColumn(
		columnName: string,
		value: any,
		{
			constraints = {} as Y,
			transformerOptions = {} as W,
			transformer = this.transformer
		}: Partial<{
			constraints: Y,
			transformerOptions: W,
			transformer: Transformer<T, W>
		}> = {}
	): Promise<Serializable> {
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
				const whereOptions: FindOptions<T> = { "where": condition.build() }

				const findOptions = runThroughPipeline(
					whereOptions,
					constraints,
					this.singleReadPipeline
				)

				const model = await this.model.findOne({
					...findOptions,
					...this.transaction.transactionObject
				})

				Log.success("manager", "done searching for a model on a certain column")

				cachedModel = this.serialize(model, transformerOptions, transformer)

				this.cache.setCache(uniquePath, cachedModel)

				Log.success("manager", "cached serialized model")
			}

			Log.success("manager", "used cached serialized model")

			return cachedModel
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async list(constraints: V, transformerOptions: W = {} as W): Promise<Serializable> {
		try {
			const options: FindAndCountOptions<T> = runThroughPipeline(
				{},
				constraints,
				this.listPipeline
			)

			const { rows, count } = await this.model.findAndCountAll({
				...options,
				...this.transaction.transactionObject
			})

			Log.success("manager", "done listing models according to constraints")

			const document = this.serialize(rows, transformerOptions)

			if (typeof document.meta === "object") {
				document.meta = {
					...document.meta,
					count
				}
			} else {
				document.meta = { count }
			}

			return document
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async create(
		details: U & CreationAttributes<T>,
		transformerOptions: W = {} as W
	): Promise<Serializable> {
		try {
			const model = await this.model.create(details, this.transaction.transactionObject)

			Log.success("manager", "done creating a model")

			return this.serialize(model, transformerOptions)
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async update(id: X, details: U & Attributes<T>): Promise<number> {
		try {
			const [ affectedCount ] = await this.model.update(details, <UpdateOptions<T>>{
				"where": { id },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done updating a model")

			return affectedCount
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async archive(id: X): Promise<number> {
		try {
			const destroyCount = await this.model.destroy(<DestroyOptions<T>>{
				"where": { id },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done archiving a model")

			return destroyCount
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	/**
	 * Destroys or archives the models with the passed IDs.
	 *
	 * If the model is a paranoid, they will be archived which can be restored later.
	 *
	 * If the model is not paranoid, they will be deleetd permanently.
	 */
	async archiveBatch(IDs: X[]): Promise<number> {
		try {
			const destroyCount = await this.model.destroy(<DestroyOptions<T>>{
				"where": { "id": IDs },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done archiving models")

			return destroyCount
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async restore(id: X): Promise<void> {
		try {
			await this.model.restore(<RestoreOptions<T>>{
				"where": { id },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done restoring a model")
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async restoreBatch(IDs: X[]): Promise<void> {
		try {
			await this.model.restore(<RestoreOptions<T>>{
				"where": { "id": IDs },
				...this.transaction.transactionObject
			})

			Log.success("manager", "done restoring models")
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	/**
	 * Checks if the model belongs to a certain parent model.
	 *
	 * If there are no models passed, model ID and foreign ID will be checked if they are the same.
	 *
	 * @param modelID ID of the model to check
	 * @param parentID ID of the parent  model to match
	 * @param modelsToInclude Any number of "parent" models to include to determine if the model
	 * belongs to the target parent model. Target foreign model should be the last model.
	 */
	async isModelBelongsTo<Z extends number|string = number>(
		modelID: X,
		parentID: Z,
		parentModelChain: readonly ModelCtor<any>[]
	): Promise<boolean> {
		try {
			if (parentModelChain.length === 0) return String(modelID) === String(parentID)

			const foundModel = await this.model.findByPk(modelID, {
				"include": parentModelChain.reduceRight((previousIncludeOptions, currentModel) => {
					const base: IncludeOptions = {
						"model": currentModel,
						"required": true
					}

					if (previousIncludeOptions.length === 0) {
						base.where = new Condition().equal("id", parentID).build()
					} else {
						base.include = previousIncludeOptions
					}

					return [ base ]
				}, [] as IncludeOptions[])
			})

			return foundModel !== null
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	get sortableColumns(): string[] {
		return this.exposableColumns
		.flatMap(column => [ column, `-${column}` ])
		.sort()
	}

	get modelChainToUser(): readonly ModelCtor<Model>[] { return [ User ] }

	protected get exposableColumns(): string[] {
		const attributeInfo = this.model.getAttributes() as GeneralObject
		const attributeNames = []

		for (const name in attributeInfo) {
			if (Object.hasOwn(attributeInfo, name)) {
				attributeNames.push(name)
			}
		}

		return attributeNames
	}

	protected serialize<Z = Serializable>(
		models: T|T[]|null,
		options: W = {} as W,
		transformer: Transformer<T, W> = this.transformer
	): Z {
		return Serializer.serialize(
			models,
			transformer,
			options as GeneralObject
		) as unknown as Z
	}

	protected makeBaseError(error: any): BaseError {
		if (error instanceof BaseError) {
			return error
		} else if (error instanceof Error && this.isNotOnProduction) {
			return new DatabaseError(`${error.message} (Stack trace: ${error.stack}`)
		}

		return new DatabaseError()
	}
}
