import { EntityManager, EntityTarget, FindOptionsWhere } from "typeorm"
import Database from "~/database"

export default abstract class Factory<T> {
	#manager: EntityManager = Database.manager
	#model: EntityTarget<T>
	#modelData: object[] = []

	constructor(entity: EntityTarget<T>) {
		this.#model = entity
	}

	abstract generate(): object

	async insertOne(): Promise<T> {
		const result = await this.#manager.insert(this.#model, this.#modelData[0] || this.generate())
		return await this.#manager.findOne(this.#model, {
			where: result.identifiers[0] as FindOptionsWhere<T>
		})
	}
}
