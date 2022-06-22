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

	async findWithID(id: number): Promise<T|null> {
		return await this.model.findOne(<FindOptions<T>>{ where: { id } })
	}

	async list(query: object): Promise<Serializable> {
		const options: FindAndCountOptions<T> = runThroughPipeline({}, query, this.listPipeline)

		const { rows, count } = await this.model.findAndCountAll(options)

		const transformer = this.transformer

		const serializableData = Serializer.serialize(
			rows,
			transformer,
			{}
		)

		return serializableData
	}

	async create(details: U & CreationAttributes<T>): Promise<T> {
		return await this.model.create(details)
	}

	async update(id: number, details: U & Attributes<T>): Promise<number> {
		const [ affectedCount ] = await this.model.update(details, <UpdateOptions<T>>{
			where: { id }
		})

		return affectedCount
	}

	async archive(id: number): Promise<number> {
		return await this.model.destroy(<DestroyOptions<T>>{
			where: { id }
		})
	}

	async restore(id: number): Promise<void> {
		return await this.model.restore(<RestoreOptions<T>>{
			where: { id }
		})
	}
}
