import { FindAndCountOptions, CreationAttributes } from "sequelize"
import { Model, ModelStatic } from "sequelize-typescript"

import type { List, Pipe, FindAndCountFunction, FindOneFunction, CreateFunction, UpdateFunction, DestroyFunction, RestoreFunction } from "%/types"

export default abstract class Manager<T extends Model, U> {
	abstract get listPipeline(): Pipe<FindAndCountOptions<T>>[]

	abstract get findOne(): FindOneFunction<T>

	abstract get findAndCountAll(): FindAndCountFunction<T>

	abstract get create(): CreateFunction<T, U>

	abstract get update(): UpdateFunction<T, U>

	abstract get destroy(): DestroyFunction

	abstract get restore(): RestoreFunction

	async findWithID(id: number): Promise<T|null> {
		return await this.findOne({ where: { id } })
	}

	async list(query: object): List<T> {
		const options: FindAndCountOptions<T> = this.listPipeline.reduce((options, pipe) => {
			return pipe(options, query)
		}, {})

		const { rows, count } = await this.findAndCountAll(options)
		return { records: rows, count }
	}

	async createWithDetails(details: U & CreationAttributes<T>): Promise<T> {
		return await this.create(details)
	}

	async updateWithDetails(id: number, details: U & CreationAttributes<T>): Promise<number> {
		const [ affectedCount ] = await this.update({
			...details
		}, {
			where: { id }
		})

		return affectedCount
	}

	async archiveWithID(id: number): Promise<number> {
		return await this.destroy({
			where: { id }
		})
	}

	async restoreWithID(id: number): Promise<void> {
		return await this.restore({
			where: { id }
		})
	}
}
