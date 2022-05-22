import { EntityTarget, DeepPartial } from "typeorm"
import Database from "~/database"

export default abstract class Factory<T> {
	#model: EntityTarget<T>
	#modelData: DeepPartial<T>[] = []

	constructor(entity: EntityTarget<T>) {
		this.#model = entity
	}

	abstract generate(): DeepPartial<T>

	createOne() {
		Database.manager.create(this.#model, this.#modelData[0] || {} as DeepPartial<T>)
	}
}
