import type { GeneralObject } from "$/types/general"
import type { Model, ModelCtor } from "%/types/dependent"
import type { GeneratedData, MultipleGeneratedData } from "~/types/dependent"
import type {
	ResourceIdentifier,
	Attributes,
	DeserializedResource,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,
	Resource,
	ResourceDocument,
	ResourceListDocument
} from "$/types/documents/base"
import Transformer from "%/transformers/base"
import deserialize from "$/helpers/deserialize"
import Serializer from "%/transformers/serializer"

/**
 * First generic argument `T` represents the model it controls. Generic argument `U`, `V`, `X`, `A`,
 * and `B` are used for deserialization. Lastly, `C` indicates the type of custom options for
 * transformer.
 */
export default abstract class Factory<
	T extends Model,
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends Resource<U, V>,
	X extends DeserializedResource<string, U, V>,
	Y extends ResourceDocument<U, V, W>,
	Z extends ResourceListDocument<U, V, W>,
	A extends DeserializedResourceDocument<string, U, V, X>,
	B extends DeserializedResourceListDocument<string, U, V, X>,
	C = void
> {
	abstract get model(): ModelCtor<T>

	abstract get transformer(): Transformer<T, C>

	abstract generate(): GeneratedData<T>

	async makeOne(): Promise<T> {
		return this.model.build(await this.generate())
	}

	async insertOne(): Promise<T> {
		const model = await this.model.create(await this.generate())
		return model
	}

	async generateMany(count: number): MultipleGeneratedData<T> {
		const generatedData = []

		for (let i = 0; i < count; i++) {
			generatedData.push(this.generate())
		}

		const model = await Promise.all(generatedData)
		return model
	}

	async makeMany(count: number): Promise<T[]> {
		const generatedMultipleData = await this.generateMany(count)

		return this.model.bulkBuild(generatedMultipleData)
	}

	async insertMany(count: number): Promise<T[]> {
		const generatedMultipleData = await this.generateMany(count)

		const model = await this.model.bulkCreate(generatedMultipleData)
		return model
	}

	async serializedOne(
		options: GeneralObject = {},
		transformer: Transformer<T, C> = this.transformer
	): Promise<Y> {
		const model = await this.makeOne()
		return this.serialize(model, options, transformer) as Y
	}

	async serializedMany(
		count: number,
		options: GeneralObject = {},
		transformer: Transformer<T, C> = this.transformer
	): Promise<Z> {
		const model = await this.makeMany(count)
		return this.serialize(model, options, transformer) as Z
	}

	protected serialize(
		models: T|T[]|null,
		options: GeneralObject = {},
		transformer: Transformer<T, C> = this.transformer
	): Y|Z {
		return Serializer.serialize(
			models,
			transformer,
			options
		) as Y|Z
	}

	async deserializedOne(
		options: GeneralObject = {},
		transformer: Transformer<T, C> = this.transformer
	): Promise<A> {
		const model = await this.makeOne()
		return this.deserialize(model, options, transformer) as A
	}

	async deserializedMany(
		count: number,
		options: GeneralObject = {},
		transformer: Transformer<T, C> = this.transformer
	): Promise<B> {
		const model = await this.makeMany(count)
		return this.deserialize(model, options, transformer) as B
	}

	protected deserialize(
		models: T|T[]|null,
		options: GeneralObject = {},
		transformer: Transformer<T, C> = this.transformer
	): A|B {
		return deserialize(this.serialize(
			models, options, transformer
		)) as A|B
	}
}
