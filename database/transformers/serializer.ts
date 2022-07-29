import type { Serializable } from "$/types/database"

import { Model } from "sequelize-typescript"
import {
	transform,
	whitelist,
	ContextBuilder,
	RelationshipTransformerInfo
} from "jsonapi-fractal"
import Transformer from "%/transformers/base"

export default class Serializer {
	private static build<T extends Model, U = void>(
		model: T|T[]|null,
		transformer: Transformer<T, U>,
		options?: object
	): ContextBuilder<T, U> {
		let builder = transform<T, U>()
			.withInput(model as unknown as T)
			.withTransformer(transformer)

		if (options !== undefined) {
			builder = builder.withOptions(options)
		}

		return builder
	}

	static serialize<T extends Model, U = void>(
		model: T|T[]|null,
		transformer: Transformer<T, U>,
		options?: object
	): Serializable {
		const builder = Serializer.build(model, transformer, options)

		return transformer.finalizeTransform(builder.serialize() as Serializable)
	}

	static makeContext<T extends Model, U = void>(
		model: T|T[]|null,
		transformer: Transformer<T, U>,
		options?: object
	): RelationshipTransformerInfo<void, unknown> {
		const builder = Serializer.build(model, transformer, options)

		return builder.withIncluded(true).toContext() as unknown as RelationshipTransformerInfo<void, unknown>
	}

	static whitelist<T extends Model>(model: T|T[]|null, attributes: string[]) {
		return whitelist(model, attributes)
	}
}
