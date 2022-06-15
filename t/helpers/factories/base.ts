import type { Model, ModelCtor, CreationAttributes } from "%/types/dependent"

export default abstract class Factory<T extends Model> {
	abstract get model(): ModelCtor<T>

	abstract generate(): CreationAttributes<T>

	async makeOne(): Promise<T> {
		return await this.model.build(this.generate())
	}

	async insertOne(): Promise<T> {
		return await this.model.create(this.generate())
	}
}
