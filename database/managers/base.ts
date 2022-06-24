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
import Log from "!/helpers/log"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import runThroughPipeline from "$/helpers/run_through_pipeline"

/**
 * A base class for model managers which contains methods for CRUD operations.
 */
export default abstract class Manager<T extends Model, U> {
	abstract get listPipeline(): Pipe<FindAndCountOptions<T>, any>[]

	abstract get model(): ModelCtor<T>

	abstract get transformer(): Transformer<T, void>

	async findWithID(id: number): Promise<Serializable> {
		const model = await this.model.findOne(<FindOptions<T>>{ where: { id } })

		Log.success("manager", "done searching for a model using ID")

		return this.serialize(model)
	}

	async list(query: object): Promise<Serializable> {
		const options: FindAndCountOptions<T> = runThroughPipeline({}, query, this.listPipeline)

		const rows = await this.model.findAll(options)

		Log.success("manager", "done listing models according to constraints")

		return this.serialize(rows)
	}

	async create(details: U & CreationAttributes<T>): Promise<T> {
		const model = await this.model.create(details)

		Log.success("manager", "done creating a model")

		return model
	}

	async update(id: number, details: U & Attributes<T>): Promise<number> {
		const [ affectedCount ] = await this.model.update(details, <UpdateOptions<T>>{
			where: { id }
		})

		Log.success("manager", "done updating a model")

		return affectedCount
	}

	async archive(id: number): Promise<number> {
		const destroyCount = await this.model.destroy(<DestroyOptions<T>>{
			where: { id }
		})

		Log.success("manager", "done archiving a model")

		return destroyCount
	}

	async restore(id: number): Promise<void> {
		await this.model.restore(<RestoreOptions<T>>{
			where: { id }
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
