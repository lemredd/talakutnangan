import type { Model, ModelCtor } from "%/types/dependent"
import type { GeneratedData, MultipleGeneratedData } from "~/types/dependent"

export default abstract class Factory<T extends Model> {
	abstract get model(): ModelCtor<T>

	abstract generate(): GeneratedData<T>

	async makeOne(): Promise<T> {
		return this.model.build(await this.generate())
	}

	async insertOne(): Promise<T> {
		return await this.model.create(await this.generate())
	}

	async generateMany(count: number): MultipleGeneratedData<T> {
		const generatedData = []

		for(let i = 0; i < count; i++) {
			generatedData.push(this.generate())
		}

		return await Promise.all(generatedData)
	}

	async makeMany(count: number): Promise<T[]> {
		const generatedMultipleData = await this.generateMany(count)

		return this.model.bulkBuild(generatedMultipleData)
	}

	async insertMany(count: number): Promise<T[]> {
		const generatedMultipleData = await this.generateMany(count)

		return await this.model.bulkCreate(generatedMultipleData)
	}
}
