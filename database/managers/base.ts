import type { Serializable, Pipe } from "$/types/database"
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
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import Condition from "%/managers/helpers/condition"
import runThroughPipeline from "$/helpers/run_through_pipeline"
import TransactionManager from "%/managers/helpers/transaction_manager"

/**
 * A base class for model managers which contains methods for CRUD operations.
 */
export default abstract class Manager<T extends Model, U> {
	protected transaction: TransactionManager

	constructor(transaction: TransactionManager = new TransactionManager()) {
		this.transaction = transaction
	}

	abstract get listPipeline(): Pipe<FindAndCountOptions<T>, any>[]

	abstract get model(): ModelCtor<T>

	abstract get transformer(): Transformer<T, void>

	get singleReadPipeline(): Pipe<FindAndCountOptions<T>, any>[] {
		return []
	}

	async findWithID(id: number): Promise<Serializable> {
		const foundModel = await this.findOneOnColumn("id", id)

		Log.success("manager", "done searching for a model using ID")

		return foundModel
	}

	async findOneOnColumn(columnName: string, value: any): Promise<Serializable> {
		const condition = new Condition()
		condition.equal(columnName, value)
		const whereOptions: FindOptions<T> = { where: condition.build() }

		const findOptions = runThroughPipeline(whereOptions, {}, this.singleReadPipeline)

		const model = await this.model.findOne({
			...findOptions,
			...this.transaction.lockedTransactionObject
		})

		Log.success("manager", "done searching for a model on a certain column")

		return this.serialize(model)
	}

	async list(query: object): Promise<Serializable> {
		const options: FindAndCountOptions<T> = runThroughPipeline({}, query, this.listPipeline)

		const rows = await this.model.findAll({
			...options,
			...this.transaction.lockedTransactionObject
		})

		Log.success("manager", "done listing models according to constraints")

		return this.serialize(rows)
	}

	async create(details: U & CreationAttributes<T>): Promise<Serializable> {
		const model = await this.model.create(details, this.transaction.transactionObject)

		Log.success("manager", "done creating a model")

		return this.serialize(model)
	}

	async update(id: number, details: U & Attributes<T>): Promise<number> {
		const [ affectedCount ] = await this.model.update(details, <UpdateOptions<T>>{
			where: { id },
			...this.transaction.transactionObject
		})

		Log.success("manager", "done updating a model")

		return affectedCount
	}

	async archive(id: number): Promise<number> {
		const destroyCount = await this.model.destroy(<DestroyOptions<T>>{
			where: { id },
			...this.transaction.transactionObject
		})

		Log.success("manager", "done archiving a model")

		return destroyCount
	}

	async restore(id: number): Promise<void> {
		await this.model.restore(<RestoreOptions<T>>{
			where: { id },
			...this.transaction.transactionObject
		})

		Log.success("manager", "done restoring a model")
	}

	protected serialize(models: T|T[]|null): Serializable {
		return Serializer.serialize(
			models,
			this.transformer,
			{}
		)
	}
}
