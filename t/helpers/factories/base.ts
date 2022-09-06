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
 * First generic argument `T` represents the model it controls. Generic argument `U`, `V`, `Y`, `B`,
 * and `C` are used for deserialization. Lastly, `D` indicates the type of custom options for
 * transformer.
 */
export default abstract class Factory<
	T extends Model,
	U extends ResourceIdentifier<"read">,
	V extends Attributes<"serialized">,
	W extends Attributes<"deserialized">,
	X extends Resource<"read", U, V>,
	Y extends DeserializedResource<U, W>,
	Z extends ResourceDocument<"read", U, V, X>,
	A extends ResourceListDocument<"read", U, V, X>,
	B extends DeserializedResourceDocument<U, W, Y>,
	C extends DeserializedResourceListDocument<U, W, Y>,
	D = void
> {
	abstract get model(): ModelCtor<T>

	abstract get transformer(): Transformer<T, D>

	abstract generate(): GeneratedData<T>

	async makeOne(): Promise<T> {
		const model = this.model.build(await this.generate())
		return this.attachRelatedModels(model)
	}

	async insertOne(): Promise<T> {
		const model = await this.model.create(await this.generate())
		return this.attachRelatedModels(model)
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

		const models = this.model.bulkBuild(generatedMultipleData)
		return await Promise.all(models.map(model => this.attachRelatedModels(model)))
	}

	async insertMany(count: number): Promise<T[]> {
		const generatedMultipleData = await this.generateMany(count)

		const models = await this.model.bulkCreate(generatedMultipleData)
		return await Promise.all(models.map(model => this.attachRelatedModels(model)))
	}

	async attachRelatedModels(model: T): Promise<T> { return await Promise.resolve(model) }

	async serializedOne(
		mustInsert = false,
		options: D = {} as D,
		transformer: Transformer<T, D> = this.transformer
	): Promise<Z> {
		const model = mustInsert ? await this.insertOne() : await this.makeOne()
		return this.serialize(model, options, transformer) as Z
	}

	async serializedMany(
		count: number,
		mustInsert = false,
		options: D = {} as D,
		transformer: Transformer<T, D> = this.transformer
	): Promise<A> {
		const model = mustInsert ? await this.insertMany(count) : await this.makeMany(count)
		return this.serialize(model, options, transformer) as A
	}

	public serialize(
		models: T|T[]|null,
		options: D = {} as D,
		transformer: Transformer<T, D> = this.transformer
	): Z|A {
		return Serializer.serialize(
			models,
			transformer,
			options as GeneralObject
		) as Z|A
	}

	public deserialize(
		models: T|T[]|null,
		options: D = {} as D,
		transformer: Transformer<T, D> = this.transformer
	): B|C {
		return deserialize(this.serialize(models, options, transformer)) as B|C
	}

	async deserializedOne(
		mustInsert = false,
		options: D = {} as D,
		transformer: Transformer<T, D> = this.transformer
	): Promise<B> {
		return deserialize(await this.serializedOne(mustInsert, options, transformer)) as B
	}

	async deserializedMany(
		count: number,
		mustInsert = false,
		options: D = {} as D,
		transformer: Transformer<T, D> = this.transformer
	): Promise<C> {
		return deserialize(await this.serializedMany(count, mustInsert, options, transformer)) as C
	}
}
