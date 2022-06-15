import type { GeneratedData } from "~/types/dependent"
import type { Model, ModelCtor, CreationAttributes } from "%/types/dependent"

export default abstract class Factory<T extends Model> {
	abstract get model(): ModelCtor<T>

	abstract generate(): GeneratedData<T>

	async makeOne(): Promise<T> {
		return await this.model.build(await this.generate())
	}

	async insertOne(): Promise<T> {
		return await this.model.create(await this.generate())
	}
}
