import type { GeneralObject } from "$/types/general"
import type { Model, ModelCtor } from "%/types/dependent"
import type { GeneratedData, MultipleGeneratedData } from "~/types/dependent"
import type {
	ResourceIdentifier,
	Attributes,
	DeserializedResource,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"
import Transformer from "%/transformers/base"
import deserialize from "$/helpers/deserialize"
import Serializer from "%/transformers/serializer"

/**
 * First generic argument `T` represents the model it controls. Generic argument `U`, `V`, `W`, `X`,
 * and `Y` are used for deserialization. Lastly, `Z` indicates the type of custom options for
 * transformer.
 */
export default abstract class Factory<
	T extends Model,
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends DeserializedResource<U, V>,
	X extends DeserializedResourceDocument<U, V, W>,
	Y extends DeserializedResourceListDocument<U, V, W>,
	Z = void
> {
	abstract get model(): ModelCtor<T>

	abstract get transformer(): Transformer<T, Z>

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

	async deserializedOne(options: GeneralObject = {}): Promise<X> {
		const model = await this.makeOne()
		return this.deserialize(model, options) as X
	}

	async deserializedMany(count: number, options: GeneralObject = {}): Promise<Y> {
		const model = await this.makeMany(count)
		return this.deserialize(model, options) as Y
	}

	protected deserialize(models: T|T[]|null, options: GeneralObject = {}): X|Y {
		return deserialize(Serializer.serialize(
			models,
			this.transformer,
			options
		)) as X|Y
	}
}
