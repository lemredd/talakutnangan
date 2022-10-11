import type { GeneralObject, Serializable } from "$/types/general"

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

		if (options) {
			builder = builder.withOptions({ "extra": options as unknown as U })
		}

		return builder
	}

	static async serialize<T extends Model, U = void>(
		model: T|T[]|null,
		transformer: Transformer<T, U>,
		options?: object
	): Promise<Serializable> {
		const builder = Serializer.build(model, transformer, options)
		const resources = builder.serialize() as GeneralObject

		if (Array.isArray(resources.data)) {
			resources.data.forEach(resource => {
				if (resource?.id) {
					resource.id = String(resource.id)
				}
			})
		} else if (resources.data?.id) {
			resources.data.id = String(resources.data.id)
		}

		return await transformer.finalizeTransform(model, resources as Serializable)
	}

	static makeContext<T extends Model, U = void>(
		model: T|T[]|null,
		transformer: Transformer<T, U>,
		options?: object
	): RelationshipTransformerInfo<void, unknown> {
		const builder = Serializer.build(model, transformer, options)

		const context = builder.withIncluded(true).toContext()
		return context as unknown as RelationshipTransformerInfo<void, unknown>
	}

	static whitelist<T extends Model>(model: T|T[]|null, attributes: string[]) {
		return whitelist(model, attributes)
	}
}
