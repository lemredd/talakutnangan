import { Model } from "sequelize-typescript"
import {
	Transformer,
	transform,
	whitelist,
	ContextBuilder,
	RelationshipTransformerInfo
} from "jsonapi-fractal"
import type { Serializable } from "$/types/database"

export default class Serializer {
	private static build<T extends Model>(
		model: T|T[]|null,
		transformer: Transformer<T, void>,
		options?: object
	): ContextBuilder<T, void> {
		let builder = transform<T, void>()
			.withInput(model as unknown as T)
			.withTransformer(transformer)

		if (options !== undefined) {
			builder = builder.withOptions(options)
		}

		return builder
	}

	static serialize<T extends Model>(
		model: T|T[]|null,
		transformer: Transformer<T, void>,
		options?: object
	): Serializable {
		const builder = Serializer.build(model, transformer, options)

		return builder.serialize() as Serializable
	}

	static makeContext<T extends Model>(
		model: T|T[]|null,
		transformer: Transformer<T, void>,
		options?: object
	): RelationshipTransformerInfo<void, unknown> {
		const builder = Serializer.build(model, transformer, options)

		return builder.withIncluded(true).toContext() as RelationshipTransformerInfo<void, unknown>
	}

	static whitelist<T extends Model>(model: T|T[]|null, attributes: string[]) {
		return whitelist(model, attributes)
	}
}
