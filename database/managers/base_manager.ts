import type {
	Attributes,
	FindOptions,
	UpdateOptions,
	DestroyOptions,
	RestoreOptions,
	CreationAttributes,
	FindAndCountOptions
} from "sequelize"
import type { Model, ModelCtor } from "sequelize-typescript"

import type { List, Pipe } from "%/types"

export default abstract class Manager<T extends Model, U> {
	abstract get listPipeline(): Pipe<FindAndCountOptions<T>>[]

	abstract get model(): ModelCtor<T>

	async findWithID(id: number): Promise<T|null> {
		return await this.model.findOne(<FindOptions>{ where: { id } })
	}

	async list(query: object): List<T> {
		const options: FindAndCountOptions<T> = this.listPipeline.reduce((options, pipe) => {
			return pipe(options, query)
		}, {})

		const { rows, count } = await this.model.findAndCountAll(options)
		return { records: rows, count }
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
