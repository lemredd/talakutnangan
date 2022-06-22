import { Model } from "sequelize-typescript"
import { Transformer, transform, whitelist, ContextBuilder } from "jsonapi-fractal"
import type { Serializable } from "$/types/database"

export default class Serializer {
	private static build<T extends Model>(
		model: T|T[],
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
		model: T|T[],
		transformer: Transformer<T, void>,
		options?: object
	): Serializable {
		const builder = Serializer.build(model, transformer, options)

		return builder.serialize() as Serializable
	}

	static whitelist<T extends Model>(model: T|T[], attributes: string[]) {
		return whitelist(model, attributes)
	}
}
