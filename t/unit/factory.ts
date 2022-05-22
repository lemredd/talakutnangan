import { EntityManager, EntityTarget } from "typeorm"
import Database from "~/database"

export default abstract class Factory<T> {
	#manager: EntityManager = Database.manager
	#model: EntityTarget<T>
	#modelData: object[] = []

	constructor(entity: EntityTarget<T>) {
		this.#model = entity
	}

	abstract generate(): object

	async insertOne() {
		return this.#manager.insert(this.#model, this.#modelData[0] || this.generate())
	}
}
